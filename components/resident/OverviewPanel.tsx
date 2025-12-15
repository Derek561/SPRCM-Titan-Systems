"use client";

import type {
  ResidentForTabs,
  NoteForTabs,
  ResidentTaskForTabs,
} from "./ResidentTabs";

export default function OverviewPanel({
  resident,
  notes,
  tasks,
}: {
  resident: ResidentForTabs;
  notes: NoteForTabs[];
  tasks: ResidentTaskForTabs[];
}) {
  const today = startOfToday();

  const openTasks = tasks.filter(
    (t) => t.status === "open" && t.due_date
  );

  const overdue = openTasks.filter(
    (t) => new Date(t.due_date!).getTime() < today
  );

  const dueSoon = openTasks.filter((t) => {
    const d = new Date(t.due_date!).getTime();
    return d >= today && d < today + 7 * 24 * 60 * 60 * 1000;
  });

  const lastNote = notes[0];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Case summary */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">
          Case Summary
        </h3>

        <dl className="space-y-2 text-sm text-slate-300">
          <div className="flex justify-between">
            <dt className="text-slate-400">Status</dt>
            <dd className="capitalize text-orange-300">
              {resident.status}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Created</dt>
            <dd>
              {new Date(resident.created_at).toLocaleDateString()}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Last Updated</dt>
            <dd>
              {new Date(resident.updated_at).toLocaleString()}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Notes</dt>
            <dd>{notes.length}</dd>
          </div>
        </dl>
      </div>

      {/* Task snapshot */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">
          Task Snapshot
        </h3>

        <div className="space-y-3 text-sm">
          <SummaryRow
            label="Overdue items"
            value={overdue.length}
            tone={overdue.length > 0 ? "danger" : "ok"}
          />
          <SummaryRow
            label="Due in next 7 days"
            value={dueSoon.length}
            tone={dueSoon.length > 0 ? "warn" : "ok"}
          />
          <SummaryRow
            label="Total scheduled items"
            value={tasks.filter((t) => t.due_date).length}
            tone="neutral"
          />

          <div className="h-px bg-slate-800 my-2" />

          <div>
            <p className="text-xs uppercase text-slate-400 mb-1">
              Last note logged
            </p>
            {lastNote ? (
              <p className="text-slate-300 text-sm truncate">
                {lastNote.content}
              </p>
            ) : (
              <p className="text-slate-500 text-sm">
                No notes yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "danger" | "warn" | "ok" | "neutral";
}) {
  let color = "text-slate-100";
  if (tone === "danger") color = "text-red-400";
  if (tone === "warn") color = "text-yellow-300";
  if (tone === "ok") color = "text-emerald-300";

  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`text-base font-semibold ${color}`}>
        {value}
      </span>
    </div>
  );
}
