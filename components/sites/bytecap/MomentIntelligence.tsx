const scores = [
  { label: "Hook", value: 9.0 },
  { label: "Payoff", value: 8.0 },
  { label: "Curiosity", value: 7.0 },
  { label: "Pacing", value: 10.0 },
  { label: "Standalone", value: 8.0 },
];

export default function MomentIntelligence() {
  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">
              Scored by Bytecap Moment Intelligence
            </div>
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl">
              Every candidate passes an editorial quality test.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-white/50 sm:text-base">
              Bytecap Moment Intelligence doesn&apos;t generate clips and
              hope for the best. It evaluates each moment for hook, payoff,
              curiosity, pacing, and standalone value so the strongest
              candidates rise to the top.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-xl font-bold text-violet-300">
                S
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-white">85</span>
                  <span className="text-sm text-white/40">/100</span>
                </div>
                <div className="text-[12px] text-white/40">Viral score</div>
              </div>
            </div>

            <div className="mt-6 space-y-3.5">
              {scores.map((s) => (
                <div key={s.label}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="text-white/60">{s.label}</span>
                    <span className="text-white/40">{s.value.toFixed(1)}/10</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                      style={{ width: `${s.value * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
