"use client";

import { useState } from "react";
import { Sparkles, Trophy, Laugh, Flame, GraduationCap, Drama } from "lucide-react";

const chips = [
  { label: "Every goal in the match", icon: Trophy },
  { label: "The funniest moments", icon: Laugh },
  { label: "Hot takes and hooks", icon: Flame },
  { label: "Key teaching moments", icon: GraduationCap },
  { label: "Plot twists and reactions", icon: Drama },
];

export default function PromptClipping() {
  const [value, setValue] = useState("Find every goal in this match…");

  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-24">
      <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">
          Custom Moments
        </div>
        <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl">
          Or just tell it what to find.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[15px] leading-7 text-white/50 sm:text-base">
          Go beyond highlights and prompt for exactly what you want. AI
          Clipping scans the full timeline and pulls matching moments.
        </p>

        <div className="mx-auto mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-7">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4">
              <Sparkles className="h-4 w-4 shrink-0 text-violet-300/70" />
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-white/35 focus:outline-none"
              />
            </div>
            <button className="shrink-0 rounded-xl bg-white px-5 py-3 text-[14px] font-semibold text-[#050505] transition-opacity hover:opacity-90">
              Get Clips
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {chips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => setValue(chip.label)}
                className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-[12.5px] text-white/60 transition-colors hover:border-violet-400/40 hover:text-white"
              >
                <chip.icon className="h-3.5 w-3.5 text-white/40" />
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
