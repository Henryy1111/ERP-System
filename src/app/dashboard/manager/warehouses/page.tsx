"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter untuk navigasi
import { supabase } from "../../../lib/supabase";
import {
  Warehouse,
  Plus,
  Search,
  MapPin,
  Loader2,
  Edit3,
  X,
  Check,
  Calendar,
  Trash2,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  ChevronLeft, // Icon baru untuk tombol kembali
} from "lucide-react";

interface WarehouseData {
  id: string;
  name: string;
  location: string;
  created_at: string;
}

export default function ManagerWarehouses() {
  const router = useRouter(); // Inisialisasi router
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    id: string | null;
  }>({
    show: false,
    id: null,
  });

  const [toast, setToast] = useState<{
    show: boolean;
    msg: string;
    type: "success" | "error";
  }>({
    show: false,
    msg: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  async function fetchWarehouses() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("warehouses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setWarehouses(data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch warehouse data", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", location: "" });
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (w: WarehouseData) => {
    setEditingId(w.id);
    setFormData({
      name: w.name,
      location: w.location,
    });
    setIsPanelOpen(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name,
        location: formData.location,
      };

      if (editingId) {
        const { error } = await supabase
          .from("warehouses")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        showToast("Warehouse information updated successfully");
      } else {
        const { error } = await supabase.from("warehouses").insert([payload]);
        if (error) throw error;
        showToast("New warehouse registered successfully");
      }

      setIsPanelOpen(false);
      await fetchWarehouses();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteConfirm.id) return;
    try {
      const { error } = await supabase
        .from("warehouses")
        .delete()
        .eq("id", deleteConfirm.id);
      if (error) throw error;
      showToast("Warehouse has been removed from system");
      fetchWarehouses();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  }

  const filteredWarehouses = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900">
      {/* --- TOAST --- */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-4 animate-in slide-in-from-right-full ${
            toast.type === "success"
              ? "bg-white border-blue-500 text-blue-800"
              : "bg-white border-rose-500 text-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <ShieldCheck size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-semibold">{toast.msg}</span>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Delete Warehouse?
                </h3>
              </div>
              <p className="text-slate-600">
                Are you sure? Deleting this warehouse will affect inventory data
                references in the future. This action cannot be undone.
              </p>
            </div>
            <div className="bg-slate-50 p-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="px-4 py-2 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-shadow"
              >
                Delete Permanently
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
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-900 text-white">
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {editingId ? "Edit Warehouse" : "Add New Warehouse"}
              </h2>
              <p className="text-blue-300 text-xs">
                Manage asset storage infrastructure
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
            className="p-8 space-y-6 flex-1 overflow-y-auto"
          >
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Warehouse Name
                </label>
                <input
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Main Distribution Center"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Location / Address
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Full address of the warehouse facility..."
                />
              </div>
            </div>
          </form>
          <div className="p-6 border-t border-slate-100 bg-white flex gap-4">
            <button
              type="button"
              onClick={() => setIsPanelOpen(false)}
              className="flex-1 py-3 text-slate-400 font-bold hover:text-slate-600 transition-all uppercase text-[11px] tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Check size={16} />{" "}
                  {editingId ? "Update Warehouse" : "Save Warehouse"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- HEADER (Floating Card Style) --- */}
      <div className="max-w-[1600px] mx-auto px-8 pt-10 pb-4">
        {/* --- BACK BUTTON (Placed professionally above the header card) --- */}
        <button
          onClick={() => router.push("/dashboard/manager")}
          className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-4 ml-1"
        >
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-sm">
            <ChevronLeft size={16} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Back to Dashboard
          </span>
        </button>

        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 rounded-2xl">
          <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
                <Warehouse size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  Warehouse Management
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">
                  Location Infrastructure
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
                  placeholder="Search by name or location..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleOpenAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all uppercase text-[11px] tracking-widest active:scale-95"
              >
                <Plus size={16} /> Add Warehouse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-[1600px] mx-auto px-8 pb-10">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">
              Fetching Warehouse Data
            </span>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/30 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600">
                    <th className="px-6 py-5 text-[11px] font-bold text-blue-50 uppercase tracking-[0.15em] text-center border-r border-blue-500/50 w-1/3">
                      Warehouse Info
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-blue-50 uppercase tracking-[0.15em] text-center border-r border-blue-500/50 w-1/3">
                      Location / Address
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-blue-50 uppercase tracking-[0.15em] text-center w-1/3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWarehouses.map((w) => (
                    <tr
                      key={w.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-8 text-center">
                        <p className="font-bold text-slate-800 text-lg">
                          {w.name}
                        </p>
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          <Calendar size={12} className="text-blue-500" />{" "}
                          Registered:{" "}
                          {new Date(w.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex justify-center items-start gap-2 text-[14px] text-slate-500 max-w-[400px] mx-auto text-center font-medium leading-relaxed">
                          <MapPin
                            size={16}
                            className="text-blue-400 flex-shrink-0 mt-0.5"
                          />
                          <span>{w.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleOpenEdit(w)}
                            className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm border border-blue-100 active:scale-90"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ show: true, id: w.id })
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
            {filteredWarehouses.length === 0 && (
              <div className="p-20 text-center">
                <p className="font-bold text-slate-300 uppercase tracking-[0.4em] text-[10px]">
                  No warehouse records found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
