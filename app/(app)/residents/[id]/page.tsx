"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import ResidentHeader from "@/components/resident/ResidentHeader";
import ActionMenu from "@/components/resident/ActionMenu";
import TaskPanel from "@/components/resident/TaskPanel";
import ResidentTabs from "@/components/resident/ResidentTabs";

/* =========================
   Types
========================= */

type Resident = {
  id: string;
  full_name: string;
  status: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  discharge_date: string | null;
  discharge_reason: string | null;
};

type NoteForTabs = {
  id: string;
  content: string;
  created_at: string;
};

type ResidentTask = {
  id: string;
  due_date: string | null;
  status: string;
};

/* =========================
   Page
========================= */

export default function ResidentProfilePage() {
  const router = useRouter();
  const { id: residentId } = useParams<{ id: string }>();

  const [resident, setResident] = useState<Resident | null>(null);
  const [notes, setNotes] = useState<NoteForTabs[]>([]);
  const [tasks, setTasks] = useState<ResidentTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!residentId) return;

    async function load() {
      setLoading(true);

      const { data: residentData, error } = await supabase
        .from("residents")
        .select("*")
        .eq("id", residentId)
        .single();

      if (error || !residentData) {
        router.push("/residents");
        return;
      }

      const [{ data: notesData }, { data: taskData }] = await Promise.all([
        supabase
          .from("notes")
          .select("id, content, created_at")
          .eq("resident_id", residentId)
          .order("created_at", { ascending: false }),

        supabase
          .from("resident_tasks")
          .select("id, due_date, status")
          .eq("resident_id", residentId)
          .neq("status", "archived"),
      ]);

      setResident(residentData);
      setNotes(notesData ?? []);
      setTasks(taskData ?? []);
      setLoading(false);
    }

    load();
  }, [residentId, router]);

  if (loading || !resident) {
    return <div className="p-6 text-slate-400">Loading resident profile…</div>;
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <ResidentHeader resident={resident} />
      <TaskPanel residentId={resident.id} />
      <ActionMenu id={resident.id} archived={resident.archived} />

      <ResidentTabs
        resident={resident}
        notes={notes}
        tasks={tasks}
        onNoteAdded={(n) => setNotes((prev) => [n, ...prev])}
      />

      <button
        onClick={() => router.push("/residents")}
        className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800"
      >
        Back to Residents
      </button>
    </div>
  );
}
