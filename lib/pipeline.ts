import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { pickMoments, scoreToGrade } from "./claude";
import { completeWithClaude } from "./claude-client";

const DEFAULT_HIGHLIGHT_COLOR = "#FFD60A";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, ".data", "jobs");
const PUBLIC_GENERATED = path.join(ROOT, "public", "generated");
const PIPELINE_DIR = path.join(ROOT, "pipeline");
const PYTHON = "python3";

export interface JobSource {
  type: "youtube" | "upload";
  url?: string;
  uploadPath?: string;
  fileName?: string;
}

export interface ClipResult {
  id: string;
  title: string;
  start: number;
  end: number;
  duration: number;
  grade: string;
  viralScore: number;
  hook: number;
  payoff: number;
  curiosity: number;
  pacing: number;
  standalone: number;
  analysis: string;
  transcript: string;
  highlightColor: string;
  url: string;
}

export type JobStage =
  | "queued"
  | "downloading"
  | "transcribing"
  | "analyzing"
  | "rendering"
  | "done"
  | "error";

export interface JobStatus {
  id: string;
  status: JobStage;
  message?: string;
  error?: string;
  title?: string;
  sourceDuration?: number;
  clips: ClipResult[];
  createdAt: string;
  updatedAt: string;
}

function jobDir(id: string) {
  return path.join(DATA_DIR, id);
}

function statusPath(id: string) {
  return path.join(jobDir(id), "status.json");
}

export async function readStatus(id: string): Promise<JobStatus | null> {
  try {
    const raw = await fs.readFile(statusPath(id), "utf-8");
    return JSON.parse(raw) as JobStatus;
  } catch {
    return null;
  }
}

export async function listJobs(): Promise<JobStatus[]> {
  let ids: string[];
  try {
    ids = await fs.readdir(DATA_DIR);
  } catch {
    return [];
  }
  const jobs = await Promise.all(ids.map((id) => readStatus(id)));
  return jobs
    .filter((j): j is JobStatus => j !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function writeStatus(
  id: string,
  patch: Partial<JobStatus>
): Promise<JobStatus> {
  const current = (await readStatus(id)) ??
    ({
      id,
      status: "queued",
      clips: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } satisfies JobStatus);
  const next: JobStatus = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(jobDir(id), { recursive: true });
  await fs.writeFile(statusPath(id), JSON.stringify(next, null, 2));
  return next;
}

/** Scripts print one trailing JSON object; tools like yt-dlp can still leak
 * \r-based progress text onto the same line, so we pull out the last
 * {...} block via regex rather than relying on newline splitting. */
function parseLastJsonLine<T>(stdout: string): T {
  const matches = stdout.match(/\{[^{}]*\}/g);
  const last = matches?.[matches.length - 1];
  if (!last) throw new Error(`Nessun JSON trovato nell'output: ${stdout.slice(-500)}`);
  return JSON.parse(last) as T;
}

function run(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: ROOT });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stdout.trim());
      else
        reject(
          new Error(
            `${cmd} ${args.join(" ")} failed (code ${code}): ${stderr.slice(-2000)}`
          )
        );
    });
  });
}

export async function startJob(id: string, source: JobSource): Promise<void> {
  await writeStatus(id, { status: "queued", clips: [] });
  processJob(id, source).catch(async (err) => {
    await writeStatus(id, {
      status: "error",
      error: err instanceof Error ? err.message : String(err),
    });
  });
}

