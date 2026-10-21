"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Workflow,
  Calendar,
  LineChart,
  ImageIcon,
  FolderOpen,
  Link2,
  Zap,
  Bell,
  ArrowLeft,
  Sparkles,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/workspace", icon: Home },
  { label: "Automations", href: "/workspace/automations", icon: Workflow, badge: "NEW" },
  { label: "Calendar", href: "/workspace/calendar", icon: Calendar },
  { label: "Analytics", href: "/workspace/analytics", icon: LineChart },
  { label: "Thumbnails", href: "/workspace/thumbnails", icon: ImageIcon },
  { label: "Assets", href: "/workspace/assets", icon: FolderOpen },
  { label: "Social accounts", href: "/workspace/social-accounts", icon: Link2 },
  { label: "Settings", href: "/workspace/settings", icon: Settings },
];

export default function DashboardChrome({
  children,
  breadcrumb,
  backHref,
}: {
  children: React.ReactNode;
  breadcrumb?: string;
  backHref?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-6 sm:px-8">
        <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.06] px-4 py-3 sm:px-5">
          <p className="text-[13px] leading-5 text-amber-200/80">
            Sei sul piano Bytecap Free. Passa a Pro per rimuovere la
            filigrana e sbloccare tutte le funzioni.
          </p>
          <button className="shrink-0 rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-[#050505] transition-opacity hover:opacity-90">
            ⚡ Upgrade
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {backHref ? (
              <Link
                href={backHref}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/70 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/70 transition-colors hover:text-white"
                aria-label="Apri menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}
            {breadcrumb && (
              <span className="text-[15px] font-semibold text-white">
                {breadcrumb}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/70 transition-colors hover:text-white">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex h-10 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-[13px] font-semibold text-amber-300">
              <Zap className="h-3.5 w-3.5 fill-amber-300" /> 32
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[13px] font-bold text-white">
              P
            </div>
          </div>
        </div>

        {children}
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[300px] border-r border-white/[0.08] bg-[#0a0a0a] p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[14px] font-bold text-white">
                P
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:text-white"
                aria-label="Chiudi menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">
              Navigation
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[14px] font-medium text-white/80 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-white/50" />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-300">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-white">
                    Upgrade Plan
                  </div>
                  <div className="text-[11px] text-white/40">
                    Sblocca tutte le funzioni
                  </div>
                </div>
              </div>
              <button className="w-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 py-2.5 text-[12.5px] font-bold text-white">
                UPGRADE NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
