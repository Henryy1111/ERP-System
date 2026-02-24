"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  User,
  Shield,
  Camera,
  Loader2,
  ChevronLeft,
  AlertCircle,
  ShieldCheck,
  RefreshCcw,
  Users, // Icon tambahan untuk header tabel
  Calendar,
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_url: string | null;
  updated_at: string;
}

export default function ManagerProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]); // State untuk tabel semua profil

  // Form State
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [toast, setToast] = useState<{
    show: boolean;
    msg: string;
    type: "success" | "error";
  }>({
    show: false,
    msg: "",
    type: "success",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  async function fetchInitialData() {
    try {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchAllProfiles()]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async function fetchAllProfiles() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) throw error;
      setAllProfiles(data || []);
    } catch (err: any) {
      showToast("Failed to fetch all profiles", "error");
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      showToast("Profile updated successfully!");
      fetchInitialData(); // Refresh data profile & tabel
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            Loading System Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900 pb-20">
      {/* --- TOAST --- */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-4 animate-in slide-in-from-right-full bg-white ${toast.type === "success" ? "border-blue-500 text-blue-800" : "border-rose-500 text-rose-800"}`}
        >
          {toast.type === "success" ? (
            <ShieldCheck size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-semibold">{toast.msg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-8 pt-10">
        {/* --- BACK BUTTON --- */}
        <button
          onClick={() => router.push("/dashboard/manager")}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-6"
        >
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-sm">
            <ChevronLeft size={16} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Back to Dashboard
          </span>
        </button>

        {/* --- TOP SECTION: EDIT PROFILE --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/40 text-center sticky top-10">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                </div>
                <div className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-full shadow-lg border-2 border-white">
                  <Camera size={16} />
                </div>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {profile?.full_name}
              </h2>
              <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                <Shield size={12} className="mr-1.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {profile?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">My Profile</h3>
                <p className="text-xs text-slate-400">
                  Manage your account information and credentials.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-slate-300">
                      Role (Locked)
                    </label>
                    <input
                      disabled
                      value={profile?.role}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed font-bold text-slate-400"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Avatar URL
                    </label>
                    <input
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 uppercase text-[11px] tracking-widest active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <RefreshCcw size={16} /> Update Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: ALL PROFILES TABLE --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-none">
                Registered Team Members
              </h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Directory of all profiles in the system
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/30 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      User Info
                    </th>
                    <th className="px-6 py-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      System Role
                    </th>
                    <th className="px-6 py-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      User ID
                    </th>
                    <th className="px-6 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allProfiles.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            {p.avatar_url ? (
                              <img
                                src={p.avatar_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <User size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {p.full_name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              Active Member
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            p.role === "admin"
                              ? "bg-rose-50 text-rose-600 border-rose-100"
                              : p.role === "manager"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-slate-50 text-slate-600 border-slate-100"
                          }`}
                        >
                          {p.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <code className="text-[10px] text-slate-300 font-mono bg-slate-50 px-2 py-1 rounded tracking-tighter">
                          {p.id.substring(0, 18)}...
                        </code>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                          <Calendar size={12} className="text-blue-500" />
                          {new Date(p.updated_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