async function processJob(id: string, source: JobSource): Promise<void> {
  const dir = jobDir(id);
  await fs.mkdir(dir, { recursive: true });
  const videoPath = path.join(dir, "source.mp4");

  let title: string | undefined;

  if (source.type === "youtube" && source.url) {
    await writeStatus(id, {
      status: "downloading",
      message: "Scarico il video da YouTube…",
    });
    const out = await run(PYTHON, [
      path.join(PIPELINE_DIR, "download.py"),
      source.url,
      videoPath,
    ]);
    const meta = parseLastJsonLine<{ title?: string }>(out);
    title = meta.title;
  } else if (source.type === "upload" && source.uploadPath) {
    await writeStatus(id, {
      status: "downloading",
      message: "Preparo il video caricato…",
    });
    await fs.copyFile(source.uploadPath, videoPath);
    title = source.fileName;
  } else {
    throw new Error("Sorgente video non valida");
  }

  await writeStatus(id, {
    status: "transcribing",
    message: "Trascrivo l'audio (Whisper, in locale)…",
    title,
  });
  const transcriptPath = path.join(dir, "transcript.json");
  const transcribeOut = await run(PYTHON, [
    path.join(PIPELINE_DIR, "transcribe.py"),
    videoPath,
    transcriptPath,
  ]);
  const transcribeMeta = parseLastJsonLine<{ duration: number }>(transcribeOut);

  await writeStatus(id, {
    status: "analyzing",
    message: "L'AI sceglie i momenti migliori…",
  });
  const transcript = JSON.parse(
    await fs.readFile(transcriptPath, "utf-8")
  ) as {
    segments: { start: number; end: number; text: string }[];
    words: { start: number; end: number; word: string }[];
    duration: number;
  };
  const videoDuration = transcript.duration || transcribeMeta.duration;
  const candidates = await pickMoments(transcript.segments, videoDuration, 4);

  if (candidates.length === 0) {
    throw new Error("L'AI non ha trovato momenti validi in questo video");
  }

  await writeStatus(id, {
    status: "rendering",
    message: `Monto ${candidates.length} clip verticali…`,
    sourceDuration: videoDuration,
  });

  const publicDir = path.join(PUBLIC_GENERATED, id);
  await fs.mkdir(publicDir, { recursive: true });

  const clips: ClipResult[] = [];
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const clipId = `clip-${i + 1}`;
    const outPath = path.join(publicDir, `${clipId}.mp4`);
    await writeStatus(id, {
      message: `Monto la clip ${i + 1} di ${candidates.length}: "${c.title}"`,
    });
    await run(PYTHON, [
      path.join(PIPELINE_DIR, "render_clip.py"),
      videoPath,
      String(c.start),
      String(c.end),
      transcriptPath,
      outPath,
      "--title",
      c.title,
      "--highlight-color",
      DEFAULT_HIGHLIGHT_COLOR,
    ]);

    const viralScore = Math.round(
      ((c.hook + c.payoff + c.curiosity + c.pacing + c.standalone) / 5) * 10
    );

    const transcriptExcerpt = transcript.words
      .filter((w) => w.end > c.start && w.start < c.end)
      .map((w) => w.word)
      .join(" ")
      .trim();

    clips.push({
      id: clipId,
      title: c.title,
      start: c.start,
      end: c.end,
      duration: c.end - c.start,
      grade: scoreToGrade(viralScore),
      viralScore,
      hook: c.hook,
      payoff: c.payoff,
      curiosity: c.curiosity,
      pacing: c.pacing,
      standalone: c.standalone,
      analysis: c.analysis ?? "",
      transcript: transcriptExcerpt,
      highlightColor: DEFAULT_HIGHLIGHT_COLOR,
      url: `/generated/${id}/${clipId}.mp4`,
    });

    await writeStatus(id, { clips: [...clips] });
  }

  await writeStatus(id, { status: "done", message: "Fatto!", clips, title });
}

