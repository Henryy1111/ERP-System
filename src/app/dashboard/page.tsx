"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkRoleAndRedirect() {
      try {
        // 1. Ambil user yang sedang login
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        // 2. Ambil role dari tabel profiles
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !profile) {
          console.error("Error fetching profile:", error);
          return;
        }

        // 3. Redirect berdasarkan Role
        // Kita paksa ke huruf kecil (lowercase) supaya aman di URL
        const rolePath = profile.role.toLowerCase();
        router.push(`/dashboard/${rolePath}`);
      } catch (err) {
        console.error("System error:", err);
      }
    }

    checkRoleAndRedirect();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div className="absolute inset-0 blur-xl bg-blue-400/20 animate-pulse" />
      </div>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">
        Identifying Authority...
      </p>
    </div>
  );
}
