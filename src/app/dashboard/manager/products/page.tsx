"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  Package,
  Plus,
  Search,
  Loader2,
  Edit3,
  X,
  Check,
  Calendar,
  Trash2,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  ChevronLeft,
  Tag,
  Truck,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Archive,
} from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category_id: string;
  supplier_id: string;
  purchase_price: number;
  selling_price: number;
  min_stock: number;
  unit: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  categories?: { name: string };
  suppliers?: { name: string };
}

export default function ManagerProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // UI State (Sesuai Warehouse)
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id: string | null;
  }>({ show: false, id: null });
  const [toast, setToast] = useState({
    show: false,
    msg: "",
    type: "success" as "success" | "error",
  });

  // Form Data (Semua kolom tabel kamu)
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

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchCategories(), fetchSuppliers()]);
    setLoading(false);
  }

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name), suppliers(name)")
      .order("created_at", { ascending: false });
    if (!error) setProducts(data || []);
  }

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("id, name");
    if (data) setCategories(data);
  }

  async function fetchSuppliers() {
    const { data } = await supabase.from("suppliers").select("id, name");
    if (data) setSuppliers(data);
  }

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
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
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      sku: p.sku,
      name: p.name,
      description: p.description,
      category_id: p.category_id,
      supplier_id: p.supplier_id,
      purchase_price: p.purchase_price,
      selling_price: p.selling_price,
      min_stock: p.min_stock,
      unit: p.unit,
      image_url: p.image_url,
    });
    setIsPanelOpen(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        showToast("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([formData]);
        if (error) throw error;
        showToast("New product added to inventory");
      }
      setIsPanelOpen(false);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteConfirm.id) return;
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteConfirm.id);
      if (error) throw error;
      showToast("Product deleted");
      fetchProducts();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#fcfaf2] font-sans antialiased text-slate-900">
      {/* --- TOAST & DELETE MODAL (Sama persis Warehouse) --- */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-4 animate-in slide-in-from-right-full bg-white ${toast.type === "success" ? "border-amber-500 text-amber-800" : "border-rose-500 text-rose-800"}`}
        >
          {toast.type === "success" ? (
            <ShieldCheck size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-semibold">{toast.msg}</span>
        </div>
      )}

      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Delete Product?
                </h3>
              </div>
              <p className="text-slate-600 text-sm">
                Action cannot be undone. This product will be permanently
                removed from the master data.
              </p>
            </div>
            <div className="bg-slate-50 p-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="px-4 py-2 text-slate-400 font-bold hover:text-slate-600 uppercase text-[11px]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 text-[11px] uppercase"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SIDE PANEL (Sama persis Warehouse tapi Form Produk) --- */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-[100] backdrop-blur-[2px]"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[580px] bg-white shadow-2xl z-[101] transition-transform duration-500 ease-in-out ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-amber-600 text-white">
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {editingId ? "Edit Product" : "New Inventory Item"}
              </h2>
              <p className="text-amber-100 text-[10px] uppercase font-bold tracking-widest">
                Master Product Form
              </p>
            </div>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6 flex-1 overflow-y-auto bg-slate-50/30"
          >
            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] border-b border-amber-100 pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    SKU / Barcode
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all font-mono"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    placeholder="e.g. PROD-001"
                  />
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Product Name
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all font-bold"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Item name..."
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Description
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all resize-none text-sm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief details about the product..."
                />
              </div>
            </div>

            {/* Section 2: Relasi & Unit */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] border-b border-amber-100 pb-2">
                Category & Logistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Category
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all text-sm"
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Supplier
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all text-sm"
                    value={formData.supplier_id}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier_id: e.target.value })
                    }
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Unit Type
                  </label>
                  <input
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all text-sm"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    placeholder="e.g. Pcs, Box, Kg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Image URL
                  </label>
                  <input
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all text-sm"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Pricing & Stock */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] border-b border-amber-100 pb-2">
                Pricing & Inventory Policy
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Buy Price
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all text-sm font-bold"
                    value={formData.purchase_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchase_price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Sell Price
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all text-sm font-bold text-amber-600"
                    value={formData.selling_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        selling_price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Min Stock
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-amber-500 outline-none transition-all text-sm font-bold"
                    value={formData.min_stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_stock: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </form>

          <div className="p-6 border-t border-slate-100 bg-white flex gap-4">
            <button
              type="button"
              onClick={() => setIsPanelOpen(false)}
              className="flex-1 py-3 text-slate-400 font-bold hover:text-slate-600 uppercase text-[11px] tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Check size={16} /> {editingId ? "Update Item" : "Save Item"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- HEADER (Floating Card Style) --- */}
      <div className="max-w-[1600px] mx-auto px-8 pt-10 pb-4">
        <button
          onClick={() => router.push("/dashboard/manager")}
          className="group flex items-center gap-2 text-slate-400 hover:text-amber-600 transition-colors mb-4 ml-1"
        >
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-amber-200 group-hover:bg-amber-50 transition-all shadow-sm">
            <ChevronLeft size={16} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Back to Dashboard
          </span>
        </button>

        <div className="bg-white border border-slate-200 shadow-xl shadow-amber-900/5 rounded-2xl">
          <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500 rounded-xl text-white shadow-lg shadow-amber-100">
                <Package size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  Product Inventory
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">
                  Stock & Master Data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search SKU or name..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none transition-all font-medium"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleOpenAdd}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-100 transition-all uppercase text-[11px] tracking-widest active:scale-95"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT TABLE --- */}
      <div className="max-w-[1600px] mx-auto px-8 pb-10">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">
              Loading Products...
            </span>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/30 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-amber-500">
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center border-r border-amber-400/50">
                      Product Info
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center border-r border-amber-400/50">
                      Details & Source
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center border-r border-amber-400/50">
                      Pricing (IDR)
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center border-r border-amber-400/50">
                      Stock Policy
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-amber-50/30 transition-colors"
                    >
                      <td className="px-6 py-8">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                className="object-cover h-full w-full"
                              />
                            ) : (
                              <ImageIcon className="text-slate-300" size={24} />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-[10px] font-mono text-amber-600 font-bold mt-1 uppercase tracking-tighter">
                              SKU: {p.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <div className="inline-block text-left space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Tag size={12} className="text-amber-500" />{" "}
                            {p.categories?.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <Truck size={12} /> {p.suppliers?.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <div className="inline-block text-left text-xs">
                          <p className="text-slate-400">
                            Buy: {p.purchase_price.toLocaleString()}
                          </p>
                          <p className="font-bold text-amber-600">
                            Sell: {p.selling_price.toLocaleString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                        <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg border border-slate-200">
                          <span className="text-xs font-black text-slate-700">
                            {p.min_stock}{" "}
                            <span className="font-normal opacity-50 uppercase">
                              {p.unit}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-3 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm border border-amber-100 active:scale-90"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ show: true, id: p.id })
                            }
                            className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm border border-rose-100 active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-20 text-center uppercase font-bold text-slate-300 tracking-[0.4em] text-[10px]">
                No Products Records Found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
