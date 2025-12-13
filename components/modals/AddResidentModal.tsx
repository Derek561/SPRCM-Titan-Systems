"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Resident } from "@/types/resident";

export default function AddResidentModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (resident: Resident) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSave() {
    if (!fullName.trim()) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("residents")
      .insert({
        full_name: fullName.trim(),
        status,
      })
      .select("*")
      .single();

    setLoading(false);

    if (!error && data) {
      onCreated(data as Resident);
      setFullName("");
      setStatus("active");
      onClose();
    } else {
      console.error(error);
      alert("Unable to create resident.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">
          Add Resident
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
              placeholder="Resident name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Status
            </label>
            <select
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/40 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-1.5 text-sm rounded-lg bg-orange-500 hover:bg-orange-400 text-white transition disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
