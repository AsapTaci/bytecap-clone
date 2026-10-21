import Image from "next/image";
import { MessageSquareText, Eye, Clapperboard, AudioLines, Sparkles, CircleCheck } from "lucide-react";

const signals = [
  { n: "01", label: "Dialogue & meaning", icon: MessageSquareText },
  { n: "02", label: "Visual action", icon: Eye },
  { n: "03", label: "Scene dynamics", icon: Clapperboard },
  { n: "04", label: "Audio energy", icon: AudioLines },
  { n: "05", label: "Hooks & curiosity", icon: Sparkles },
  { n: "06", label: "Payoff & context", icon: CircleCheck },
];

export default function FindMoments() {
  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl lg:text-[2.75rem]">
            Find the moments people will actually watch.
          </h2>
          <div>
            <p className="text-[15px] leading-7 text-white/50 sm:text-base">
              Bytecap watches and listens to the entire video reading action,
              reactions, timing, buildup, and payoff to rank clips that work
              on their own.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
              {signals.map((s) => (
                <div key={s.n} className="flex items-center gap-2.5">
                  <span className="text-[11px] font-mono text-violet-400/70">{s.n}</span>
                  <s.icon className="h-4 w-4 text-white/40" />
                  <span className="text-[13px] text-white/70">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-16 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            <div className="relative aspect-[16/10] border-b border-white/[0.06] md:border-b-0 md:border-r">
              <Image
                src="/sites/bytecap/ai-clipping-found-moments.webp"
                alt="AI scanning long video and finding viral moments"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[16/10]">
              <Image
                src="/sites/bytecap/ai-clipping-clipped-videos-dark.webp"
                alt="Grid of short clips automatically generated from a long video"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
