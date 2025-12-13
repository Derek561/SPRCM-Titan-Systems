import { supabase } from "./supabaseClient";

export async function requireAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  return true;
}
