"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import {
  ArrowLeft,
  PlusCircle,
  Loader2,
  Layers,
  AlignLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { error } = await supabase.from("categories").insert([
        {
          name: formData.name,
          description: formData.description,
        },
      ]);

      if (error) throw error;

      router.push("/dashboard/admin/categories");
      router.refresh();
    } catch (error) {
      alert("Gagal menambahkan kategori");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* NAVIGATION & HEADER */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin/categories"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Back to Categories
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            New <span className="text-blue-600 italic">Category.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Create a new classification for your system architecture.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT SIDE - DECORATIVE & INFO */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-blue-600 rounded-[40px] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] -mr-16 -mt-16 rounded-full" />

            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-black text-xl leading-tight uppercase tracking-tight">
                  Organization Is Key.
                </h3>
                <p className="text-blue-100 text-xs mt-2 font-medium leading-relaxed">
                  Gunakan nama yang singkat dan deskripsi yang jelas untuk
                  memudahkan klasifikasi data di masa depan.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-900 rounded-[40px] text-slate-400 border border-slate-800 shadow-2xl shadow-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                System Status
              </span>
            </div>
            <p className="text-[11px] font-medium leading-relaxed">
              Database ready to receive new entries. ID will be auto-generated
              by system.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-8"
          >
            {/* Input Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> Category Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:shadow-inner transition-all font-bold text-slate-800 text-lg placeholder:text-slate-300 uppercase tracking-tight"
                placeholder="e.g. ELECTRONICS..."
              />
            </div>

            {/* Input Description */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <AlignLeft className="w-3.5 h-3.5 text-blue-600" /> Description
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-8 py-6 bg-slate-50 border-none rounded-[30px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-600 text-sm placeholder:text-slate-300 resize-none"
                placeholder="Explain the purpose of this category..."
              />
            </div>

            <hr className="border-slate-100 my-4" />

            {/* Action Button */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-5 bg-blue-600 text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                )}
                Initialize Category
              </button>

              <Link
                href="/dashboard/admin/categories"
                className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] text-center hover:bg-red-50 hover:text-red-600 transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
