"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import {
  ArrowLeft,
  Building2,
  Loader2,
  MapPin,
  PlusCircle,
  Globe2,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function CreateWarehousePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { error } = await supabase.from("warehouses").insert([
        {
          name: formData.name,
          location: formData.location,
        },
      ]);

      if (error) throw error;

      router.push("/dashboard/admin/warehouses");
      router.refresh();
    } catch (error) {
      alert("Gagal menambahkan unit gudang");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin/warehouses"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Back
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            New{" "}
            <span className="text-blue-600 italic font-serif">Facility.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Registrasi unit penyimpanan dan titik distribusi strategis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT SIDE - DECORATIVE INFO */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -mr-16 -mt-16 rounded-full" />

            <div className="relative z-10 space-y-5">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <Globe2 className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="font-black text-xl leading-tight tracking-tight uppercase">
                  Global Asset.
                </h3>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed font-medium">
                  Setiap gudang yang didaftarkan akan menjadi bagian dari
                  jaringan suplai sistem secara otomatis.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-blue-50 border border-blue-100 rounded-[40px] space-y-4">
            <div className="flex items-center gap-3 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Security Protocol
              </span>
            </div>
            <p className="text-[11px] text-blue-600/80 leading-relaxed font-bold italic">
              Pastikan alamat lokasi mencakup koordinat atau detail gedung yang
              spesifik untuk akurasi inventaris.
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
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Warehouse
                Designation
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:shadow-inner transition-all font-bold text-slate-800 text-lg uppercase tracking-tight placeholder:text-slate-300"
                placeholder="CONTOH: GUDANG UTAMA JAKARTA"
              />
            </div>

            {/* Input Location */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Physical
                Address
              </label>
              <textarea
                required
                rows={3}
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-8 py-6 bg-slate-50 border-none rounded-[30px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-600 text-sm resize-none placeholder:text-slate-300"
                placeholder="Jl. Logistik No. 45, Kawasan Industri..."
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-[2] py-5 bg-blue-600 text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                Deploy Facility
              </button>

              <Link
                href="/dashboard/admin/warehouses"
                className="w-full sm:flex-1 py-5 bg-slate-100 text-slate-500 rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] text-center hover:bg-red-50 hover:text-red-600 transition-all"
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
