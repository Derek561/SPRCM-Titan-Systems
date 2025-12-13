"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { NoteForTabs } from "./ResidentTabs";
import AttachmentList from "@/components/attachments/AttachmentList";

export default function NotesPanel({
  residentId,
  notes,
  onNoteAdded,
}: {
  residentId: string;
  notes: NoteForTabs[];
  onNoteAdded: (note: NoteForTabs) => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddNote() {
    if (!content.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .insert({
        resident_id: residentId,
        content: content.trim(),
      })
      .select("*")
      .single();

    setLoading(false);

    if (error || !data) {
      console.error(error);
      alert("Unable to add note.");
      return;
    }

    onNoteAdded(data as NoteForTabs);
    setContent("");
  }

  return (
    <div className="space-y-6">
      {/* Add note */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Add a note
        </h3>

        <textarea
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 min-h-[80px]"
          placeholder="Document contact, case updates, or important details…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleAddNote}
            disabled={loading || !content.trim()}
            className="px-4 py-1.5 text-sm rounded-lg bg-orange-500 hover:bg-orange-400 text-white transition disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save Note"}
          </button>
        </div>
      </div>

      {/* Note history */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Note history
        </h3>

        {notes.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No notes recorded yet. Start the record above.
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-lg bg-slate-800 border border-slate-700 p-4 space-y-3"
              >
                <p className="text-slate-100 whitespace-pre-wrap">
                  {note.content}
                </p>

                <AttachmentList noteId={note.id} />

                <div className="text-xs text-slate-400">
                  {new Date(note.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
