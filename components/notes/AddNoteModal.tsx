"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  residentId: string;
  onClose: () => void;
  onSaved: () => void;
};

export default function AddNoteModal({ residentId, onClose, onSaved }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveNote() {
    if (!content.trim()) return;

    setLoading(true);

    await supabase.from("notes").insert({
      resident_id: residentId,
      content,
    });

    setLoading(false);
    onSaved();
    onClose();
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
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={saveNote}
            disabled={loading}
            className="px-3 py-1.5 bg-orange-600 rounded text-white text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
