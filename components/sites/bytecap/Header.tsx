"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Video,
  Film,
  Mic,
  Radio,
  Home,
  HeartPulse,
  BookOpen,
  TrendingUp,
  Gamepad2,
  Trophy,
  Building2,
  Star,
  BarChart3,
  ShoppingCart,
  Scissors,
  Type,
  Crop,
  Layers,
  AudioLines,
  Share2,
  Calendar,
  LineChart,
  Sparkles,
  UserRound,
  Wand2,
  Zap,
  Image as ImageIcon,
  Palette,
} from "lucide-react";

const useCases = [
  { name: "Content Creators", desc: "Create viral videos with AI power—no editing skills needed.", icon: Video },
  { name: "Video Editors", desc: "Simplify editing with AI-powered video tools.", icon: Film },
  { name: "Podcasters", desc: "Turn highlights into engaging captioned clips.", icon: Mic },
  { name: "Streamers", desc: "Transform stream highlights into viral videos, instantly shareable with AI.", icon: Radio },
  { name: "Real Estate Agents", desc: "Stand out with personalized video tours that highlight your property's best features.", icon: Home },
  { name: "Medicine", desc: "Create clear, accessible healthcare content that educates and engages.", icon: HeartPulse },
  { name: "Educators", desc: "Engaging, accessible lessons with AI captions and scripts.", icon: BookOpen },
  { name: "Marketers", desc: "Boost campaigns with engaging AI videos.", icon: TrendingUp },
  { name: "Gamers", desc: "Share epic gameplay and walkthroughs with eye-catching captions and AI effects.", icon: Gamepad2 },
  { name: "Coaches", desc: "Engage your clients with personalized, high-quality training videos.", icon: Trophy },
  { name: "Agencies", desc: "Scale video production for multiple clients effortlessly.", icon: Building2 },
  { name: "Influencers", desc: "Grow your audience with consistent viral-ready content.", icon: Star },
  { name: "Advertisers", desc: "Create high-converting ad videos that drive results.", icon: BarChart3 },
  { name: "E-Commerce", desc: "Turn products into engaging videos that boost sales.", icon: ShoppingCart },
];

