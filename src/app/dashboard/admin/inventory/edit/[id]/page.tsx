"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import {
  ArrowLeft,
  Boxes,
  Loader2,
  Package,
  Warehouse,
  Save,
  AlertTriangle,
  History,
  TrendingUp,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";

export default function EditInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [inventoryData, setInventoryData] = useState<any>(null);
  const [newQuantity, setNewQuantity] = useState(0);

  useEffect(() => {
    fetchInventoryDetail();
  }, [params.id]);

  async function fetchInventoryDetail() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("inventory")
        .select(
          `
          *,
          products (name, sku, unit, image_url),
          warehouses (name, location)
        `,
        )
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setInventoryData(data);
      setNewQuantity(data.quantity);
    } catch (error) {
      console.error("Error:", error);
      router.push("/dashboard/admin/inventory");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("inventory")
        .update({
          quantity: newQuantity,
          last_updated: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) throw error;
      router.push("/dashboard/admin/inventory");
      router.refresh();
    } catch (error) {
      alert("Gagal memperbarui stok");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
          Accessing Vault Data...
        </p>
      </div>
    );
  }

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
            Back to Stock Control
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Adjust{" "}
            <span className="text-blue-600 italic font-serif">Stock.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Lakukan penyesuaian kuantitas aset secara presisi.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* LEFT PANEL - CURRENT ASSET STATUS */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full" />

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-3xl p-2 flex items-center justify-center overflow-hidden border-4 border-white/10">
                  {inventoryData?.products?.image_url ? (
                    <img
                      src={inventoryData.products.image_url}
                      className="w-full h-full object-contain"
                      alt=""
                    />
                  ) : (
                    <Package className="w-10 h-10 text-slate-200" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                    {inventoryData?.products?.sku}
                  </p>
                  <h3 className="text-2xl font-black leading-none uppercase tracking-tighter italic">
                    {inventoryData?.products?.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <Warehouse className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Storage Location
                    </p>
                    <p className="font-bold text-slate-200">
                      {inventoryData?.warehouses?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <History className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Last Movement
                    </p>
                    <p className="font-bold text-slate-200">
                      {new Date(inventoryData?.last_updated).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-600 rounded-3xl flex items-center justify-between shadow-xl shadow-blue-900/20">
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Original Balance
                </p>
                <p className="text-3xl font-black italic tracking-tighter">
                  {inventoryData?.quantity}{" "}
                  <span className="text-xs font-medium opacity-60 uppercase">
                    {inventoryData?.products?.unit}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-amber-50 border border-amber-100 rounded-[40px] flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 shrink-0" />
            <p className="text-[11px] text-amber-800 leading-relaxed font-bold italic uppercase tracking-wide">
              Penyesuaian stok manual harus didasari oleh bukti fisik yang valid
              (Stock Opname).
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - ADJUSTMENT FORM */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-[45px] p-10 md:p-12 shadow-xl shadow-slate-200/50 space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                  Inventory Adjustment
                </h2>
                <p className="text-xs text-slate-400 font-medium tracking-tight">
                  Update actual quantity in the system
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                Actual Physical Quantity
              </label>
              <div className="relative group">
                <input
                  type="number"
                  required
                  min="0"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="w-full px-10 py-8 bg-slate-50 border-none rounded-[35px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-black text-slate-900 text-6xl tracking-tighter"
                />
                <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    {inventoryData?.products?.unit}
                  </span>
                  <span className="text-[9px] font-medium text-slate-300 italic uppercase">
                    Verify Count
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-400 px-4">
                <Fingerprint className="w-4 h-4 text-slate-300" />
                <p className="text-[10px] font-medium uppercase tracking-widest">
                  Transaction Signature Required
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full sm:flex-[2] py-6 bg-slate-900 text-white rounded-[30px] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                >
                  {updating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                  Commit Adjustment
                </button>
                <Link
                  href="/dashboard/admin/inventory"
                  className="w-full sm:flex-1 py-6 bg-slate-100 text-slate-500 rounded-[30px] font-black uppercase tracking-[0.2em] text-[10px] text-center hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  Discard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
