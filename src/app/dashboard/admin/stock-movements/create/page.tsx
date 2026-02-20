"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import {
  ArrowLeft,
  Activity,
  Loader2,
  Package,
  Warehouse,
  Send,
  FileInput,
  FileOutput,
  FileText,
  AlertCircle,
  CheckCircle2,
  Hash,
} from "lucide-react";
import Link from "next/link";

export default function CreateStockMovementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    type: "in",
    quantity: 0,
    reference_number: "",
    notes: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      const [prodRes, warRes] = await Promise.all([
        supabase.from("products").select("id, name, sku").order("name"),
        supabase.from("warehouses").select("id, name").order("name"),
      ]);
      if (prodRes.data) setProducts(prodRes.data);
      if (warRes.data) setWarehouses(warRes.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.quantity <= 0) return alert("Quantity harus lebih dari 0");

    try {
      setLoading(true);

      // 1. Dapatkan User ID yang sedang login
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User session not found");

      // 2. Simpan Transaksi ke stock_movements
      const { error: moveError } = await supabase
        .from("stock_movements")
        .insert([
          {
            product_id: formData.product_id,
            warehouse_id: formData.warehouse_id,
            user_id: user.id,
            type: formData.type,
            quantity: formData.quantity,
            reference_number: formData.reference_number,
            notes: formData.notes,
          },
        ]);

      if (moveError) throw moveError;

      // 3. Update atau Insert ke tabel Inventory (Sinkronisasi Stok)
      const { data: invData } = await supabase
        .from("inventory")
        .select("id, quantity")
        .eq("product_id", formData.product_id)
        .eq("warehouse_id", formData.warehouse_id)
        .single();

      if (invData) {
        // Jika stok sudah ada di gudang tersebut, kita kalkulasi ulang
        const newQty =
          formData.type === "in"
            ? invData.quantity + formData.quantity
            : invData.quantity - formData.quantity;

        await supabase
          .from("inventory")
          .update({ quantity: newQty, last_updated: new Date().toISOString() })
          .eq("id", invData.id);
      } else {
        // Jika stok belum ada di gudang tersebut (entry baru)
        if (formData.type === "in") {
          await supabase.from("inventory").insert([
            {
              product_id: formData.product_id,
              warehouse_id: formData.warehouse_id,
              quantity: formData.quantity,
              last_updated: new Date().toISOString(),
            },
          ]);
        } else {
          // Jika stock out tapi barang belum pernah ada di gudang
          throw new Error(
            "Gudang ini tidak memiliki stok barang tersebut untuk dikeluarkan.",
          );
        }
      }

      router.push("/dashboard/admin/stock-movements");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* HEADER */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin/stock-movements"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md transition-all text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Cancel and Return
          </span>
        </Link>

        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
            New <span className="text-blue-600 italic">Entry.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">
            Buat catatan mutasi stok baru ke dalam sistem.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* LEFT PANEL: SELECT TYPE */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
            <div className="relative z-10 space-y-8">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Activity className="w-7 h-7 text-white" />
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                  Movement Direction
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "in" })}
                    className={`flex items-center gap-4 p-6 rounded-[25px] transition-all border-2 ${formData.type === "in" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-white/5 border-transparent text-slate-500 opacity-60 hover:opacity-100"}`}
                  >
                    <FileInput className="w-6 h-6" />
                    <span className="font-black uppercase tracking-widest text-xs">
                      Stock In
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "out" })}
                    className={`flex items-center gap-4 p-6 rounded-[25px] transition-all border-2 ${formData.type === "out" ? "bg-red-500/10 border-red-500 text-red-400" : "bg-white/5 border-transparent text-slate-500 opacity-60 hover:opacity-100"}`}
                  >
                    <FileOutput className="w-6 h-6" />
                    <span className="font-black uppercase tracking-widest text-xs">
                      Stock Out
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 italic text-[11px] text-slate-400 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-blue-400 mb-2" />
              Catatan: Memilih 'Stock Out' akan mengurangi stok di inventory
              gudang yang dipilih secara otomatis.
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: FORM DETAILS */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Select */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Product Target
              </label>
              <div className="relative group">
                <select
                  required
                  value={formData.product_id}
                  onChange={(e) =>
                    setFormData({ ...formData, product_id: e.target.value })
                  }
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[20px] font-bold text-slate-800 appearance-none focus:bg-white focus:border-blue-600 transition-all outline-none"
                >
                  <option value="">Select a product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} - {p.name}
                    </option>
                  ))}
                </select>
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            {/* Warehouse Select */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Destination Warehouse
              </label>
              <div className="relative group">
                <select
                  required
                  value={formData.warehouse_id}
                  onChange={(e) =>
                    setFormData({ ...formData, warehouse_id: e.target.value })
                  }
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[20px] font-bold text-slate-800 appearance-none focus:bg-white focus:border-blue-600 transition-all outline-none"
                >
                  <option value="">Select warehouse...</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <Warehouse className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            {/* Quantity Input */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Total Quantity
              </label>
              <div className="relative group">
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="0"
                  value={formData.quantity || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[20px] font-black text-2xl text-slate-900 focus:bg-white focus:border-blue-600 transition-all outline-none"
                />
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            {/* Reference Number */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Ref Number (PO/DO)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="e.g. PO-102938"
                  value={formData.reference_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reference_number: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[20px] font-bold text-slate-800 focus:bg-white focus:border-blue-600 transition-all outline-none uppercase"
                />
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Additional Notes
              </label>
              <textarea
                rows={3}
                placeholder="Give some context for this movement..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[30px] font-medium text-slate-800 focus:bg-white focus:border-blue-600 transition-all outline-none"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-blue-600 text-white rounded-[25px] font-black uppercase tracking-[0.3em] text-xs hover:bg-slate-900 transition-all flex items-center justify-center gap-4 shadow-xl shadow-blue-200 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Execute Transaction
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
