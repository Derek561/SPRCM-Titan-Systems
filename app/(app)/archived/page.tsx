"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ActionMenu from "@/components/resident/ActionMenu";

export default function ArchivedResidentsPage() {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("residents")
        .select("*")
        .eq("archived", true)
        .order("full_name");

      setResidents(data || []);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-slate-100 mb-6">
        Archived Residents
      </h1>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-800">
              <th className="py-2">Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((r) => (
              <tr key={r.id} className="border-b border-slate-900">
                <td className="py-3 text-slate-200">{r.full_name}</td>
                <td className="text-yellow-400">Archived</td>
                <td>
                  <ActionMenu id={r.id} archived={true} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
