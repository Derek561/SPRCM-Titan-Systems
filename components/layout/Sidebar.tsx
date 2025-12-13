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
      <div className="px-5 py-4 border-b border-slate-800 flex gap-2 items-center">
        <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-semibold text-lg">
          T
        </div>
        <div>
          <div className="text-sm font-semibold tracking-wide uppercase text-slate-200">
            Titan
          </div>
          <div className="text-xs text-slate-400">
            Workflow Systems
          </div>
        </div>
      </div>

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
              <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
  href="/logout"
  className="block text-slate-400 hover:text-white text-xs px-3 py-2"
>
  Logout
</Link>

      <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-500">
        v0.1 • Dec 2025
      </div>
    </aside>
  );
}
