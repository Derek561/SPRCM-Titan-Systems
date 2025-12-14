"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { openAttachment } from "@/lib/storage";

type Attachment = {
  id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
};

export default function AttachmentList({ noteId }: { noteId: string }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("note_attachments")
        .select("*")
        .eq("note_id", noteId)
        .order("uploaded_at", { ascending: true });

      setAttachments(data ?? []);
    }

    load();
  }, [noteId]);

  if (attachments.length === 0) return null;

  return (
    <div className="mt-3 space-y-1">
      <p className="text-xs text-slate-400 font-medium">Attachments</p>
      <ul className="space-y-1">
        {attachments.map((att) => (
          <li key={att.id}>
            <button
              type="button"
              onClick={() => openAttachment(att.file_path)}
              className="text-orange-400 underline text-sm hover:text-orange-300"
            >
              {att.file_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