const features = [
  { name: "AI Video Clipping", desc: "Auto clip long videos into short, engaging clips.", icon: Scissors },
  { name: "AI Captions", desc: "Auto create 99% accurate captions fast with AI.", icon: Type },
  { name: "Auto Reframe", desc: "Convert complete 16:9 videos into tracked, editable 9:16 projects.", icon: Crop },
  { name: "AI B-roll", desc: "Add relevant B-roll footage automatically.", icon: Layers },
  { name: "AI Audio Clipper", desc: "Find and share the best moments from podcasts and long audio.", icon: AudioLines },
  { name: "Cross-platform Publishing", desc: "Publish and schedule videos to six social platforms.", icon: Share2 },
  { name: "Content Calendar", desc: "Plan, schedule, and publish videos across channels.", icon: Calendar },
  { name: "Analytics", desc: "Track reach, engagement, and growth across channels.", icon: LineChart },
  { name: "AI Video Editor", desc: "Edit captions, silences, zooms, overlays, B-roll, and more.", icon: Sparkles },
  { name: "Faceless Videos", desc: "Create viral faceless videos in seconds", icon: UserRound },
  { name: "Motion Graphics", desc: "Search and customize animated graphics for every key moment.", icon: Wand2 },
  { name: "AI Hook Title", desc: "AI hook title to keep your audience engaged", icon: Zap },
  { name: "Thumbnail Generator", desc: "Auto-generate eye-catching covers that grab attention.", icon: ImageIcon },
  { name: "Brand Kit", desc: "Keep fonts, assets, and brand words in one place.", icon: Palette },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState<"cases" | "features" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<"cases" | "features" | null>(null);

  return (
    <header className="fixed left-0 top-0 z-[9999] w-full">
      <div className="border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/sites/bytecap/logo.webp"
              alt="Bytecap"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="text-[17px] font-semibold tracking-tight text-white">
              Bytecap
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <button
              onMouseEnter={() => setOpenMenu("cases")}
              onClick={() => setOpenMenu(openMenu === "cases" ? null : "cases")}
              className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                openMenu === "cases"
                  ? "bg-white/[0.06] text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Use Cases
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openMenu === "cases" ? "rotate-180" : ""
                }`}
              />
            </button>
            <button
              onMouseEnter={() => setOpenMenu("features")}
              onClick={() => setOpenMenu(openMenu === "features" ? null : "features")}
              className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                openMenu === "features"
                  ? "bg-white/[0.06] text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Features
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  openMenu === "features" ? "rotate-180" : ""
                }`}
              />
            </button>
            <Link
              href="/pricing"
              className="rounded-full px-3.5 py-2 text-[14px] font-medium text-white/70 transition-colors hover:text-white"
              onMouseEnter={() => setOpenMenu(null)}
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="rounded-full px-3.5 py-2 text-[14px] font-medium text-white/70 transition-colors hover:text-white"
              onMouseEnter={() => setOpenMenu(null)}
            >
              Blog
            </Link>
            <Link
              href="/affiliates"
              className="rounded-full px-3.5 py-2 text-[14px] font-medium text-white/70 transition-colors hover:text-white"
              onMouseEnter={() => setOpenMenu(null)}
            >
              Affiliates
            </Link>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/workspace"
              className="text-[14px] font-medium text-white/70 transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/workspace"
              className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-[#050505] transition-opacity hover:opacity-90"
            >
              Get started free
            </Link>
          </div>

          <button
            className="flex items-center justify-center rounded-md p-2 text-white lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Use Cases mega menu */}
        {openMenu === "cases" && (
          <div
            onMouseLeave={() => setOpenMenu(null)}
            className="border-t border-white/[0.06] bg-[#050505]"
          >
            <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8">
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                Who it&apos;s for
              </div>
              <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-3">
                {useCases.map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className="group flex items-start gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/70 transition-colors group-hover:bg-violet-500/15 group-hover:text-violet-300">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[14px] font-medium text-white">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-5 text-white/45">
                        {item.desc}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features menu */}
        {openMenu === "features" && (
          <div
            onMouseLeave={() => setOpenMenu(null)}
            className="border-t border-white/[0.06] bg-[#050505]"
          >
            <div className="mx-auto max-w-[760px] px-5 py-8 sm:px-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Platform capabilities
                </span>
                <a
                  href="#"
                  className="flex items-center gap-1 text-[12px] font-medium text-white/50 hover:text-white"
                >
                  View all features ↗
                </a>
              </div>
              <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
                {features.map((item) => (
                  <a key={item.name} href="#" className="group flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/70 transition-colors group-hover:bg-violet-500/15 group-hover:text-violet-300">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[14px] font-medium text-white">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-5 text-white/45">
                        {item.desc}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-[#050505] lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
              <Image src="/sites/bytecap/logo.webp" alt="Bytecap" width={28} height={28} className="rounded-md" />
              <span className="text-[17px] font-semibold text-white">Bytecap</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2 text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-5 py-4">
            {mobileSub === null && (
              <div className="flex flex-col divide-y divide-white/[0.06]">
                <button
                  onClick={() => setMobileSub("cases")}
                  className="flex items-center justify-between py-4 text-left text-[17px] font-medium text-white"
                >
                  Use Cases
                  <ChevronDown className="h-4 w-4 -rotate-90 text-white/50" />
                </button>
                <button
                  onClick={() => setMobileSub("features")}
                  className="flex items-center justify-between py-4 text-left text-[17px] font-medium text-white"
                >
                  Features
                  <ChevronDown className="h-4 w-4 -rotate-90 text-white/50" />
                </button>
                <Link href="/pricing" className="py-4 text-[17px] font-medium text-white">
                  Pricing
                </Link>
                <Link href="/blog" className="py-4 text-[17px] font-medium text-white">
                  Blog
                </Link>
                <Link href="/affiliates" className="py-4 text-[17px] font-medium text-white">
                  Affiliates
                </Link>
              </div>
            )}

            {mobileSub !== null && (
              <div>
                <button
                  onClick={() => setMobileSub(null)}
                  className="mb-4 flex items-center gap-1 text-[13px] font-medium text-white/50"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" /> Back
                </button>
                <div className="flex flex-col gap-4">
                  {(mobileSub === "cases" ? useCases : features).map((item) => (
                    <a key={item.name} href="#" className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/70">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium text-white">{item.name}</span>
                        <span className="mt-0.5 block text-[13px] leading-5 text-white/45">{item.desc}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-6">
              <Link
                href="/workspace"
                className="rounded-full border border-white/15 py-3 text-center text-[15px] font-medium text-white"
              >
                Sign in
              </Link>
              <Link
                href="/workspace"
                className="rounded-full bg-white py-3 text-center text-[15px] font-semibold text-[#050505]"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
