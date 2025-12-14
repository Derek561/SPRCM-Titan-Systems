"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { sanitizeFilename } from "@/lib/storage";

type Props = {
  residentId: string;
  onClose: () => void;
  onSaved: (note: any) => void;
};

export default function AddNoteModal({ residentId, onClose, onSaved }: Props) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function saveNote() {
    if (!content.trim()) return;

    setLoading(true);

    try {
      // 1️⃣ Create note FIRST
      const { data: note, error: noteError } = await supabase
        .from("notes")
        .insert({
          resident_id: residentId,
          content: content.trim(),
        })
        .select()
        .single();

      if (noteError || !note) throw noteError;

      // 2️⃣ Upload attachment (optional)
      if (file) {
        const safeName = sanitizeFilename(file.name);
        const objectKey = `${residentId}/${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("resident-files")
          .upload(objectKey, file, { upsert: false });

        if (uploadError) throw uploadError;

        // 3️⃣ Save attachment metadata
        const { error: metaError } = await supabase
          .from("note_attachments")
          .insert({
            note_id: note.id,
            resident_id: residentId,
            file_path: objectKey, // object key ONLY
            file_name: file.name, // original name for display
          });

        if (metaError) throw metaError;
      }

      // 4️⃣ Update UI
      onSaved(note);

      // 5️⃣ Close modal
      onClose();
    } catch (err) {
      console.error("SAVE NOTE ERROR:", err);
      alert("Failed to save note or attachment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 p-5 rounded-lg w-full max-w-md border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-3">
          Add Case Note
        </h3>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[100px] bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100"
          placeholder="Document case activity, contact, or updates…"
        />

        <input
          type="file"
          className="mt-3 block w-full text-sm text-slate-300"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="text-slate-300"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={saveNote}
            disabled={loading}
            className="px-3 py-1.5 bg-orange-600 rounded text-white text-sm disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
