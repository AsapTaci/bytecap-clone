import { Upload, Wand2, Share2, Link as LinkIcon } from "lucide-react";

const sources = ["YouTube", "TikTok", "Instagram", "Facebook", "X", "Twitch", "Rumble"];
const imports = ["Local video", "Dropbox", "Google Drive"];
const edits = ["Auto captioning..", "Adding Emojis..", "Adding B-rolls.."];

export default function HowItWorks() {
  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="text-center">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">
            How it works
          </div>
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-balance sm:text-4xl">
            Faster video workflows, made simple.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/35">
              <Upload className="h-3.5 w-3.5" /> Step 01
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2 text-[12px] text-white/50">
                <LinkIcon className="h-3.5 w-3.5 text-red-500" />
                youtube.com/watch?v=jk9g..
              </div>
              <div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-white/30">
                Paste links from
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sources.map((s) => (
                  <span key={s} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/50">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-white/30">
                Or import from
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {imports.map((s) => (
                  <span key={s} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/50">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-white">
              Auto Import
              <br />
              or upload videos
            </h3>
            <p className="mt-2 text-[13px] leading-6 text-white/45">
              Turn on Auto Import to pull in new YouTube uploads
              automatically, or drop a video or link anytime.
            </p>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/35">
              <Wand2 className="h-3.5 w-3.5" /> Step 02
            </div>
            <div className="flex flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
              {edits.map((e) => (
                <div key={e} className="flex items-center gap-2 rounded-lg bg-black/40 px-3 py-2 text-[12px] text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  {e}
                </div>
              ))}
            </div>
            <h3 className="mt-6 text-lg font-semibold text-white">Auto edit</h3>
            <p className="mt-2 text-[13px] leading-6 text-white/45">
              Bytecap adds captions, removes silences, reframes shots to
              keep speakers in view, and generates a scroll stopping hook
              title.
            </p>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-white/35">
              <Share2 className="h-3.5 w-3.5" /> Step 03
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
              {[
                { bg: "bg-black", label: "TikTok" },
                { bg: "bg-[#1877F2]", label: "Facebook" },
                { bg: "bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600", label: "Instagram" },
                { bg: "bg-black", label: "X" },
                { bg: "bg-[#FF0000]", label: "YouTube" },
                { bg: "bg-[#0A66C2]", label: "LinkedIn" },
              ].map((p) => (
                <div
                  key={p.label}
                  className={`flex h-10 items-center justify-center rounded-lg ${p.bg} text-[11px] font-semibold text-white`}
                >
                  {p.label}
                </div>
              ))}
            </div>
            <h3 className="mt-6 text-lg font-semibold text-white">
              Schedule and publish
              <br />
              everywhere
            </h3>
            <p className="mt-2 text-[13px] leading-6 text-white/45">
              Publish or schedule, optimized for TikTok, Reels, Shorts and
              more up to 4K, 60fps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