function clamp(v: number, min: number, max: number): number {
  if (typeof v !== "number" || Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}

export interface ClipEditResult {
  clip: ClipResult;
  summary: string;
}

/** Re-renders one existing clip according to a natural-language instruction,
 * interpreted by Claude (via whichever auth mode is configured) into a
 * structured edit (title / trim boundaries / caption color). */
export async function editClip(
  jobId: string,
  clipId: string,
  instruction: string
): Promise<ClipEditResult> {
  const job = await readStatus(jobId);
  if (!job) throw new Error("Progetto non trovato");
  const clipIndex = job.clips.findIndex((c) => c.id === clipId);
  if (clipIndex === -1) throw new Error("Clip non trovata");
  const clip = job.clips[clipIndex];

  const dir = jobDir(jobId);
  const videoPath = path.join(dir, "source.mp4");
  const transcriptPath = path.join(dir, "transcript.json");
  const transcript = JSON.parse(
    await fs.readFile(transcriptPath, "utf-8")
  ) as {
    words: { start: number; end: number; word: string }[];
    duration: number;
  };
  const sourceDuration = job.sourceDuration ?? transcript.duration;
  const currentColor = clip.highlightColor || DEFAULT_HIGHLIGHT_COLOR;

  const windowStart = Math.max(0, clip.start - 20);
  const windowEnd = Math.min(sourceDuration, clip.end + 20);
  const nearbyWords = transcript.words.filter(
    (w) => w.end > windowStart && w.start < windowEnd
  );
  const nearbyText = nearbyWords
    .map((w) => `[${w.start.toFixed(1)}] ${w.word}`)
    .join(" ");

  const system = `You are editing one short vertical clip already cut from a longer source video for a social-media clipping tool.

Current clip:
- title: "${clip.title}"
- start: ${clip.start.toFixed(1)}s, end: ${clip.end.toFixed(1)}s (duration ${clip.duration.toFixed(1)}s)
- caption highlight color: ${currentColor}

Source video total duration: ${sourceDuration.toFixed(1)}s.

Nearby transcript with word start timestamps in seconds (covers roughly ${windowStart.toFixed(1)}s to ${windowEnd.toFixed(1)}s of the source video):
${nearbyText || "(no transcript available)"}

Respond with ONLY a JSON object, no prose, no markdown fences, with this exact shape:
{"title": string, "start": number, "end": number, "highlightColor": string, "summary": string}

Rules:
- Keep title, start, end, and highlightColor exactly as given above unless the user's instruction asks to change that specific aspect.
- start/end are in seconds and must stay within [0, ${sourceDuration.toFixed(1)}], with end > start and a clip length between 5 and 90 seconds.
- When the instruction asks to trim, shorten, extend, or retime the clip, use the nearby transcript word timestamps to choose a boundary that lands on a natural sentence/word break, not mid-word.
- highlightColor must be a hex color like "#FFD60A".
- summary is exactly one short sentence, in Italian, describing what you actually changed (or that nothing needed to change).`;

  const text = await completeWithClaude({
    system,
    userMessage: instruction,
    maxTokens: 1000,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Claude non ha risposto con un JSON valido per la modifica");
  }
  const edit = JSON.parse(jsonMatch[0]) as {
    title?: string;
    start?: number;
    end?: number;
    highlightColor?: string;
    summary?: string;
  };

  const newStart = clamp(edit.start ?? clip.start, 0, sourceDuration - 1);
  let newEnd = clamp(edit.end ?? clip.end, newStart + 1, sourceDuration);
  if (newEnd - newStart < 1) newEnd = Math.min(sourceDuration, newStart + 1);
  const newTitle = (edit.title ?? clip.title).trim() || clip.title;
  const newColor = /^#[0-9a-fA-F]{6}$/.test(edit.highlightColor ?? "")
    ? (edit.highlightColor as string)
    : currentColor;

  const publicDir = path.join(PUBLIC_GENERATED, jobId);
  const outPath = path.join(publicDir, `${clipId}.mp4`);

  await run(PYTHON, [
    path.join(PIPELINE_DIR, "render_clip.py"),
    videoPath,
    String(newStart),
    String(newEnd),
    transcriptPath,
    outPath,
    "--title",
    newTitle,
    "--highlight-color",
    newColor,
  ]);

  const transcriptExcerpt = transcript.words
    .filter((w) => w.end > newStart && w.start < newEnd)
    .map((w) => w.word)
    .join(" ")
    .trim();

  const updatedClip: ClipResult = {
    ...clip,
    title: newTitle,
    start: newStart,
    end: newEnd,
    duration: newEnd - newStart,
    highlightColor: newColor,
    transcript: transcriptExcerpt,
    url: `/generated/${jobId}/${clipId}.mp4?v=${Date.now()}`,
  };

  const newClips = [...job.clips];
  newClips[clipIndex] = updatedClip;
  await writeStatus(jobId, { clips: newClips });

  return { clip: updatedClip, summary: edit.summary || "Modifica applicata." };
}
