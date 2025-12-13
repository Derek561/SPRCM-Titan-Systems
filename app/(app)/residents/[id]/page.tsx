"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

/* Components */
import ResidentHeader from "@/components/resident/ResidentHeader";
import ActionMenu from "@/components/resident/ActionMenu";
import TaskPanel from "@/components/resident/TaskPanel";
import AddNoteModal from "@/components/notes/AddNoteModal";

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

type NoteAttachment = {
  id: string;
  file_name: string;
};

type Note = {
  id: string;
  content: string;
  created_at: string;
  note_attachments: NoteAttachment[];
};

/* =========================
   Page
========================= */

export default function ResidentProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const residentId = params.id;

  const [resident, setResident] = useState<Resident | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddNote, setShowAddNote] = useState(false);

  /* =========================
     Load Resident + Notes
  ========================= */

  useEffect(() => {
    if (!residentId) return;

    async function loadData() {
      setLoading(true);

      /* -------- Resident -------- */
      const {
        data: residentData,
        error: residentError,
      } = await supabase
        .from("residents")
        .select(`
          id,
          full_name,
          status,
          archived,
          created_at,
          updated_at,
          discharge_date,
          discharge_reason
        `)
        .eq("id", residentId)
        .single();

      if (residentError || !residentData) {
        console.error("Resident load failed", residentError);
        router.push("/residents");
        return;
      }

      setResident(residentData);

      /* -------- Notes -------- */
      const { data: notesData } = await supabase
        .from("notes")
        .select(`
          id,
          content,
          created_at,
          note_attachments (
            id,
            file_name
          )
        `)
        .eq("resident_id", residentId)
        .order("created_at", { ascending: false });

      setNotes(notesData || []);
      setLoading(false);
    }

    loadData();
  }, [residentId, router]);

  /* =========================
     Loading Guard
  ========================= */

  if (loading || !resident) {
    return (
      <div className="p-6 text-slate-400 text-sm">
        Loading resident profile…
      </div>
    );
  }

  /* =========================
     Render
  ========================= */

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <ResidentHeader resident={resident} />

      {/* Tasks */}
      <TaskPanel residentId={resident.id} />

      {/* Actions */}
      <div className="flex gap-3 items-center">
        <button
          onClick={() => setShowAddNote(true)}
          className="px-4 py-2 bg-orange-600 rounded-lg text-white hover:bg-orange-500"
        >
          + Add Note
        </button>

        <ActionMenu id={resident.id} archived={resident.archived} />
      </div>

      {/* Notes */}
      <section className="bg-slate-900 p-5 rounded-lg border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">
          Case Notes
        </h2>

        {notes.length === 0 ? (
          <p className="text-slate-400 text-sm">No notes recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-slate-800 rounded-lg border border-slate-700"
              >
                <p className="text-slate-200 text-sm whitespace-pre-wrap">
                  {note.content}
                </p>

                {note.note_attachments?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {note.note_attachments.map((file) => (
                      <li
                        key={file.id}
                        className="text-orange-400 text-sm"
                      >
                        {file.file_name}
                      </li>
                    ))}
                  </ul>
                )}

                <p className="text-xs text-slate-500 mt-3">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Back */}
      <button
        onClick={() => router.push("/residents")}
        className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800"
      >
        Back to Residents
      </button>

      {/* Add Note Modal */}
      {showAddNote && (
        <AddNoteModal
          residentId={resident.id}
          onClose={() => setShowAddNote(false)}
          onSaved={() => router.refresh()}
        />
      )}
    </div>
  );
}
