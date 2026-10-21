import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: ["Supported Languages", "Pricing", "Merch", "Blog", "Affiliate Program"],
  },
  {
    title: "Support",
    links: ["Contact", "Feature Request", "Community"],
  },
  {
    title: "Legal",
    links: ["Terms of Service", "Privacy Policy", "Affiliate Terms"],
  },
  {
    title: "Tools",
    links: [
      "TikTok hashtags",
      "Video ideas",
      "TikTok captions",
      "Video hooks",
      "Video scripts",
      "All free tools",
    ],
  },
  {
    title: "Research",
    links: [
      "All Research",
      "AI Clipper Benchmark",
      "Shorts Retention",
      "Podcast Benchmarks",
    ],
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/sites/bytecap/logo.webp"
                alt="Bytecap"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="text-[17px] font-semibold text-white">Bytecap</span>
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-6 text-white/45">
              Built for creators who post daily. Bytecap edits, captions,
              clips, and publishes your videos in minutes so you can focus
              on going viral, not on timelines.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[13px] font-semibold text-white">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-[13px] text-white/45 transition-colors hover:text-white"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-5 py-6 text-[12.5px] text-white/35 sm:flex-row sm:px-8">
          <p>Made in Canada 🇨🇦 by Ali Mansour · © 2026 ByteCap. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-white/60">
              Terms
            </Link>
            <Link href="#" className="hover:text-white/60">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
