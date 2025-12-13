"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

/* =====================
   Types (Aligned to DB)
   ===================== */

type Resident = {
  id: string;
  full_name: string;
  status: string; // active | archived
};

type Task = {
  id: string;
  resident_id: string;
  title: string;
  category: string | null;
  due_type: string | null; // no_due | due_today | due_date
  due_date: string | null; // ISO
  status: "open" | "done" | "archived";
};

type Note = {
  id: string;
  resident_id: string;
  content: string;
  created_at: string;
};

/* =====================
   Dashboard Page
   ===================== */

export default function DashboardPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     Initial Load
     ===================== */

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);

      // 1) Active residents
      const { data: residentData, error: residentErr } = await supabase
        .from("residents")
        .select("id, full_name, status")
        .neq("status", "archived")
        .order("full_name", { ascending: true });

      if (residentErr) console.error("dashboard residents error:", residentErr);

      const activeResidents = (residentData ?? []) as Resident[];
      const activeResidentIds = activeResidents.map((r) => r.id);

      if (activeResidentIds.length === 0) {
        if (!isMounted) return;
        setResidents([]);
        setTasks([]);
        setNotes([]);
        setLoading(false);
        return;
      }

      // 2) Tasks + Notes (single source of truth)
      const [{ data: taskData, error: taskErr }, { data: noteData, error: noteErr }] =
        await Promise.all([
          supabase
            .from("resident_tasks")
            .select("id, resident_id, title, category, due_type, due_date, status")
            .in("resident_id", activeResidentIds)
            .neq("status", "archived")
            .order("due_date", { ascending: true }),
             supabase
            .from("notes")
            .select("id, resident_id, content, created_at")
            .in("resident_id", activeResidentIds)
            .order("created_at", { ascending: false })
            .limit(10),
        ]);

      if (taskErr) console.error("dashboard tasks error:", taskErr);
      if (noteErr) console.error("dashboard notes error:", noteErr);

      if (!isMounted) return;
      setResidents(activeResidents);
      setTasks((taskData ?? []) as Task[]);
      setNotes((noteData ?? []) as Note[]);
      setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =====================
     Date Helpers (Client-Safe)
     ===================== */

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const tomorrow = today + 24 * 60 * 60 * 1000;
  const nextWeek = today + 7 * 24 * 60 * 60 * 1000;

 function parseDate(d?: string | null): number | null {
  if (!d) return null;

  // If it's a timestamp (has T), interpret it as a real moment in time,
  // then normalize to LOCAL midnight (matches what users see).
  if (d.includes("T")) {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return null;
    dt.setHours(0, 0, 0, 0);
    return dt.getTime();
  }

  // If it's a date-only string (YYYY-MM-DD), force LOCAL date construction (no UTC drift).
  const parts = d.split("-").map(Number);
  if (parts.length !== 3) return null;

  const [year, month, day] = parts;
  const local = new Date(year, month - 1, day);
  local.setHours(0, 0, 0, 0);
  return local.getTime();
}

  /* =====================
     Derived Data
     ===================== */

  const residentById = useMemo(
    () => new Map(residents.map((r) => [r.id, r])),
    [residents]
  );

  const openTasks = useMemo(
    () => tasks.filter((t) => t.status === "open" && !!t.due_date),
    [tasks]
  );

  const overdue = useMemo(
    () => openTasks.filter((t) => (parseDate(t.due_date) ?? 0) < today),
    [openTasks, today]
  );

  const dueToday = useMemo(
  () =>
    openTasks.filter(t => {
      const ts = parseDate(t.due_date);
      return ts !== null && ts >= today && ts < tomorrow;
    }),
  [openTasks, today, tomorrow]
);

const dueThisWeek = useMemo(
  () =>
    openTasks.filter(t => {
      const ts = parseDate(t.due_date);
      return ts !== null && ts >= today && ts < nextWeek;
    }),
  [openTasks, today, nextWeek]
);

  /* =====================
     Render
     ===================== */

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-8">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
  Tactical view of active work items and residents.
</p>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
  label="Overdue Items"
  value={overdue.length}
  description="Open work items past their due date."
  tone="danger"
/>

<KpiCard
  label="Due Today"
  value={dueToday.length}
  description="Work items requiring action today."
  tone="warn"
/>

<KpiCard
  label="Due ≤ 7 Days"
  value={dueThisWeek.length}
  description="Work items coming due in the next 7 days."
  tone="info"
/>

        <KpiCard
          label="Active Residents"
          value={residents.length}
          description="Currently active cases."
        />
      </section>

      {/* Task Buckets */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TaskBucket title="Overdue Items" items={overdue} residentById={residentById} />
        <TaskBucket title="Due Today" items={dueToday} residentById={residentById} />
        <TaskBucket title="Due ≤ 7 Days" items={dueThisWeek} residentById={residentById} />
      </section>

      {/* Recent Notes */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Recent Notes Activity</h3>
        {notes.length === 0 ? (
          <p className="text-xs text-slate-500">No recent notes.</p>
        ) : (
          <ul className="space-y-2 text-xs">
            {notes.map((n) => {
              const res = residentById.get(n.resident_id);
              return (
                <li
                  key={n.id}
                  className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2"
                >
                  <div>
                    <p className="uppercase tracking-wide text-[11px] text-slate-400">
                      {res?.full_name ?? "Unknown resident"}
                    </p>
                    <p className="text-slate-100 truncate max-w-xl">{n.content}</p>
                  </div>
                  {res && (
                    <Link
                      href={`/residents/${res.id}`}
                      className="text-orange-300 hover:underline"
                    >
                      Open Profile
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {loading && <p className="text-xs text-slate-500">Loading dashboard data…</p>}
    </div>
  );
}

/* =====================
   Reusable Components
   ===================== */

function TaskBucket({
  title,
  items,
  residentById,
}: {
  title: string;
  items: Task[];
  residentById: Map<string, Resident>;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <span className="text-xs text-slate-400">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-slate-500">Nothing here.</p>
      ) : (
        <ul className="space-y-2 text-xs">
          {items.slice(0, 5).map((t) => {
            const res = residentById.get(t.resident_id);
            return (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2"
              >
                <div>
                  <p className="text-slate-100">{t.title}</p>
                  <p className="text-slate-400">{res?.full_name ?? "Unknown resident"}</p>
                </div>
                {res && (
                  <Link
                    href={`/residents/${res.id}`}
                    className="text-orange-300 hover:underline"
                  >
                    Open Profile
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  description,
  tone,
}: {
  label: string;
  value: number;
  description: string;
  tone?: "danger" | "warn" | "info";
}) {
  let valueColor = "text-slate-100";
  if (tone === "danger") valueColor = "text-red-400";
  if (tone === "warn") valueColor = "text-yellow-300";
  if (tone === "info") valueColor = "text-cyan-300";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex flex-col gap-1">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      <div className={`text-2xl font-semibold ${valueColor}`}>{value}</div>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}
