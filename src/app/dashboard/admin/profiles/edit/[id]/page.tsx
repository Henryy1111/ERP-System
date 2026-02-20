"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Shield,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    avatar_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, [params.id]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setFormData({
        full_name: data.full_name || "",
        role: data.role || "STAFF",
        avatar_url: data.avatar_url || "",
      });
    } catch (error) {
      console.error("Error:", error);
      router.push("/dashboard/admin/profiles");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          role: formData.role,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) throw error;
      router.push("/dashboard/admin/profiles");
      router.refresh();
    } catch (error) {
      alert("Gagal mengupdate profil");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-blue-400/20 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* NAVIGATION & HEADER */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin/profiles"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Back to Directory
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            Edit <span className="text-blue-600">Profile.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Configuration for security clearance and personal identity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT SIDE: PREVIEW CARD (THE "MAHAL" LOOK) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] -mr-16 -mt-16 rounded-full" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    className="w-24 h-24 rounded-[30px] object-cover border-4 border-white/10 shadow-2xl"
                    alt="preview"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-[30px] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <User className="w-10 h-10 text-white/50" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 rounded-full border-4 border-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xl truncate max-w-full italic">
                  {formData.full_name || "New Identity"}
                </h3>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white/10 rounded-full text-blue-400">
                  {formData.role}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-[30px] flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              Pastikan level akses diberikan sesuai dengan tanggung jawab
              pengguna dalam sistem.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM EDIT */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleUpdate}
            className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-8"
          >
            {/* Input Nama */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <User className="w-3 h-3 text-blue-600" /> Member Identity
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:shadow-inner transition-all font-bold text-slate-800 text-lg"
                placeholder="Full name..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Role */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Shield className="w-3 h-3 text-blue-600" /> Access Tier
                </label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="STAFF">STAFF</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Input Avatar URL */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <ImageIcon className="w-3 h-3 text-blue-600" /> Image Source
                </label>
                <input
                  type="text"
                  value={formData.avatar_url}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar_url: e.target.value })
                  }
                  className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-500 text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <hr className="border-slate-100 my-4" />

            {/* Action Button */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={updating}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {updating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5 group-hover:scale-125 transition-transform" />
                )}
                Commit Changes
              </button>

              <Link
                href="/dashboard/admin/profiles"
                className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[25px] font-black uppercase tracking-[0.2em] text-xs text-center hover:bg-red-50 hover:text-red-600 transition-all"
              >
                Discard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
