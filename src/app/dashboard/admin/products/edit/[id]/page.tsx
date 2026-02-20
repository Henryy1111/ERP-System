"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import {
  ArrowLeft,
  Package,
  Loader2,
  Tag,
  Truck,
  Layers,
  Save,
  Image as ImageIcon,
  DollarSign,
  Boxes,
  Info,
  History,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    supplier_id: "",
    purchase_price: 0,
    selling_price: 0,
    min_stock: 0,
    unit: "",
    image_url: "",
  });

  const [metaData, setMetaData] = useState({
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, [params.id]);

  async function fetchInitialData() {
    try {
      setLoading(true);

      // 1. Fetch Categories & Suppliers untuk Dropdown
      const [catRes, supRes] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("suppliers").select("id, name").order("name"),
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (supRes.data) setSuppliers(supRes.data);

      // 2. Fetch Data Produk yang mau diedit
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      setFormData({
        sku: data.sku || "",
        name: data.name || "",
        description: data.description || "",
        category_id: data.category_id || "",
        supplier_id: data.supplier_id || "",
        purchase_price: data.purchase_price || 0,
        selling_price: data.selling_price || 0,
        min_stock: data.min_stock || 0,
        unit: data.unit || "PCS",
        image_url: data.image_url || "",
      });

      setMetaData({
        created_at: data.created_at,
        updated_at: data.updated_at,
      });
    } catch (error) {
      console.error("Error:", error);
      router.push("/dashboard/admin/products");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const { error } = await supabase
        .from("products")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id);

      if (error) throw error;

      router.push("/dashboard/admin/products");
      router.refresh();
    } catch (error) {
      alert("Gagal memperbarui produk");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
          Synchronizing Asset Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin/products"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Discard Changes
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Edit{" "}
            <span className="text-blue-600 italic font-serif">Product.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Modifikasi aset:{" "}
            <span className="text-slate-900 font-bold italic underline decoration-blue-500 underline-offset-4">
              {formData.name}
            </span>
          </p>
        </div>
      </div>

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* LEFT SIDE - PREVIEW & LOGS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 blur-[50px] -ml-16 -mb-16 rounded-full" />
            <div className="relative z-10 space-y-6">
              <div className="w-full aspect-square bg-white rounded-[30px] flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-inner">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    className="w-full h-full object-contain p-4"
                    alt="Preview"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-700" />
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> System Verified
                </div>
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-tighter font-bold text-slate-500">
                    <span>Created At</span>
                    <span className="text-slate-300">
                      {new Date(metaData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-tighter font-bold text-slate-500">
                    <span>Last Update</span>
                    <span className="text-blue-400">
                      {new Date(metaData.updated_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 border border-slate-200 rounded-[40px] flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">
                Audit Trail
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Perubahan pada harga beli akan mempengaruhi kalkulasi valuasi
                stok secara otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM SECTIONS (Sama Persis dengan Create) */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 1: IDENTITY */}
          <div className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
                01
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                Identity Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Zap className="w-3.5 h-3.5 text-blue-600" /> SKU
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sku: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-800"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Package className="w-3.5 h-3.5 text-blue-600" /> Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-800 uppercase"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <Info className="w-3.5 h-3.5 text-blue-600" /> Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-600 text-sm resize-none"
              />
            </div>
          </div>

          {/* SECTION 2: SUPPLY CHAIN */}
          <div className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
                02
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                Supply Chain
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> Category
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-700"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Truck className="w-3.5 h-3.5 text-blue-600" /> Supplier
                </label>
                <select
                  required
                  value={formData.supplier_id}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_id: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-700"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Image URL
                (HTTPS Only)
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-500 text-sm"
              />
            </div>
          </div>

          {/* SECTION 3: PRICING */}
          <div className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
                03
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                Financial Assets
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />{" "}
                  Purchase Price (IDR)
                </label>
                <input
                  type="number"
                  required
                  value={formData.purchase_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      purchase_price: Number(e.target.value),
                    })
                  }
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-bold text-slate-800"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Tag className="w-3.5 h-3.5 text-blue-600" /> Selling Price
                  (IDR)
                </label>
                <input
                  type="number"
                  required
                  value={formData.selling_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      selling_price: Number(e.target.value),
                    })
                  }
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Boxes className="w-3.5 h-3.5 text-blue-600" /> Minimum Stock
                  Limit
                </label>
                <input
                  type="number"
                  required
                  value={formData.min_stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_stock: Number(e.target.value),
                    })
                  }
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-800"
                />
              </div>
              <div className="md:col-span-1 space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Unit
                </label>
                <input
                  type="text"
                  required
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unit: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-800 text-center"
                />
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
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
                Save Changes
              </button>
              <Link
                href="/dashboard/admin/products"
                className="w-full sm:flex-1 py-5 bg-slate-100 text-slate-500 rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] text-center hover:bg-red-50 hover:text-red-600 transition-all"
              >
                Discard
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
