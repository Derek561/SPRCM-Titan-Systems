"use client";

import type { ResidentForTabs } from "./ResidentTabs";

export default function ResidentHeader({
  resident,
}: {
  resident: ResidentForTabs;
}) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-4 space-y-3">
      {/* Title row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Case File
          </p>
          <h1 className="text-2xl font-semibold text-slate-100">
            {resident.full_name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ID: {resident.id}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
            resident.status === "active"
              ? "bg-emerald-900/40 text-emerald-300 border border-emerald-800"
              : "bg-slate-800 text-slate-400 border border-slate-700"
          }`}
        >
          {resident.status}
        </span>
      </div>

      {/* Metadata strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <Meta
          label="Opened"
          value={new Date(resident.created_at).toLocaleDateString()}
        />
        <Meta
          label="Last Update"
          value={new Date(resident.updated_at).toLocaleString()}
        />
        <Meta
          label="Archived"
          value={resident.archived ? "Yes" : "No"}
        />
        <Meta
          label="Discharge"
          value={
            resident.discharge_date
              ? new Date(resident.discharge_date).toLocaleDateString()
              : "—"
          }
        />
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="text-slate-200">{value}</p>
    </div>
  );
}
