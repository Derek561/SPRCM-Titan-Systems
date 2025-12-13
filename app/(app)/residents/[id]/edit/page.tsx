"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditResidentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("residents")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setFullName(data.full_name);
        setStatus(data.status);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  async function handleSave() {
    setSaving(true);

    await supabase
      .from("residents")
      .update({
        full_name: fullName,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    router.push(`/residents/${id}`);
  }

  if (loading) return <p className="p-6 text-slate-400">Loading…</p>;

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-100">Edit Resident</h1>

      {/* Full name */}
      <div>
        <label className="block text-sm text-slate-300 mb-1">Full Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm text-slate-300 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100"
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>

        <button
          onClick={() => router.push(`/residents/${id}`)}
          className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
