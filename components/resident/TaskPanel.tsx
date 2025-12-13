"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/* =========================
   Types
========================= */

type Task = {
  id: string;
  resident_id: string;
  title: string;
  category: string | null;
  due_date: string;
  status: "open" | "done" | "archived";
};

/* =========================
   Component
========================= */

export default function TaskPanel({ residentId }: { residentId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [category, setCategory] = useState("CM Service");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`; // YYYY-MM-DD
  });
  const [loading, setLoading] = useState(false);

  /* =========================
     Load Tasks
  ========================= */

  useEffect(() => {
    if (!residentId) return;
    loadTasks();
  }, [residentId]);

  async function loadTasks() {
    const { data, error } = await supabase
      .from("resident_tasks")
      .select("id, resident_id, title, category, due_date, status")
      .eq("resident_id", residentId)
      .neq("status", "archived")
      .order("due_date", { ascending: true });

    if (error) {
      console.error("loadTasks error:", error);
      return;
    }

    setTasks(data ?? []);
  }

  /* =========================
     Add Task
  ========================= */

  async function addTask() {
    if (!newTitle.trim()) return;
    if (!dueDate) {
      alert("Due date is required.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("resident_tasks")
        .insert({
          resident_id: residentId,
          title: newTitle.trim(),
          category,
          due_date: dueDate,
          status: "open",
        });

      if (error) {
        console.error("addTask error:", error);
        return;
      }

      setNewTitle("");
      setDueDate(dueDate); // keep today as default
      await loadTasks();
    } catch (e) {
      console.error("addTask crash:", e);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     Toggle Done
  ========================= */

  async function toggleDone(task: Task) {
    const nextStatus = task.status === "done" ? "open" : "done";

    const { error } = await supabase
      .from("resident_tasks")
      .update({ status: nextStatus })
      .eq("id", task.id);

    if (error) {
      console.error("toggleDone error:", error);
      return;
    }

    await loadTasks();
  }

  function formatClientDate(dateString: string) {
    if (typeof window === "undefined") return "";
    return new Date(dateString).toLocaleDateString();
  }

  /* =========================
     Render
  ========================= */

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
     <h3 className="text-sm font-semibold text-slate-200 mb-2">
  Work Items
</h3>

      {/* Add Task */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New task..."
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          >
            <option>CM Service</option>
            <option>SNAP</option>
            <option>BAM</option>
            <option>STD/FMLA</option>
            <option>Legal</option>
            <option>Other</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <button
          onClick={addTask}
          disabled={loading}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
        >
          {loading ? "Saving…" : "Add Task"}
        </button>
      </div>

      {/* Task List */}
      <div className="mt-4 space-y-2">
        {tasks.length === 0 ? (
          <p className="text-xs text-slate-500">No tasks yet.</p>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2"
            >
              <div>
                <p className="text-sm text-slate-100">{t.title}</p>
                <p className="text-xs text-slate-400">
                  {t.category ?? "Uncategorized"} •{" "}
                  {formatClientDate(t.due_date)}
                </p>
              </div>

              <button
                onClick={() => toggleDone(t)}
                className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200 hover:bg-slate-900"
              >
                {t.status === "done" ? "Reopen" : "Done"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
