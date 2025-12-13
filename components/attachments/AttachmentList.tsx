"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Attachment = {
  id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
};

type SignedAttachment = Attachment & {
  signedUrl: string | null;
};

export default function AttachmentList({ noteId }: { noteId: string }) {
  const [attachments, setAttachments] = useState<SignedAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttachments() {
      setLoading(true);

      // 1. Fetch attachment metadata
      const { data, error } = await supabase
        .from("note_attachments")
        .select("*")
        .eq("note_id", noteId)
        .order("uploaded_at", { ascending: true });

      if (error || !data) {
        console.error("Failed to load attachments", error);
        setLoading(false);
        return;
      }

      // 2. Generate signed URLs
      const withUrls: SignedAttachment[] = await Promise.all(
        data.map(async (att) => {
          const { data: signed, error } = await supabase.storage
            .from("resident-files")
            .createSignedUrl(att.file_path, 60 * 60); // 1 hour

          if (error) {
            console.error("SIGNED URL ERROR:", error);
          }

          return {
            ...att,
            signedUrl: signed?.signedUrl ?? null,
          };
        })
      );

      setAttachments(withUrls);
      setLoading(false);
    }

    loadAttachments();
  }, [noteId]);

  if (loading) {
    return <p className="text-slate-400 text-sm mt-2">Loading attachments…</p>;
  }

  if (attachments.length === 0) {
    return null;
  }
// NOTE: Attachment download disabled in dev due to Next.js App Router interception.
// Files upload + metadata confirmed working. Revisit post-deploy or via API proxy.
  return (
    <div className="mt-3 space-y-1">
      <p className="text-sm text-slate-400 font-medium">Attachments</p>

      <ul className="mt-2 space-y-1">
        {attachments.map((att) => (
          <li key={att.id}>
            {att.signedUrl ? (
              <a
                href={att.signedUrl}
                className="text-orange-400 hover:underline text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(
                    att.signedUrl!,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                {att.file_name}
              </a>
            ) : (
              <span className="text-slate-500 text-sm">
                {att.file_name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
