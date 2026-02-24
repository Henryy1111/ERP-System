"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  Boxes,
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
  Warehouse,
  Package,
  Clock,
  Image as ImageIcon,
} from "lucide-react";

interface InventoryData {
  id: string;
  product_id: string;
  warehouse_id: string;
  quantity: number;
  last_updated: string;
  products?: {
    name: string;
    sku: string;
    unit: string;
    image_url: string; // Menarik data image_url dari tabel products
  };
  warehouses?: { name: string };
}

export default function ManagerInventory() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryData[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // UI State (Tema Ungu)
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

  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    // Jalankan semua fetch secara paralel agar cepat
    await Promise.all([fetchInventory(), fetchProducts(), fetchWarehouses()]);
    setLoading(false);
  }

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  async function fetchInventory() {
    // Perbaikan Query: Memastikan image_url ditarik dari relasi products
    const { data, error } = await supabase
      .from("inventory")
      .select(
        `
        *,
        products (
          name,
          sku,
          unit,
          image_url
        ),
        warehouses (
          name
        )
      `,
      )
      .order("last_updated", { ascending: false });

    if (!error) {
      setInventory(data || []);
    } else {
      console.error("Fetch Error:", error);
      showToast("Failed to fetch inventory data", "error");
    }
  }

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("id, name");
    if (data) setProducts(data);
  }

  async function fetchWarehouses() {
    const { data } = await supabase.from("warehouses").select("id, name");
    if (data) setWarehouses(data);
  }

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ product_id: "", warehouse_id: "", quantity: 0 });
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (i: InventoryData) => {
    setEditingId(i.id);
    setFormData({
      product_id: i.product_id,
      warehouse_id: i.warehouse_id,
      quantity: i.quantity,
    });
    setIsPanelOpen(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = { ...formData, last_updated: new Date().toISOString() };

      if (editingId) {
        const { error } = await supabase
          .from("inventory")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        showToast("Stock level updated");
      } else {
        const { error } = await supabase.from("inventory").insert([payload]);
        if (error) throw error;
        showToast("New stock entry added");
      }
      setIsPanelOpen(false);
      fetchInventory();
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
        .from("inventory")
        .delete()
        .eq("id", deleteConfirm.id);
      if (error) throw error;
      showToast("Inventory record removed");
      fetchInventory();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  }

  const filteredInventory = inventory.filter(
    (i) =>
      i.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.warehouses?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#faf8ff] font-sans antialiased text-slate-900 pb-20">
      {/* --- TOAST & DELETE MODAL --- */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-4 animate-in slide-in-from-right-full bg-white ${toast.type === "success" ? "border-violet-500 text-violet-800" : "border-rose-500 text-rose-800"}`}
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
                  Remove Entry?
                </h3>
              </div>
              <p className="text-slate-600 text-sm">
                Deleting this will remove the stock record for this product in
                this specific warehouse. Are you sure?
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
                className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 text-[11px] uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SIDE PANEL --- */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-[100] backdrop-blur-[2px]"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl z-[101] transition-transform duration-500 ease-in-out ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-violet-600 text-white shadow-lg">
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {editingId ? "Update Stock" : "New Inventory Entry"}
              </h2>
              <p className="text-violet-100 text-[10px] uppercase font-bold tracking-[0.2em]">
                Warehouse Distribution
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
            className="p-8 space-y-8 flex-1 bg-slate-50/20 overflow-y-auto"
          >
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Select Product
              </label>
              <select
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-medium"
                value={formData.product_id}
                onChange={(e) =>
                  setFormData({ ...formData, product_id: e.target.value })
                }
              >
                <option value="">Choose item...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Warehouse Location
              </label>
              <select
                required
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all font-medium"
                value={formData.warehouse_id}
                onChange={(e) =>
                  setFormData({ ...formData, warehouse_id: e.target.value })
                }
              >
                <option value="">Choose warehouse...</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Physical Quantity
              </label>
              <div className="relative group">
                <input
                  type="number"
                  required
                  className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-violet-500 outline-none transition-all font-black text-3xl text-violet-600 shadow-inner"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-black uppercase text-xs">
                  Units
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Verify physical stock before saving changes.
              </p>
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
              className="flex-[2] bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Check size={16} /> Save Inventory
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- HEADER --- */}
      <div className="max-w-[1600px] mx-auto px-8 pt-10 pb-4">
        <button
          onClick={() => router.push("/dashboard/manager")}
          className="group flex items-center gap-2 text-slate-400 hover:text-violet-600 transition-colors mb-4 ml-1"
        >
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-violet-200 group-hover:bg-violet-50 transition-all shadow-sm">
            <ChevronLeft size={16} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Back to Dashboard
          </span>
        </button>

        <div className="bg-white border border-slate-200 shadow-xl shadow-violet-900/5 rounded-2xl">
          <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-600 rounded-xl text-white shadow-lg shadow-violet-100">
                <Boxes size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  Inventory Stock
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">
                  Live Stock & Warehouse Monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:auto">
              <div className="relative flex-1 md:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by product or warehouse..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 outline-none transition-all font-medium"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleOpenAdd}
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-violet-100 transition-all uppercase text-[11px] tracking-widest active:scale-95"
              >
                <Plus size={16} /> Add Stock
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="max-w-[1600px] mx-auto px-8 pb-10">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">
              Auditing Inventory...
            </span>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/30 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-violet-600">
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center border-r border-violet-500/50">
                      Product Item
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center border-r border-violet-500/50">
                      Warehouse Location
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center border-r border-violet-500/50">
                      Total Stock
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center border-r border-violet-500/50">
                      Last Modified
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-white uppercase tracking-[0.15em] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-violet-50/40 transition-colors group"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          {/* GAMBAR PRODUK DENGAN LOGIKA RENDER */}
                          <div className="h-14 w-14 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm transition-all group-hover:border-violet-300">
                            {inv.products?.image_url ? (
                              <img
                                src={inv.products.image_url}
                                alt={inv.products.name}
                                className="object-cover h-full w-full"
                                onError={(e) => {
                                  // Fallback jika link gambar bermasalah
                                  (e.currentTarget as HTMLImageElement).src =
                                    "https://placehold.co/100x100?text=No+Img";
                                }}
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-1">
                                <ImageIcon
                                  className="text-slate-300"
                                  size={18}
                                />
                                <span className="text-[7px] text-slate-300 font-bold uppercase">
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-slate-800 text-sm leading-tight">
                              {inv.products?.name || "Unknown Product"}
                            </p>
                            <p className="text-[10px] font-mono text-violet-600 font-bold tracking-tighter uppercase mt-1">
                              SKU: {inv.products?.sku || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                          <Warehouse size={14} className="text-violet-500" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                            {inv.warehouses?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div
                          className={`inline-block px-4 py-2 rounded-xl border-2 font-black text-sm shadow-sm ${inv.quantity > 0 ? "bg-violet-50 border-violet-100 text-violet-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}
                        >
                          {inv.quantity.toLocaleString()}{" "}
                          <span className="text-[9px] font-normal uppercase ml-1 opacity-50 tracking-widest">
                            {inv.products?.unit}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Clock size={12} className="text-slate-300" />
                            {new Date(inv.last_updated).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">
                            {new Date(inv.last_updated).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(inv)}
                            className="p-3 bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white rounded-xl transition-all shadow-sm border border-violet-100 active:scale-90"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ show: true, id: inv.id })
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
            {filteredInventory.length === 0 && (
              <div className="p-24 text-center">
                <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                  <Boxes size={32} className="text-slate-200" />
                </div>
                <p className="font-bold text-slate-300 uppercase tracking-[0.4em] text-[10px]">
                  No Inventory Data Found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
