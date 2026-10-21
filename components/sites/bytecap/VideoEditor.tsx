import Image from "next/image";
import {
  MessageSquareOff,
  Scissors,
  ZoomIn,
  Image as ImageIcon,
  Languages,
  Layers,
  Zap,
  AudioLines,
  Sparkles,
  Film,
  Palette,
  Smile,
  Sticker,
  Gauge,
  Wand2,
} from "lucide-react";

const smartEdits = [
  {
    n: "01",
    title: "Remove Filler Words",
    desc: "Instantly clean up 'ums' and 'ahs' to keep your message clear and professional.",
    icon: MessageSquareOff,
  },
  {
    n: "02",
    title: "Auto Remove Silences",
    desc: "Automatically detect and cut silent pauses for tight, engaging pacing.",
    icon: Scissors,
  },
  {
    n: "03",
    title: "AI Auto Zoom",
    desc: "Add dynamic zooms at key moments to maintain viewer attention.",
    icon: ZoomIn,
  },
];

const finishingTouches = [
  { title: "AI Thumbnail", desc: "Generate scroll-stopping covers for Shorts, Reels, and YouTube.", icon: ImageIcon },
  { title: "AI Translator", desc: "Translate captions so every clip can travel across languages.", icon: Languages },
  { title: "Auto B-Roll", desc: "Layer relevant visuals on the right beat without manual hunting.", icon: Layers },
  { title: "AI Hook Title", desc: "Add bold first-second hooks that tell viewers why to stop.", icon: Zap },
  { title: "Soundwave", desc: "Drop animated audio waves into podcasts, music clips, and edits.", icon: AudioLines },
  { title: "Custom Overlays", desc: "Add confetti, snow, sparkles, smoke, grain, and light leaks.", icon: Sparkles },
  { title: "Vintage Effects", desc: "Give clips retro film texture with grain, vignettes, and leaks.", icon: Film },
  { title: "Color Filters", desc: "Tune the mood with quick color looks made for social video.", icon: Palette },
  { title: "GIFs", desc: "Add quick reaction GIFs and visual punchlines to clips.", icon: Smile },
  { title: "Stickers", desc: "Place expressive stickers, callouts, and creator-style accents.", icon: Sticker },
  { title: "Progress Bar", desc: "Show dynamic watch progress to make short clips feel satisfying.", icon: Gauge },
  { title: "Motion Graphics Library", desc: "Search callouts, social prompts, titles, charts, notifications, frames, and outros.", icon: Wand2 },
];

export default function VideoEditor() {
  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="text-center">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">
            Smart Edits
          </div>
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl">
            Built in video editor
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-white/50 sm:text-base">
            Your clips are generated, but your creative control stays.
            Refine captions and timing, then add B-roll, audio, motion
            graphics, overlays, and precise timeline edits in one workspace.
          </p>
        </div>

        <div className="mx-auto mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#09090a] shadow-[0_24px_80px_-48px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#050505] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-white/55">
              Bytecap video editor
            </div>
            <div className="hidden w-[68px] sm:block" />
          </div>
          <div className="relative aspect-[1913/1054] w-full bg-[#050505]">
            <Image
              src="/sites/bytecap/homepage-ai-video-editor.webp"
              alt="Bytecap AI Video Editor"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {smartEdits.map((e) => (
            <div key={e.n} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <e.icon className="h-5 w-5 text-violet-300/80" />
              <div className="mt-4 text-[11px] font-mono text-white/30">{e.n}</div>
              <h3 className="mt-1 text-[15px] font-semibold text-white">{e.title}</h3>
              <p className="mt-2 text-[13px] leading-6 text-white/45">{e.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr]">
          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              More in the editor
            </div>
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance">
              Every finishing
              <br />
              touch, one timeline.
            </h2>
            <p className="mt-5 max-w-xs text-[15px] leading-7 text-white/50">
              Add what the edit needs without jumping between tools or
              digging through menus.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-3">
            {finishingTouches.map((f) => (
              <div key={f.title}>
                <f.icon className="h-5 w-5 text-white/50" />
                <h3 className="mt-3 text-[14.5px] font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-white/45">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
