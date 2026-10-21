import { Star } from "lucide-react";

type Testimonial = {
  initials: string;
  name: string;
  role: string;
  tag?: string;
  quote: string;
  body?: string;
  color: string;
};

const testimonials: Testimonial[] = [
  {
    initials: "MC",
    name: "Marcus Chen",
    role: "Podcast Host",
    tag: "AI Clipping",
    quote:
      "The AI actually finds the best moments. Not just loud ones the real hooks, the punchlines, the takeaways. Then it cuts, reframes, and captions them like a senior editor would.",
    body: "I used to scrub through 90 minute episodes hunting for clips. Now I upload, walk away, and come back to 10 polished shorts tight cuts, perfect 9:16 framing, captions already styled. The hit rate is unreal: most weeks at least half of them outperform anything I'd have picked myself.",
    color: "bg-rose-500/20 text-rose-300",
  },
  {
    initials: "ER",
    name: "Elena Rodriguez",
    role: "Content Strategist",
    tag: "Captions",
    quote: "“The captions are the cleanest I've ever shipped.”",
    body: "Word level timing, zero re syncing, and the animation presets actually look like a real editor made them. My retention jumped overnight.",
    color: "bg-amber-500/20 text-amber-300",
  },
  {
    initials: "JW",
    name: "Jamal Wright",
    role: "Faceless Channel Owner",
    quote: "“I shipped 30 videos in a month solo.”",
    color: "bg-emerald-500/20 text-emerald-300",
  },
  {
    initials: "PS",
    name: "Priya Shah",
    role: "Marketing Agency",
    tag: "Workflow",
    quote: "“Half the cost of our old stack. Twice the output.”",
    body: "We used to bounce between four apps for one video. Now my team lives inside Bytecap. Onboarding a new editor takes a day, not a month.",
    color: "bg-sky-500/20 text-sky-300",
  },
  {
    initials: "TN",
    name: "Tomáš Novák",
    role: "Sports Creator",
    quote: "“It finds every goal, dunk, and reaction. Without me lifting a finger.”",
    color: "bg-violet-500/20 text-violet-300",
  },
  {
    initials: "AM",
    name: "Ava Mitchell",
    role: "YouTube Educator",
    tag: "B-Roll",
    quote: "“The B-roll suggestions feel like they were hand picked by a human editor.”",
    body: "I record straight to camera and Bytecap layers in the visuals. My channel finally looks like the big creators I used to envy.",
    color: "bg-teal-500/20 text-teal-300",
  },
  {
    initials: "DA",
    name: "Diego Alvarez",
    role: "Indie Filmmaker",
    quote: "“The AI playground is unfair. In a good way.”",
    color: "bg-orange-500/20 text-orange-300",
  },
  {
    initials: "LW",
    name: "Ling Wei",
    role: "Brand Manager",
    tag: "Scheduling",
    quote: "“TikTok, Reels, and Shorts scheduled and shipped in one tab.”",
    body: "Our calendar fills itself. The team finally stopped Slacking me at midnight to swap out a thumbnail.",
    color: "bg-pink-500/20 text-pink-300",
  },
  {
    initials: "NB",
    name: "Noah Bennett",
    role: "Coach",
    quote: "“Bytecap is the only tool I've kept the subscription on for a year straight.”",
    color: "bg-indigo-500/20 text-indigo-300",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="text-center">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">
            Testimonials
          </div>
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl">
            Loved by creators who ship every day.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-7 text-white/50 sm:text-base">
            From solo creators to media teams, Bytecap is the editor people
            actually keep open.
          </p>
        </div>

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="mb-5 break-inside-avoid rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
            >
              <div className="flex items-center justify-between">
                <Stars />
                {t.tag && (
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/50">
                    {t.tag}
                  </span>
                )}
              </div>
              <p className="mt-4 text-[14.5px] font-medium leading-6 text-white">
                {t.quote}
              </p>
              {t.body && (
                <p className="mt-3 text-[13px] leading-6 text-white/45">{t.body}</p>
              )}
              <div className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${t.color}`}
                >
                  {t.initials}
                </span>
                <div>
                  <div className="text-[13.5px] font-medium text-white">{t.name}</div>
                  <div className="text-[12px] text-white/40">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
