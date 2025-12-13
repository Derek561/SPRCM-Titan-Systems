"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { DueDateForTabs } from "./ResidentTabs";

export default function DueDatesPanel({
  residentId,
  dueDates,
  onDueDateAdded,
  onDueDateUpdated,
}: {
  residentId: string;
  dueDates: DueDateForTabs[];
  onDueDateAdded: (due: DueDateForTabs) => void;
  onDueDateUpdated: (due: DueDateForTabs) => void;
}) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddDueDate() {
    if (!title.trim() || !dueDate) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("due_dates")
      .insert({
        resident_id: residentId,
        title: title.trim(),
        due_date: dueDate,
      })
      .select("*")
      .single();

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Unable to create due date.");
      return;
    }

    onDueDateAdded(data as DueDateForTabs);
    setTitle("");
    setDueDate("");
  }

  async function toggleComplete(d: DueDateForTabs) {
    const { data, error } = await supabase
      .from("due_dates")
      .update({ completed: !d.completed })
      .eq("id", d.id)
      .select("*")
      .single();

    if (error) {
      console.error(error);
      alert("Unable to update item.");
      return;
    }

    onDueDateUpdated(data as DueDateForTabs);
  }

  const openItems = dueDates.filter((d) => !d.completed);
  const completedItems = dueDates.filter((d) => d.completed);

  return (
    <div className="space-y-6">
      {/* Add due date */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Add a due date
        </h3>

        <div className="grid gap-2 md:grid-cols-[2fr,1fr,auto]">
          <input
            type="text"
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
            placeholder="e.g., BAM due, SNAP form, Case review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button
            onClick={handleAddDueDate}
            disabled={loading || !title.trim() || !dueDate}
            className="px-4 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-400 text-white transition disabled:opacity-50"
          >
            {loading ? "Saving…" : "Add"}
          </button>
        </div>
      </div>

      {/* Open items */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Open items
        </h3>

        {openItems.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No open items. You&apos;re caught up for this resident.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {openItems.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-lg bg-slate-800 border border-slate-700 px-3 py-2"
              >
                <div>
                  <p className="text-slate-100">{d.title}</p>
                  <p className="text-slate-500 text-xs">
                    Due {new Date(d.due_date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => toggleComplete(d)}
                  className="text-xs rounded-full border border-emerald-500 px-3 py-1 text-emerald-300 hover:bg-emerald-500/10"
                >
                  Mark complete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Completed items */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Completed
        </h3>

        {completedItems.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No completed items logged yet.
          </p>
        ) : (
          <ul className="space-y-1 text-xs text-slate-400">
            {completedItems.map((d) => (
              <li key={d.id}>
                <span className="text-emerald-300 mr-1">✓</span>
                {d.title} •{" "}
                {new Date(d.due_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
