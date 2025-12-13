"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Residents", href: "/residents" },
  { label: "Archived", href: "/archived" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 border-r border-slate-800 bg-slate-950/90 flex flex-col">
      
      {/* ─── Header ───────────────────────────── */}
      <div className="relative px-5 py-4 border-b border-slate-800 flex gap-3 items-center overflow-hidden">
        {/* Tactical glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/25 via-amber-500/10 to-transparent blur-xl pointer-events-none" />

        {/* Icon */}
        <div
          className="relative h-9 w-9 rounded-xl
                     bg-emerald-600
                     text-slate-950
                     font-bold
                     flex items-center justify-center
                     shadow-[0_0_18px_rgba(16,185,129,0.45)]
                     animate-pulse
                     hover:animate-none
                     transition-all duration-300"
        >
          T
        </div>

        {/* Text */}
        <div className="relative">
          <div className="text-sm font-semibold tracking-wide uppercase text-emerald-200">
            Titan
          </div>
          <div className="text-xs text-slate-400">
            Workflow Systems
          </div>
        </div>
      </div>

      {/* ─── Navigation ───────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition text-slate-300 hover:bg-slate-800/70 hover:text-white",
                active && "bg-slate-800 text-white border border-slate-700"
              )}
            >
              <span
                className={clsx(
                  "h-1.5 w-1.5 rounded-full",
                  active ? "bg-emerald-400" : "bg-slate-600"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ─── Logout ───────────────────────────── */}
      <Link
        href="/logout"
        className="px-4 py-2 text-xs text-slate-400 hover:text-white"
      >
        Logout
      </Link>

      {/* ─── Footer ───────────────────────────── */}
      <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
        v0.1 • Dec 2025
      </div>
    </aside>
  );
}
