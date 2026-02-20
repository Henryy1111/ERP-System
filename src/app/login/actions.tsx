"use client";

import { supabase } from "../lib/supabase";

export async function loginUser(email: string, password: string) {
  // 1. Login ke Auth Supabase
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) return { error: authError.message };

  // 2. Ambil data Role dari tabel Profiles berdasarkan ID user yang login
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", authData.user.id)
    .single();

  if (profileError) return { error: "Gagal mengambil data profile." };

  // 3. Kembalikan data Role untuk digunakan di Frontend
  return {
    success: true,
    role: profileData.role,
    name: profileData.full_name,
  };
}
