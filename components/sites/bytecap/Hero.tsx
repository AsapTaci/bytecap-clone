"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Upload,
  ArrowRight,
  Loader2,
} from "lucide-react";

const tabs = [
  { key: "clipping", label: "AI Clipping", img: "/sites/bytecap/hero-ai-clipping.webp" },
  { key: "captions", label: "AI Captions", img: "/sites/bytecap/hero-ai-captions.webp" },
  { key: "broll", label: "Auto B-Roll", img: "/sites/bytecap/hero-auto-broll.webp" },
  { key: "faceless", label: "Faceless Videos", img: "/sites/bytecap/hero-faceless-videos.webp" },
  { key: "publishing", label: "Publishing", img: "/sites/bytecap/hero-publishing.webp" },
] as const;

export default function Hero() {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("clipping");
  const activeIndex = tabs.findIndex((t) => t.key === active);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = (dir: 1 | -1) => {
    const next = (activeIndex + dir + tabs.length) % tabs.length;
    setActive(tabs[next].key);
  };

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
      if (!res.ok || !data.id) {
        throw new Error(data.error || "Impossibile avviare l'elaborazione");
      }
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
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = (await uploadRes.json()) as {
        uploadPath?: string;
        fileName?: string;
        error?: string;
      };
      if (!uploadRes.ok || !uploadData.uploadPath) {
        throw new Error(uploadData.error || "Upload fallito");
      }
      const jobRes = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadPath: uploadData.uploadPath,
          fileName: uploadData.fileName,
        }),
      });
      const jobData = (await jobRes.json()) as { id?: string; error?: string };
      if (!jobRes.ok || !jobData.id) {
        throw new Error(jobData.error || "Impossibile avviare l'elaborazione");
      }
      router.push(`/studio/${jobData.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setSubmitting(false);
    }
  }

  return (
    <section className="relative w-full overflow-hidden border-b border-white/[0.06] pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="mx-auto max-w-[1180px] px-5 text-center sm:px-8">
        <h1 className="mx-auto max-w-3xl text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-balance sm:text-[52px] lg:text-[60px]">
          Turn long videos into viral shorts with AI
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-7 text-white/50 sm:text-base">
          AI finds the best moments, edits scenes, then publishes everywhere in
          one workflow
        </p>

        <div id="try" className="mx-auto mt-8 w-full max-w-[640px]">
          <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <form className="w-full min-w-0 sm:flex-1" onSubmit={handleUrlSubmit}>
              <label htmlFor="hero-video-url" className="sr-only">
                Public YouTube video or podcast URL
              </label>
              <div className="flex min-h-14 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 shadow-sm transition-colors focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/10">
                <span className="mr-1 flex shrink-0 items-center -space-x-1.5">
                  <span className="relative flex size-[22px] rotate-3 items-center justify-center rounded-full border border-white/10 bg-zinc-900 shadow-sm transition-transform duration-300 hover:z-10 hover:-translate-y-0.5 hover:scale-125 hover:rotate-0">
                    <span className="flex h-3.5 w-[17px] items-center justify-center rounded-[4px] bg-[#FF0000]">
                      <Play className="ml-px size-2 fill-white text-white" />
                    </span>
                  </span>
                  <span className="relative flex size-[22px] -rotate-2 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-[#1877F2] shadow-sm transition-transform duration-300 hover:z-10 hover:-translate-y-0.5 hover:scale-125 hover:rotate-0">
                    <span className="text-[11px] font-bold">f</span>
                  </span>
                  <span className="relative flex size-[22px] rotate-2 items-center justify-center rounded-full border border-white/10 bg-zinc-900 shadow-sm transition-transform duration-300 hover:z-10 hover:-translate-y-0.5 hover:scale-125 hover:rotate-0">
                    <span className="text-[10px] font-bold text-white">♪</span>
                  </span>
                  <span className="relative flex size-[22px] -rotate-3 items-center justify-center rounded-full border border-white/10 bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 shadow-sm transition-transform duration-300 hover:z-10 hover:-translate-y-0.5 hover:scale-125 hover:rotate-0" />
                  <span className="relative flex size-[22px] rotate-3 items-center justify-center rounded-full border border-white/10 bg-zinc-900 shadow-sm transition-transform duration-300 hover:z-10 hover:-translate-y-0.5 hover:scale-125 hover:rotate-0">
                    <span className="text-[11px] font-bold text-white">X</span>
                  </span>
                </span>
                <input
                  id="hero-video-url"
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={submitting}
                  placeholder="Drop a video link to get started"
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-white/35 focus:outline-none disabled:opacity-50"
                />
                <ArrowRight className="h-4 w-4 shrink-0 text-white/30" />
              </div>
            </form>
            <button
              onClick={handleUrlSubmit}
              disabled={submitting}
              className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[14px] font-semibold text-[#050505] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Get clips
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            className="mt-3 mx-auto flex items-center justify-center gap-1.5 text-[13px] text-white/40 hover:text-white/60 disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" /> or upload a video
          </button>
          {error && (
            <p className="mt-3 text-[13px] text-red-400">{error}</p>
          )}
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl rounded-3xl border border-white/[0.07] bg-gradient-to-b from-violet-950/40 via-[#0a0812] to-[#050505] p-8 shadow-[0_40px_120px_-40px_rgba(109,40,217,0.35)] sm:p-12">
          <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
            <Image
              src={tabs[activeIndex].img}
              alt={`${tabs[activeIndex].label} preview in Bytecap`}
              fill
              className="object-cover"
              priority
            />
          </div>

          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 sm:left-6"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 sm:right-6"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                active === tab.key
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
