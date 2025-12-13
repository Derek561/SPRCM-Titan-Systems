"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      await supabase.auth.signOut();
      router.replace("/login");
    }
    doLogout();
  }, [router]);

  return (
    <div className="text-slate-200 p-6">
      Logging out...
    </div>
  );
}
