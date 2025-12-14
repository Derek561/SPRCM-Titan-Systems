// lib/storage.ts
import { supabase } from "@/lib/supabaseClient";

/* =========================
   Filename sanitizer
========================= */
export function sanitizeFilename(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/* =========================
   Open attachment
========================= */
export async function openAttachment(filePath: string) {
  const { data, error } = await supabase.storage
    .from("resident-files")
    .createSignedUrl(filePath, 60);

  if (error || !data?.signedUrl) {
    throw error;
  }

  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
}
