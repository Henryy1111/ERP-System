"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import {
  ArrowLeft,
  Save,
  Loader2,
  Layers,
  AlignLeft,
  History,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  async function fetchCategory() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setFormData({
        name: data.name || "",
        description: data.description || "",
      });
    } catch (error) {
      console.error("Error:", error);
      router.push("/dashboard/admin/categories");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("categories")
        .update({
          name: formData.name,
          description: formData.description,
        })
        .eq("id", params.id);

      if (error) throw error;

      router.push("/dashboard/admin/categories");
      router.refresh();
    } catch (error) {
      alert("Gagal mengupdate kategori");
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
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin/categories"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Cancel Changes
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Edit <span className="text-blue-600 italic">Data.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg italic">
            ID: #{params?.id?.toString().substring(0, 8)}...
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT SIDE - CONTEXT CARD */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 blur-[50px] -ml-16 -mb-16 rounded-full" />

            <div className="relative z-10 space-y-5">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <History className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight uppercase tracking-tight">
                  Modify Asset.
                </h3>
                <p className="text-slate-400 text-[11px] mt-2 leading-relaxed">
                  Perubahan pada nama kategori akan langsung berdampak pada
                  semua relasi data di sistem.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[30px] flex items-start gap-4">
            <Info className="w-5 h-5 text-emerald-600 mt-1 shrink-0" />
            <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
              Pastikan deskripsi tetap relevan dengan klasifikasi produk yang
              ada.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - EDIT FORM */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleUpdate}
            className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-8"
          >
            {/* Input Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> Category
                Designation
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:shadow-inner transition-all font-bold text-slate-800 text-lg uppercase tracking-tight"
                placeholder="Category Name..."
              />
            </div>

            {/* Input Description */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <AlignLeft className="w-3.5 h-3.5 text-blue-600" /> Reference
                Detail
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-8 py-6 bg-slate-50 border-none rounded-[30px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-600 text-sm resize-none"
                placeholder="Describe this category..."
              />
            </div>

            <hr className="border-slate-100 my-4" />

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={updating}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {updating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                Update Category
              </button>

              <Link
                href="/dashboard/admin/categories"
                className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] text-center hover:bg-red-50 hover:text-red-600 transition-all"
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
