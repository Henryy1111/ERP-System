"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import {
  Search,
  Loader2,
  RefreshCcw,
  ArrowLeft,
  Plus,
  Boxes,
  Package,
  Warehouse,
  History,
  AlertCircle,
  TrendingUp,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Modal Delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("inventory")
        .select(
          `
          *,
          products (name, sku, unit, image_url, min_stock),
          warehouses (name, location)
        `,
        )
        .order("last_updated", { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  }

  // Fungsi untuk eksekusi hapus
  async function handleDelete() {
    if (!selectedItem) return;
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", selectedItem.id);

      if (error) throw error;

      // Refresh data lokal
      setInventory(inventory.filter((item) => item.id !== selectedItem.id));
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      alert("Gagal menghapus data");
    } finally {
      setDeleting(false);
    }
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouses?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
          Loading Inventory Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
      {/* --- CUSTOM MODAL DELETE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => !deleting && setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl border border-slate-100 p-10 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-8 top-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  Confirm Delete
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Apakah Anda yakin ingin menghapus stok{" "}
                  <span className="text-slate-900 font-bold italic">
                    [{selectedItem?.products?.name}]
                  </span>{" "}
                  di{" "}
                  <span className="text-slate-900 font-bold">
                    {selectedItem?.warehouses?.name}
                  </span>
                  ? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-4">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Ya, Hapus Aset
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={deleting}
                  className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- END MODAL --- */}

      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/admin"
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit"
          >
            <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Back
            </span>
          </Link>

          <Link
            href="/dashboard/admin/inventory/create"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-4 h-4" /> Add Inventory
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
              Stock <span className="text-blue-600 italic">Control.</span>{" "}
              <Boxes className="text-slate-300" />
            </h1>
            <p className="text-slate-500 font-medium">
              Monitoring stok produk di setiap lokasi gudang secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search product or warehouse..."
                className="pl-11 pr-5 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full md:w-72 transition-all font-medium text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchInventory}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-slate-50 rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-center">
                  No
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Asset & SKU
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Warehouse Location
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-center">
                  In-Stock
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-right">
                  Last Sync
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInventory.map((item, index) => {
                const isLow = item.quantity <= (item.products?.min_stock || 0);
                return (
                  <tr
                    key={item.id}
                    className="group hover:bg-white transition-all duration-200"
                  >
                    <td className="px-8 py-6 text-center font-black text-slate-300 text-xs">
                      {index + 1}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                          {item.products?.image_url ? (
                            <img
                              src={item.products.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                            {item.products?.sku}
                          </p>
                          <p className="font-black text-slate-800 text-sm uppercase">
                            {item.products?.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                        <Warehouse className="w-4 h-4 text-slate-400" />
                        {item.warehouses?.name}
                      </div>
                      <p className="text-[10px] text-slate-400 italic ml-6">
                        {item.warehouses?.location}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span
                        className={`text-2xl font-black tracking-tighter ${isLow ? "text-red-500" : "text-slate-900"}`}
                      >
                        {item.quantity}
                      </span>
                      <span className="ml-1 text-[10px] font-bold text-slate-400 uppercase">
                        {item.products?.unit}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {isLow ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-xl w-fit">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Low Stock
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl w-fit">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Stable
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-slate-500 text-[11px]">
                      {new Date(item.last_updated).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/dashboard/admin/inventory/edit/${item.id}`}
                          className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
