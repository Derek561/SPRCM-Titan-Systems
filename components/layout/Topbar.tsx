"use client";

import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/workflows": "Workflows",
  "/runs": "Runs",
  "/admin": "Admin",
};

export function Topbar() {
  const pathname = usePathname();
  const title =
    titleMap[pathname] ??
    "Titan Workflow Systems";

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-3 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">
          {title}
        </h1>
        <p className="text-xs text-slate-400">
          Structured workflows. Predictable output.
        </p>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-2 py-1 text-emerald-300">
          TITAN SYSTEMS By:DSS Enterprises
        </span>
      </div>
    </header>
  );
}
