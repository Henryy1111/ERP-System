"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import {
  ArrowLeft,
  Package,
  Loader2,
  Tag,
  Truck,
  Layers,
  PlusCircle,
  Image as ImageIcon,
  DollarSign,
  Boxes,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    unit: "PCS",
    image_url: "",
  });

  useEffect(() => {
    fetchRequirements();
  }, []);

  async function fetchRequirements() {
    const [catRes, supRes] = await Promise.all([
      supabase.from("categories").select("id, name").order("name"),
      supabase.from("suppliers").select("id, name").order("name"),
    ]);
    if (catRes.data) setCategories(catRes.data);
    if (supRes.data) setSuppliers(supRes.data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.from("products").insert([formData]);

      if (error) throw error;
      router.push("/dashboard/admin/products");
      router.refresh();
    } catch (error) {
      alert("Gagal menambahkan produk");
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
          href="/dashboard/admin/products"
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all w-fit group"
        >
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Inventory Master
          </span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Create{" "}
            <span className="text-blue-600 italic font-serif">Product.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Input asat baru ke dalam database inventaris global.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* LEFT SIDE - ASSET PREVIEW & STATUS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -mr-16 -mt-16 rounded-full" />
            <div className="relative z-10 space-y-6">
              <div className="w-full aspect-square bg-white/5 rounded-[30px] border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-slate-700 mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      No Image Link
                    </p>
                  </>
                )}
              </div>
              <div>
                <h3 className="font-black text-xl leading-tight tracking-tight uppercase italic">
                  Asset Specs.
                </h3>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed font-medium">
                  Pastikan SKU unik untuk setiap varian produk agar tidak
                  terjadi konflik data pada sistem gudang.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-blue-50 border border-blue-100 rounded-[40px] space-y-4">
            <div className="flex items-center gap-3 text-blue-700">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Inventory Policy
              </span>
            </div>
            <p className="text-[11px] text-blue-600/80 leading-relaxed font-bold italic">
              Sistem akan memberikan notifikasi otomatis jika stok berada di
              bawah nilai "Min Stock".
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - MULTI-SECTION FORM */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 1: BASIC INFO */}
          <div className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
                01
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <Zap className="w-3.5 h-3.5 text-blue-600" /> SKU Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="PROD-001"
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
                  placeholder="NAMA PRODUK LENGKAP"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-800 uppercase tracking-tight"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                <Info className="w-3.5 h-3.5 text-blue-600" /> Full Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-8 py-5 bg-slate-50 border-none rounded-[25px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-600 text-sm resize-none"
                placeholder="Detail spesifikasi produk..."
              />
            </div>
          </div>

          {/* SECTION 2: RELATIONS & LOGISTICS */}
          <div className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
                02
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                Connections & Media
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
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-700 appearance-none"
                >
                  <option value="">Select Category</option>
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
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold text-slate-700 appearance-none"
                >
                  <option value="">Select Supplier</option>
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
                (Public Link)
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-medium text-slate-500 text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* SECTION 3: PRICING & STOCK */}
          <div className="bg-white border border-slate-200 rounded-[45px] p-10 shadow-xl shadow-slate-200/50 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
                03
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                Financials & Stock
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />{" "}
                  Purchase Price
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
                  Level
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
                  placeholder="PCS"
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
                disabled={loading}
                className="w-full sm:flex-[2] py-5 bg-blue-600 text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                )}
                Archive Product
              </button>
              <Link
                href="/dashboard/admin/products"
                className="w-full sm:flex-1 py-5 bg-slate-100 text-slate-500 rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] text-center hover:bg-red-50 hover:text-red-600 transition-all"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
