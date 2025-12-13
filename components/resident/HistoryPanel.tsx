"use client";

import type {
  ResidentForTabs,
  NoteForTabs,
  DueDateForTabs,
} from "./ResidentTabs";

export default function HistoryPanel({
  resident,
  notes,
  dueDates,
}: {
  resident: ResidentForTabs;
  notes: NoteForTabs[];
  dueDates: DueDateForTabs[];
}) {
  const firstNote = notes[notes.length - 1];
  const lastNote = notes[0];

  const firstDue = dueDates[0];
  const lastDue = dueDates[dueDates.length - 1];

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
          {resident.discharge_date && (
            <li>
              • Discharged:{" "}
              {new Date(resident.discharge_date).toLocaleDateString()}
            </li>
          )}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Notes history
        </h3>
        {notes.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No notes on file yet.
          </p>
        ) : (
          <ul className="space-y-1 text-xs text-slate-400">
            <li>• Total notes: {notes.length}</li>
            {firstNote && (
              <li>
                • First note logged:{" "}
                {new Date(firstNote.created_at).toLocaleString()}
              </li>
            )}
            {lastNote && (
              <li>
                • Most recent note:{" "}
                {new Date(lastNote.created_at).toLocaleString()}
              </li>
            )}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Due date history
        </h3>
        {dueDates.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No scheduled items recorded.
          </p>
        ) : (
          <ul className="space-y-1 text-xs text-slate-400">
            <li>• Total items: {dueDates.length}</li>
            {firstDue && (
              <li>
                • First scheduled:{" "}
                {new Date(firstDue.due_date).toLocaleDateString()}
              </li>
            )}
            {lastDue && (
              <li>
                • Last scheduled:{" "}
                {new Date(lastDue.due_date).toLocaleDateString()}
              </li>
            )}
            <li>
              • Completed: {dueDates.filter((d) => d.completed).length}
            </li>
            <li>
              • Open: {dueDates.filter((d) => !d.completed).length}
            </li>
          </ul>
        )}
      </section>
    </div>
  );
}
