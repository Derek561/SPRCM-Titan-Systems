"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AttachmentList from "@/components/attachments/AttachmentList";
import { sanitizeFilename } from "@/lib/storage";

export default function NotesPanel({
  residentId,
  notes,
  onNoteAdded,
}: {
  residentId: string;
  notes: {
    id: string;
    content: string;
    created_at: string;
  }[];
  onNoteAdded: (note: any) => void;
}) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAddNote() {
    if (!content.trim()) return;

    setLoading(true);

    try {
      /* 1️⃣ Create note */
      const { data: note, error: noteError } = await supabase
        .from("notes")
        .insert({
          resident_id: residentId,
          content: content.trim(),
        })
        .select()
        .single();

      if (noteError || !note) throw noteError;

      /* 2️⃣ Optional attachment */
      if (file) {
        const safeName = sanitizeFilename(file.name);
        const objectKey = `${residentId}/${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("resident-files")
          .upload(objectKey, file, { upsert: false });

        if (uploadError) throw uploadError;

        const { error: metaError } = await supabase
          .from("note_attachments")
          .insert({
            note_id: note.id,
            resident_id: residentId,
            file_path: objectKey,
            file_name: safeName,
          });

        if (metaError) throw metaError;
      }

      onNoteAdded(note);
      setContent("");
      setFile(null);
    } catch (err) {
      console.error("ADD NOTE ERROR:", err);
      alert("Failed to save note or attachment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Add note */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">
          Add a note
        </h3>

        <textarea
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 min-h-[80px]"
          placeholder="Document contact, case updates, or important details…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* ✅ Attachment input restored */}
        <input
          type="file"
          className="mt-3 block w-full text-xs text-slate-300"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleAddNote}
            disabled={loading || !content.trim()}
            className="px-4 py-1.5 text-sm rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition disabled:opacity-50"
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
            No notes recorded yet.
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

                {/* ✅ Attachments render here */}
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
