"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import {
  ArrowLeft,
  Truck,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Save,
  History,
  ShieldCheck,
  Activity,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function EditSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    is_active: true,
  });
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    fetchSupplier();
  }, [params.id]);

  async function fetchSupplier() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        is_active: data.is_active ?? true,
      });
      setCreatedAt(data.created_at);
    } catch (error) {
      console.error("Error fetching supplier:", error);
      router.push("/dashboard/admin/suppliers");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("suppliers")
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          is_active: formData.is_active,
        })
        .eq("id", params.id);

      if (error) throw error;

      router.push("/dashboard/admin/suppliers");
      router.refresh();
    } catch (error) {
      alert("Gagal memperbarui data supplier");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-full" />
        </div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Syncing Partner Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin/suppliers"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Discard Changes
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Update{" "}
            <span className="text-blue-600 italic font-serif">Partner.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Modifikasi kredensial untuk{" "}
            <span className="text-slate-900 font-bold underline decoration-blue-500 decoration-2 italic">
              #{params.id?.toString().substring(0, 8)}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT SIDE - PARTNER STATUS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-[50px] -ml-16 -mb-16 rounded-full" />

            <div className="relative z-10 space-y-5">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <History className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight tracking-tight uppercase">
                  Registry Info.
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-black">
                      Contract Since
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {createdAt
                        ? new Date(createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${formData.is_active ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${formData.is_active ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {formData.is_active
                        ? "Active Partner"
                        : "Suspended Partner"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border border-slate-200 rounded-[40px] space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Compliance
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
              Pastikan nomor telepon dan email aktif untuk menghindari kegagalan
              sinkronisasi pesanan pembelian.
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
                <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Company Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:shadow-inner transition-all font-bold text-slate-800 text-lg uppercase tracking-tight"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                />
              </div>

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
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Operational
                Address
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-8 py-6 bg-slate-50 border-none rounded-[30px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-600 text-sm resize-none"
              />
            </div>

            {/* Status Toggle */}
            <div
              className={`flex items-center justify-between p-6 rounded-[25px] border transition-all ${formData.is_active ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}
            >
              <div className="flex items-center gap-3">
                <Activity
                  className={`w-5 h-5 ${formData.is_active ? "text-emerald-500" : "text-red-500"}`}
                />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Partner Status
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium italic">
                    Status saat ini:{" "}
                    {formData.is_active ? "Aktif" : "Non-Aktif"}
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
                disabled={updating}
                className="w-full sm:flex-[2] py-5 bg-slate-900 text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {updating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
                Commit Updates
              </button>

              <Link
                href="/dashboard/admin/suppliers"
                className="w-full sm:flex-1 py-5 bg-slate-100 text-slate-500 rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] text-center hover:bg-red-50 hover:text-red-600 transition-all"
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
