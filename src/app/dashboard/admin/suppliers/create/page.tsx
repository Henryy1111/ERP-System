"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import {
  ArrowLeft,
  Truck,
  Loader2,
  Mail,
  Phone,
  MapPin,
  PlusCircle,
  ShieldCheck,
  UserPlus,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function CreateSupplierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { error } = await supabase.from("suppliers").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          is_active: formData.is_active,
        },
      ]);

      if (error) throw error;

      router.push("/dashboard/admin/suppliers");
      router.refresh();
    } catch (error) {
      alert("Gagal menambahkan supplier");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* HEADER SECTION - Konsisten dengan Categories & Warehouses */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin/suppliers"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Back to Partners
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            New{" "}
            <span className="text-blue-600 italic font-serif">Supplier.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Registrasi mitra pemasok baru ke dalam ekosistem rantai pasok.
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
                <Truck className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="font-black text-xl leading-tight tracking-tight uppercase">
                  Supply Chain.
                </h3>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed font-medium">
                  Informasi kontak yang akurat sangat penting untuk kelancaran
                  koordinasi pengiriman dan invoicing.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-blue-50 border border-blue-100 rounded-[40px] space-y-4">
            <div className="flex items-center gap-3 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Verification Status
              </span>
            </div>
            <p className="text-[11px] text-blue-600/80 leading-relaxed font-bold italic">
              Setiap supplier baru akan otomatis masuk ke status "Active" untuk
              memulai integrasi operasional.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-6"
          >
            {/* Input Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <UserPlus className="w-3.5 h-3.5 text-blue-600" /> Company Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:shadow-inner transition-all font-bold text-slate-800 text-lg uppercase tracking-tight"
                placeholder="CONTOH: PT. LOGISTIK JAYA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> Business Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-8 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-700"
                  placeholder="admin@company.com"
                />
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Phone className="w-3.5 h-3.5 text-blue-600" /> Contact Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-8 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-700"
                  placeholder="+62..."
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Headquarters
                Address
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-600 text-sm resize-none"
                placeholder="Alamat lengkap perusahaan..."
              />
            </div>

            {/* Status Toggle (Is Active) */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[25px] border border-slate-100">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Partner Status
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium italic">
                    Aktifkan untuk langsung memulai transaksi
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-6 h-6 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer shadow-sm"
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
                  <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                )}
                Initialize Partner
              </button>

              <Link
                href="/dashboard/admin/suppliers"
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
