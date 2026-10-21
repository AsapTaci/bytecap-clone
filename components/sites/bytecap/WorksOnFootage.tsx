const categories = [
  { n: "01", label: "Podcasts & interviews" },
  { n: "02", label: "Creator content" },
  { n: "03", label: "Gaming" },
  { n: "04", label: "Sports & action" },
  { n: "05", label: "Travel & lifestyle" },
  { n: "06", label: "Education & tutorials" },
];

export default function WorksOnFootage() {
  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl">
              Works on any footage.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-white/50 sm:text-base">
              Bytecap reads movement, energy, reactions, and scene changes
              not just words so every kind of video gets the same
              intelligent edit.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
            {categories.map((c) => (
              <div key={c.n} className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <span className="text-[12px] font-mono text-violet-400/70">{c.n}</span>
                <span className="text-[15px] text-white/80">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
