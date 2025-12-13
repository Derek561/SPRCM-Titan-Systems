// /lib/actions/residents/activateResident.ts
"use server";

import { supabase } from "@/lib/supabaseClient";

export async function activateResident(id: string) {
  const { data, error } = await supabase
    .from("residents")
    .update({
      status: "active",
      archived: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to activate resident:", error);
    return { error };
  }

  return { data };
}
