"use client";

export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-3 backdrop-blur">
      {/* Left: System Identity */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-wide text-slate-100">
          Titan Workflow Systems
        </span>
        <span className="text-xs text-slate-400">
          Structured workflows. Predictable output.
        </span>
      </div>

      {/* Right: Ownership / Status */}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-emerald-300 animate-pulse hover:animate-none transition">
          TITAN SYSTEMS · DSS Enterprises
        </span>
      </div>
    </header>
  );
}
