"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "So what exactly is Bytecap?",
    a: "Think of Bytecap as your entire video stack in one tab. Turn long videos into viral shorts, spin up faceless videos from a single prompt, slap on animated captions, drop in B-roll and music, generate thumbnails, and post straight to all your socials. No more bouncing between five different apps to ship one video.",
  },
  {
    q: "Is Bytecap actually built for someone like me?",
    a: "If you make videos, probably yes. Podcasters chopping episodes into clips, faceless creators shipping daily, agencies juggling client accounts, coaches repurposing webinars, brands that need to stay consistent without hiring a full editor. If you've ever stared at a 90 minute recording wondering where to even start, Bytecap is for you.",
  },
  {
    q: "How does AI clipping know which moments are actually good?",
    a: "Bytecap Moment Intelligence listens and watches instead of relying on the transcript alone. Our proprietary engine weighs dialogue, scene changes, silence breaks, audio energy, pacing, and visual activity, then ranks clips by hook, payoff, curiosity, and standalone value. Want more control? Just tell it what to find: \"Every goal in the match,\" \"the funniest takes,\" or \"key teaching moments.\"",
  },
  {
    q: "What about videos without any dialogue?",
    a: "Totally covered. Sports, drone footage, gameplay, travel vlogs, music performances, raw B-roll. Magic Clips reads motion, action, and audio energy, not just speech. If your footage has highlights in it, it'll find them.",
  },
  {
    q: "Can I post straight to TikTok, YouTube, and Instagram?",
    a: "Yes. Connect your accounts once and schedule or publish straight from Bytecap. No exporting, downloading, reuploading, or losing quality on the way. Plan a full content calendar in one view.",
  },
  {
    q: "Is there a free plan? Can I try it before paying?",
    a: "Yes. The free plan gives you credits every month so you can try Magic Clips, edit videos, and add AI captions before deciding. Paid plans unlock more power for creators who need no watermark exports, faceless videos, longer exports, 4K rendering, and direct publishing.",
  },
  {
    q: "Is what I create actually mine?",
    a: "100% yours. Videos, scripts, voiceovers, thumbnails, all of it. Use them commercially anywhere you want, including monetized content. We don't claim a thing.",
  },
  {
    q: "How is Bytecap different from other platforms?",
    a: "Most clippers start with the transcript. Bytecap Moment Intelligence watches, listens, and evaluates the complete video across speech, visuals, sound, timing, scene dynamics, and editorial quality. This proprietary engine is built in-house and available only in Bytecap. The same workspace then handles captions, reframing, B-roll, editing, scheduling, and publishing.",
  },
  {
    q: "What if I get stuck?",
    a: "We've got you. Email contact@bytecap.io, ping us in the in app chat, or jump into our Discord and ask. We usually reply within a few hours on business days, and most things are already covered in our help docs.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-y border-white/[0.06] bg-white/[0.015] py-20 sm:py-24">
      <div className="mx-auto max-w-[760px] px-5 sm:px-8">
        <div className="text-center">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">
            FAQ
          </div>
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl">
            Stuff you&apos;re probably wondering.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-white/[0.07]">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="pr-6 text-[15px] font-medium text-white sm:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="pb-5 pr-8 text-[14px] leading-7 text-white/50">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
