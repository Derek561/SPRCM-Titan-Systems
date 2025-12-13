// app/residents/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ActionMenu from "@/components/resident/ActionMenu";
import { requireAuth } from "@/lib/requireAuth";
import AddResidentModal from "@/components/modals/AddResidentModal";

type Resident = {
  id: string;
  full_name: string;
  status: string;
  archived: boolean;
};

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showAddResident, setShowAddResident] = useState(false);

  useEffect(() => {
    async function init() {
      // 1) Check authentication
      const isAuthed = await requireAuth();

      if (!isAuthed) {
        router.push("/login");
        return;
      }

      // 2) Load active residents
      const { data, error } = await supabase
        .from("residents")
        .select("*")
        .eq("archived", false)
        .order("full_name");

      if (error) {
        console.error("Failed to load residents", error);
        setResidents([]);
      } else {
        setResidents((data as Resident[]) || []);
      }

      setLoading(false);
    }

    init();
  }, [router]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-100">
          Active Residents
        </h1>

        <button
  onClick={() => setShowAddResident(true)}
  className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500"
>
  + Add Resident
</button>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : residents.length === 0 ? (
        <p className="text-slate-400">No active residents.</p>
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
                <td className="text-emerald-400 capitalize">{r.status}</td>
                <td>
                  {/* archived = false because this is the Active list */}
                  <ActionMenu id={r.id} archived={false} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AddResidentModal
  open={showAddResident}
  onClose={() => setShowAddResident(false)}
  onCreated={(resident) => {
    setResidents((prev) => [...prev, resident]);
  }}
/>
    </div>
  );
}
