"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Download,
  AlertTriangle,
  Film,
  Lock,
  ChevronDown,
  Wand2,
  Send,
  CheckCircle2,
} from "lucide-react";

interface ClipResult {
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
  url: string;
}

interface JobStatus {
  id: string;
  status:
    | "queued"
    | "downloading"
    | "transcribing"
    | "analyzing"
    | "rendering"
    | "done"
    | "error";
  message?: string;
  error?: string;
  title?: string;
  sourceDuration?: number;
  clips: ClipResult[];
}

const STAGE_LABELS: Record<JobStatus["status"], string> = {
  queued: "In coda…",
  downloading: "Scarico il video…",
  transcribing: "Trascrivo l'audio…",
  analyzing: "L'AI sceglie i momenti migliori…",
  rendering: "Monto le clip verticali…",
  done: "Fatto",
  error: "Errore",
};

const STAGES: JobStatus["status"][] = [
  "downloading",
  "transcribing",
  "analyzing",
  "rendering",
  "done",
];

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function StudioClient({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<JobStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`, { cache: "no-store" });
        const data = (await res.json()) as JobStatus;
        if (!cancelled) setJob(data);
        if (!cancelled && data.status !== "done" && data.status !== "error") {
          timer = setTimeout(poll, 2000);
        }
      } catch {
        if (!cancelled) timer = setTimeout(poll, 2500);
      }
    }
    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [jobId]);

  const stageIndex = job ? STAGES.indexOf(job.status) : -1;

  return (
    <div>
      {job?.title && (
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/40">
            <Film className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium text-white">
              {job.title}
            </p>
            {job.sourceDuration !== undefined && (
              <p className="mt-0.5 text-[12px] text-white/40">
                {fmtTime(job.sourceDuration)} totali
              </p>
            )}
          </div>
        </div>
      )}

      {job?.status !== "error" && job?.status !== "done" && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-violet-300" />
            <span className="text-[15px] font-medium text-white">
              {job ? job.message || STAGE_LABELS[job.status] : "Avvio…"}
            </span>
          </div>
          <div className="mt-5 flex items-center gap-2">
            {STAGES.slice(0, 4).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= stageIndex ? "bg-violet-400" : "bg-white/[0.08]"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {job?.status === "error" && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="text-[15px] font-medium text-red-300">
              Qualcosa è andato storto
            </p>
            <p className="mt-1 text-[13px] leading-6 text-red-300/70">
              {job.error}
            </p>
          </div>
        </div>
      )}

      {job?.status === "done" && (
        <>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-white">
              Ready to Edit
            </h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/60">
                Sort by: <span className="font-medium text-white">Score</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[12px] text-white/50">
                {job.clips.length} clips
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {job.clips.map((clip) => (
              <ClipCard key={clip.id} jobId={jobId} clip={clip} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ClipCard({ jobId, clip: initialClip }: { jobId: string; clip: ClipResult }) {
  const [clip, setClip] = useState(initialClip);
  const [tab, setTab] = useState<"analysis" | "transcript">("analysis");
  const [editOpen, setEditOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSummary, setEditSummary] = useState<string | null>(null);

  async function applyEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!instruction.trim() || editing) return;
    setEditing(true);
    setEditError(null);
    setEditSummary(null);
    try {
      const res = await fetch(`/api/jobs/${jobId}/clips/${clip.id}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instruction: instruction.trim() }),
      });
      const data = (await res.json()) as {
        clip?: ClipResult;
        summary?: string;
        error?: string;
      };
      if (!res.ok || !data.clip) {
        throw new Error(data.error || "Modifica non riuscita");
      }
      setClip(data.clip);
      setEditSummary(data.summary || "Fatto.");
      setInstruction("");
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setEditing(false);
    }
  }

  const scores: [string, number][] = [
    ["Hook", clip.hook],
    ["Payoff", clip.payoff],
    ["Curiosity", clip.curiosity],
    ["Pacing", clip.pacing],
    ["Standalone", clip.standalone],
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      <div className="relative aspect-[9/16] w-full bg-black">
        <video
          src={clip.url}
          controls
          playsInline
          className="h-full w-full object-contain"
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-white">
            {clip.title}
          </h3>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/60">
            {fmtTime(clip.start)} - {fmtTime(clip.end)}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/35">
              Viral score
            </p>
            <p className="text-[22px] font-bold text-white">
              {clip.viralScore}
              <span className="text-[13px] font-normal text-white/40">
                /100
              </span>
            </p>
          </div>
          <span className="flex h-8 items-center gap-1 rounded-full bg-emerald-500/15 px-3 text-[12px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Grade {clip.grade}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {scores.map(([label, value]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-[11px] text-white/45">
                {label}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                  style={{ width: `${value * 10}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-[11px] text-white/40">
                {value.toFixed(1)}/10
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-1 rounded-lg bg-white/[0.04] p-1">
          <button
            onClick={() => setTab("analysis")}
            className={`flex-1 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              tab === "analysis"
                ? "bg-white/[0.1] text-white"
                : "text-white/45"
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setTab("transcript")}
            className={`flex-1 rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              tab === "transcript"
                ? "bg-white/[0.1] text-white"
                : "text-white/45"
            }`}
          >
            Transcript
          </button>
        </div>
        <div className="mt-3 min-h-[3.5rem] text-[13px] leading-6 text-white/55">
          {tab === "analysis" ? clip.analysis : clip.transcript}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2">
          <button
            onClick={() => setEditOpen((v) => !v)}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-500 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Wand2 className="h-3.5 w-3.5" /> Edit clip with Claude
          </button>

          {editOpen && (
            <form onSubmit={applyEdit} className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                disabled={editing}
                placeholder={'Es. "accorcia l\'inizio di 3 secondi", "cambia il titolo", "sottotitoli in azzurro"'}
                rows={2}
                className="w-full resize-none bg-transparent text-[13px] text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-white/30">
                  Titolo, taglio o colore sottotitoli
                </span>
                <button
                  type="submit"
                  disabled={editing || !instruction.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-[#050505] disabled:opacity-50"
                >
                  {editing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Applica
                </button>
              </div>
              {editError && (
                <p className="mt-2 text-[12px] text-red-400">{editError}</p>
              )}
              {editSummary && !editError && (
                <p className="mt-2 flex items-center gap-1.5 text-[12px] text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> {editSummary}
                </p>
              )}
            </form>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              disabled
              title="In arrivo"
              className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] py-2.5 text-[12.5px] font-medium text-white/35"
            >
              <Lock className="h-3 w-3" /> Publish
            </button>
            <a
              href={clip.url}
              download
              className="flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.1] py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-white/[0.06]"
            >
              <Download className="h-3.5 w-3.5" /> Save
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
