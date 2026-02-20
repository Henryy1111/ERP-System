"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import {
  ArrowLeft,
  Boxes,
  Loader2,
  Package,
  Warehouse,
  PlusCircle,
  ShieldCheck,
  Zap,
  ChevronRight,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function CreateInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: 0,
  });

  useEffect(() => {
    fetchRequirements();
  }, []);

  async function fetchRequirements() {
    // Ambil data produk dan gudang secara paralel
    const [prodRes, warRes] = await Promise.all([
      supabase.from("products").select("id, name, sku").order("name"),
      supabase.from("warehouses").select("id, name").order("name"),
    ]);
    if (prodRes.data) setProducts(prodRes.data);
    if (warRes.data) setWarehouses(warRes.data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Cek duplikasi: Apakah produk ini sudah ada di gudang tersebut?
      const { data: existing } = await supabase
        .from("inventory")
        .select("id")
        .eq("product_id", formData.product_id)
        .eq("warehouse_id", formData.warehouse_id)
        .single();

      if (existing) {
        alert(
          "Ops! Produk ini sudah terdaftar di gudang ini. Silakan gunakan fitur 'Edit' di halaman utama untuk mengubah stok.",
        );
        return;
      }

      const { error } = await supabase.from("inventory").insert([
        {
          ...formData,
          last_updated: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      router.push("/dashboard/admin/inventory");
      router.refresh();
    } catch (error) {
      alert("Gagal menambahkan data stok.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin/inventory"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Inventory Control
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Initialize{" "}
            <span className="text-blue-600 italic font-serif">Stock.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Daftarkan unit produk ke lokasi penyimpanan spesifik.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* LEFT PANEL - SYSTEM STATUS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -mr-16 -mt-16 rounded-full" />
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Boxes className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="font-black text-2xl leading-tight tracking-tight uppercase italic">
                  Warehouse Integrity.
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Setiap produk hanya dapat memiliki satu entri per gudang untuk
                  menjaga akurasi data stok tunggal.
                </p>
              </div>
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Secured Ledger
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-blue-50 border border-blue-100 rounded-[40px] flex items-start gap-4 shadow-sm">
            <Info className="w-6 h-6 text-blue-600 mt-1" />
            <p className="text-[11px] text-blue-800 leading-relaxed font-bold italic uppercase tracking-wider">
              Sistem akan mencatat waktu inisialisasi secara otomatis sebagai
              'Last Updated'.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - FORM ENTRY */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[45px] p-10 md:p-12 shadow-xl shadow-slate-200/50">
            <div className="space-y-10">
              {/* Product Selection */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  <Package className="w-4 h-4 text-blue-600" /> Select Asset
                </label>
                <div className="relative group">
                  <select
                    required
                    value={formData.product_id}
                    onChange={(e) =>
                      setFormData({ ...formData, product_id: e.target.value })
                    }
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-800 appearance-none cursor-pointer text-lg"
                  >
                    <option value="">Search or choose product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        [{p.sku}] {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-all rotate-90" />
                </div>
              </div>

              {/* Warehouse Selection */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  <Warehouse className="w-4 h-4 text-blue-600" /> Storage
                  Location
                </label>
                <div className="relative group">
                  <select
                    required
                    value={formData.warehouse_id}
                    onChange={(e) =>
                      setFormData({ ...formData, warehouse_id: e.target.value })
                    }
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-800 appearance-none cursor-pointer text-lg"
                  >
                    <option value="">Select destination warehouse...</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-all rotate-90" />
                </div>
              </div>

              {/* Quantity Input */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  <Zap className="w-4 h-4 text-blue-600" /> Opening Quantity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full px-8 py-6 bg-slate-50 border-none rounded-[30px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-black text-slate-900 text-4xl tracking-tighter"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 uppercase tracking-widest text-xs">
                    Units
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-[2] py-6 bg-blue-600 text-white rounded-[30px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  )}
                  Initialize Inventory
                </button>
                <Link
                  href="/dashboard/admin/inventory"
                  className="w-full sm:flex-1 py-6 bg-slate-100 text-slate-500 rounded-[30px] font-black uppercase tracking-[0.2em] text-[10px] text-center hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
