import { completeWithClaude } from "./claude-client";

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface ClipCandidate {
  title: string;
  start: number;
  end: number;
  hook: number;
  payoff: number;
  curiosity: number;
  pacing: number;
  standalone: number;
  analysis: string;
}

export async function pickMoments(
  segments: TranscriptSegment[],
  videoDuration: number,
  maxClips = 4
): Promise<ClipCandidate[]> {
  const transcriptText = segments
    .map((s) => `[${s.start.toFixed(1)}-${s.end.toFixed(1)}] ${s.text}`)
    .join("\n");

  const system = `You are Bytecap Moment Intelligence, an expert short-form video editor that watches long videos and finds the clips most likely to go viral as vertical shorts (TikTok, Reels, YouTube Shorts).

Given a timestamped transcript of a video (total duration ${videoDuration.toFixed(0)} seconds), identify up to ${maxClips} of the best standalone moments to turn into clips.

For each moment, score it 0-10 on:
- hook: how well the opening second grabs attention
- payoff: does it deliver on what the hook promised
- curiosity: does it make the viewer want to keep watching
- pacing: is it tight with no dead air or filler
- standalone: does it make full sense without any other context from the video

Respond with ONLY a JSON array, no prose, no markdown code fences. Each element has this exact shape:
[{"title": string, "start": number, "end": number, "hook": number, "payoff": number, "curiosity": number, "pacing": number, "standalone": number, "analysis": string}]

Rules:
- start/end are in seconds and must fall within [0, ${videoDuration}], matching the transcript timestamps as closely as possible.
- Each clip must be between 15 and 75 seconds long.
- Clips must not overlap each other.
- title is a short punchy on-screen hook title, max 8 words, written the way a viral short's title card would read.
- analysis is one short sentence (max 160 characters) explaining editorially why this moment works as a standalone clip.
- Only return moments that genuinely stand on their own; if the video has fewer than ${maxClips} strong moments, return fewer.`;

  const text = await completeWithClaude({
    system,
    userMessage: transcriptText || "(trascrizione vuota)",
    maxTokens: 4000,
  });

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Impossibile trovare un array JSON nella risposta di Claude");
  }

  const raw = JSON.parse(jsonMatch[0]) as ClipCandidate[];

  return raw
    .filter(
      (c) =>
        typeof c.start === "number" &&
        typeof c.end === "number" &&
        c.end > c.start &&
        c.start >= 0 &&
        c.end <= videoDuration + 1
    )
    .slice(0, maxClips);
}

export function scoreToGrade(viralScore: number): string {
  if (viralScore >= 90) return "S";
  if (viralScore >= 80) return "A";
  if (viralScore >= 70) return "B";
  if (viralScore >= 60) return "C";
  return "D";
}
