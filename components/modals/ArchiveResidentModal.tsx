"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function ArchiveResidentModal({
  open,
  resident,
  onClose,
  onArchived,
}: {
  open: boolean;
  resident: any | null;
  onClose: () => void;
  onArchived: (payload: {
    id: string;
    discharge_date: string | null;
    discharge_reason: string | null;
  }) => void;
}) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleArchive() {
    if (!resident) return;

    setLoading(true);

    // ⭐ FINAL CANON UPDATE — sync archived flag + status
    const { data, error } = await supabase
      .from("residents")
      .update({
        archived: true,
        status: "archived",
      })
      .eq("id", resident.id)
      .select("id, discharge_date, discharge_reason")
      .single();

    setLoading(false);

    if (!error && data) {
      // instantly remove from active list
      onArchived({
        id: data.id,
        discharge_date: data.discharge_date,
        discharge_reason: data.discharge_reason,
      });

      onClose();
    } else {
      console.error(error);
      alert("Unable to archive resident.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-red-400 mb-2">
          Archive Resident
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed">
          {resident ? (
            <>
              You are about to move{" "}
              <strong className="text-slate-100">{resident.full_name}</strong> to
              the archived list. This removes them from your active caseload and
              marks their case as completed or closed.
            </>
          ) : (
            "Loading resident info…"
          )}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/40 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleArchive}
            disabled={loading || !resident}
            className="px-4 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-500 text-white transition disabled:opacity-50"
          >
            {loading ? "Archiving…" : "Archive"}
          </button>
        </div>
      </div>
    </div>
  );
}
