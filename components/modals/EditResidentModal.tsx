"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Resident } from "@/types/resident";

export default function EditResidentModal({
  open,
  resident,
  onClose,
  onUpdated,
}: {
  open: boolean;
  resident: Resident | null;
  onClose: () => void;
  onUpdated: (resident: Resident) => void;
}) {
  // Hooks must always run (unconditional)
  const [fullName, setFullName] = useState(resident?.full_name ?? "");
  const [status, setStatus] = useState(resident?.status ?? "active");
  const [loading, setLoading] = useState(false);

  // Guard AFTER hooks
  if (!open || !resident) return null;

  async function handleSave() {
    if (!resident) return;
    if (!fullName.trim()) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("residents")
      .update({
        full_name: fullName.trim(),
        status,
      })
      .eq("id", resident.id)
      .select("*")
      .single();

    setLoading(false);

    if (error || !data) {
      console.error(error);
      alert("Unable to update resident.");
      return;
    }

    onUpdated(data as Resident);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg p-6 w-full max-w-md space-y-4 border border-slate-700">
        <h2 className="text-slate-200 text-lg font-semibold">Edit Resident</h2>

        <label className="block text-sm text-slate-400">
          Full Name
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-200"
          />
        </label>

        <label className="block text-sm text-slate-400">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-200"
          >
            <option value="active">Active</option>
            <option value="discharged">Discharged</option>
          </select>
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-300 border border-slate-600 rounded hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-500 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
