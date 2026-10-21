"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Link2,
  Upload,
  Scissors,
  Type,
  Crop,
  Layers,
  AudioLines,
  UserRound,
  Search,
  ChevronDown,
  Loader2,
  Link as LinkIcon,
  Cloud,
} from "lucide-react";

interface ClipSummary {
  id: string;
  title: string;
  grade: string;
  viralScore: number;
}

interface JobSummary {
  id: string;
  status: string;
  title?: string;
  clips: ClipSummary[];
  createdAt: string;
}

const QUICK_ACTIONS = [
  { label: "AI Video Clipper", icon: Scissors, img: "/sites/bytecap/hero-ai-clipping.webp" },
  { label: "AI Captions", icon: Type, img: "/sites/bytecap/hero-ai-captions.webp" },
  { label: "AI Reframe", icon: Crop, img: "/sites/bytecap/auto-reframe-promo.webp" },
  { label: "AI B-Roll", icon: Layers, img: "/sites/bytecap/hero-auto-broll.webp" },
  { label: "AI Audio Clipper", icon: AudioLines, img: "/sites/bytecap/hero-ai-captions.webp" },
  { label: "AI Story", icon: UserRound, img: "/sites/bytecap/hero-faceless-videos.webp" },
];

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "adesso";
  if (mins < 60) return `${mins} minut${mins === 1 ? "o" : "i"} fa`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} or${hours === 1 ? "a" : "e"} fa`;
  const days = Math.floor(hours / 24);
  return `${days} giorn${days === 1 ? "o" : "i"} fa`;
}

export default function WorkspaceHome() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobs, setJobs] = useState<JobSummary[] | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d: { jobs?: JobSummary[] }) => setJobs(d.jobs ?? []))
      .catch(() => setJobs([]));
  }, []);

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!videoUrl.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: videoUrl.trim() }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error || "Errore");
      router.push(`/studio/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setSubmitting(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = (await uploadRes.json()) as {
        uploadPath?: string;
        fileName?: string;
        error?: string;
      };
      if (!uploadRes.ok || !uploadData.uploadPath) throw new Error(uploadData.error || "Upload fallito");
      const jobRes = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadPath: uploadData.uploadPath, fileName: uploadData.fileName }),
      });
      const jobData = (await jobRes.json()) as { id?: string; error?: string };
      if (!jobRes.ok || !jobData.id) throw new Error(jobData.error || "Errore");
      router.push(`/studio/${jobData.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-[13px] text-white/70">
          Type: <span className="font-semibold text-white">All</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-[13px] text-white/70">
          Sort: <span className="font-semibold text-white">Newest</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/50">
          <Search className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleUrlSubmit} className="mb-4">
        <div className="flex min-h-14 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 shadow-sm transition-colors focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/10">
          <Link2 className="h-4 w-4 shrink-0 text-white/30" />
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            disabled={submitting}
            placeholder="Paste a YouTube, TikTok, Instagram, X, or Facebook link"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-white/35 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-[#050505] disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Get clips
          </button>
        </div>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="mb-8 flex flex-wrap items-center gap-5">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={submitting}
          className="flex items-center gap-1.5 text-[13px] text-white/50 hover:text-white/80 disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" /> Upload
        </button>
        <button
          disabled
          title="Non ancora disponibile"
          className="flex cursor-not-allowed items-center gap-1.5 text-[13px] text-white/30"
        >
          <Cloud className="h-3.5 w-3.5" /> Google Drive
        </button>
        <button
          disabled
          title="Non ancora disponibile"
          className="flex cursor-not-allowed items-center gap-1.5 text-[13px] text-white/30"
        >
          <LinkIcon className="h-3.5 w-3.5" /> Dropbox
        </button>
      </div>
      {error && <p className="mb-8 text-[13px] text-red-400">{error}</p>}

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => fileInputRef.current?.click()}
            className="group overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] text-left transition-colors hover:border-violet-400/30"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={action.img}
                alt={action.label}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2.5">
              <action.icon className="h-3.5 w-3.5 text-white/50" />
              <span className="text-[12px] font-medium text-white/80">
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-[17px] font-semibold text-white">Projects</h2>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[12px] text-white/50">
          {jobs?.length ?? 0}
        </span>
      </div>

      {jobs === null && (
        <div className="flex items-center gap-2 text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" /> Carico i progetti…
        </div>
      )}

      {jobs !== null && jobs.length === 0 && (
        <p className="text-[13px] text-white/40">
          Nessun progetto ancora. Incolla un link o carica un video per iniziare.
        </p>
      )}

      {jobs !== null && jobs.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/studio/${job.id}`}
              className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                {job.clips[0] ? (
                  <video
                    src={`/generated/${job.id}/${job.clips[0].id}.mp4`}
                    className="h-full w-full object-cover"
                    muted
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/20">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
                  {job.clips.length} Clips
                </div>
                <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Open clips
                </div>
              </div>
              <div className="p-3.5">
                <p className="truncate text-[14px] font-medium text-violet-300">
                  {job.title || "Senza titolo"}
                </p>
                <p className="mt-1 text-[12px] text-white/40">
                  {timeAgo(job.createdAt)} · Magic clips
                  {job.status !== "done" && job.status !== "error" && (
                    <span className="ml-1.5 text-violet-300">
                      · in corso…
                    </span>
                  )}
                  {job.status === "error" && (
                    <span className="ml-1.5 text-red-400">· errore</span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <h3 className="text-[16px] font-semibold text-white">Views over time</h3>
        <p className="mb-5 text-[12px] text-white/40">
          Last 28 days · estimated trend
        </p>
        <svg viewBox="0 0 400 100" className="h-24 w-full">
          <polyline
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            points="0,85 20,80 40,75 60,72 80,65 100,62 120,58 140,55 160,50 180,48 200,42 220,40 240,35 260,33 280,28 300,25 320,22 340,18 360,12 380,8 400,6"
          />
        </svg>
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <p className="text-[12.5px] text-white/40">
            Connetti i canali social per vedere analytics reali.
          </p>
          <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.1] px-3.5 py-2 text-[12.5px] font-medium text-white">
            <Link2 className="h-3.5 w-3.5" /> Connect social channels
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <h3 className="text-[18px] font-semibold text-white">
          Connect once. Publish everywhere.
        </h3>
        <p className="mt-1 text-[13px] text-white/40">
          Unlock scheduling and cross platform publishing from one workspace.
        </p>
        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {Array.from({ length: 14 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dow = date.toLocaleDateString("en-US", { weekday: "short" });
            return (
              <div
                key={i}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] py-3 text-center"
              >
                <div className="text-[11px] text-white/40">{dow}</div>
                <div className="text-[13px] font-medium text-white">
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <button className="mt-5 flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3.5 py-2 text-[12.5px] font-medium text-white">
          <Link2 className="h-3.5 w-3.5" /> Connect social channels
        </button>
      </div>
    </div>
  );
}
