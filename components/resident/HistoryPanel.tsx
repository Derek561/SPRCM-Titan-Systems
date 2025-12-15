"use client";

import type {
  ResidentForTabs,
  NoteForTabs,
  ResidentTaskForTabs,
} from "./ResidentTabs";

export default function HistoryPanel({
  resident,
  notes,
  tasks,
}: {
  resident: ResidentForTabs;
  notes: NoteForTabs[];
  tasks: ResidentTaskForTabs[];
}) {
  const withDue = tasks.filter((t) => t.due_date);

  return (
    <div className="space-y-6 text-sm text-slate-300">
      <section>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Timeline summary
        </h3>
        <ul className="space-y-1 text-xs">
          <li>
            • Case opened:{" "}
            {new Date(resident.created_at).toLocaleString()}
          </li>
          <li>
            • Last updated:{" "}
            {new Date(resident.updated_at).toLocaleString()}
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Notes history
        </h3>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>• Total notes: {notes.length}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Task history
        </h3>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>• Total tasks: {tasks.length}</li>
          <li>
            • Scheduled tasks: {withDue.length}
          </li>
        </ul>
      </section>
    </div>
  );
}
