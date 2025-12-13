// components/resident/ActionMenu.tsx
"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  id: string;
  archived: boolean;
};

export default function ActionMenu({ id, archived }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleArchive() {
    try {
      setBusy(true);
      const { error } = await supabase
        .from("residents")
        .update({
          status: "archived",
          archived: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Failed to archive resident", error);
        alert("Archiving failed. Check console for details.");
      } else {
        // quick + dirty but reliable for now
        window.location.reload();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleActivate() {
    try {
      setBusy(true);
      const { error } = await supabase
        .from("residents")
        .update({
          status: "active",
          archived: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Failed to activate resident", error);
        alert("Activation failed. Check console for details.");
      } else {
        window.location.reload();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this resident?"
    );
    if (!confirmDelete) return;

    try {
      setBusy(true);
      const { error } = await supabase.from("residents").delete().eq("id", id);

      if (error) {
        console.error("Failed to delete resident", error);
        alert("Delete failed. Check console for details.");
      } else {
        window.location.reload();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-50"
        disabled={busy}
      >
        ⋮
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-slate-900 border border-slate-700 text-slate-200">
        <DropdownMenuItem onClick={() => router.push(`/residents/${id}`)}>
          Open Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push(`/residents/${id}/edit`)}>
          Edit Resident
        </DropdownMenuItem>

        {!archived ? (
          <DropdownMenuItem
            className="text-yellow-300"
            onClick={handleArchive}
          >
            Archive Resident
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-emerald-300"
            onClick={handleActivate}
          >
            Activate Resident
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="text-red-400" onClick={handleDelete}>
          Delete Resident
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
