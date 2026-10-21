import Image from "next/image";

export default function SpeakersInFrame() {
  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">
              Auto Reframe
            </div>
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl">
              Speakers always in frame.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-white/50 sm:text-base">
              Object detection follows every speaker as they move. Multi
              person clips are auto stacked top and bottom. No manual
              cropping, ever.
            </p>
          </div>
          <div className="relative mx-auto aspect-[9/14] w-full max-w-xs overflow-hidden rounded-2xl border border-white/[0.08] bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
            <Image
              src="/sites/bytecap/auto-reframe-promo.webp"
              alt="Auto Reframe detecting speakers and stacking them into a 9:16 video edit"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
