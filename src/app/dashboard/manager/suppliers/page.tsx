"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Truck,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Edit3,
  X,
  Check,
  Calendar,
  Circle,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Globe,
  ShieldCheck,
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  created_at: string;
}

export default function ManagerSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
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
    email: "",
    phone: "",
    address: "",
    is_active: true,
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  async function fetchSuppliers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSuppliers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      is_active: true,
    });
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingId(s.id);
    setFormData({
      name: s.name,
      email: s.email,
      phone: s.phone,
      address: s.address,
      is_active: s.is_active,
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
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        is_active: formData.is_active,
      };

      if (editingId) {
        const { error } = await supabase
          .from("suppliers")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        showToast("Supplier data updated successfully");
      } else {
        const { error } = await supabase.from("suppliers").insert([payload]);
        if (error) throw error;
        showToast("New supplier registered successfully");
      }

      setIsPanelOpen(false);
      await fetchSuppliers();
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
        .from("suppliers")
        .delete()
        .eq("id", deleteConfirm.id);
      if (error) throw error;
      showToast("Supplier permanently removed");
      fetchSuppliers();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  }

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900">
      {/* --- TOAST --- */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-l-4 animate-in slide-in-from-right-full ${
            toast.type === "success"
              ? "bg-white border-emerald-500 text-emerald-800"
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
                  Confirm Deletion
                </h3>
              </div>
              <p className="text-slate-600">
                Are you sure you want to delete this supplier? This action is
                irreversible.
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
                Delete Supplier
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
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-900 text-white">
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {editingId ? "Modify Supplier" : "Register New Supplier"}
              </h2>
              <p className="text-emerald-300 text-xs">
                Update your global supply chain data
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
                  Company Name
                </label>
                <input
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Global Logistics Corp"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Business Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="contact@company.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Contact Number
                </label>
                <input
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+62 812..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Headquarters Address
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium resize-none"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Full company address..."
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-bold text-emerald-800 cursor-pointer"
                >
                  Supplier is currently active
                </label>
              </div>
            </div>
          </form>
          <div className="p-6 border-t border-slate-100 bg-white flex gap-4">
            <button
              type="button"
              onClick={() => setIsPanelOpen(false)}
              className="flex-1 py-3 text-slate-400 font-bold hover:text-slate-600 transition-all uppercase text-[11px] tracking-widest"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Check size={16} />{" "}
                  {editingId ? "Update Record" : "Save Supplier"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- HEADER (Floating Card Style) --- */}
      <div className="max-w-[1600px] mx-auto px-8 pt-10 pb-4">
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 rounded-2xl">
          <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand Section */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-200">
                <Globe size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  Global Suppliers
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">
                  Management Console
                </p>
              </div>
            </div>

            {/* Control Section */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search records..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleOpenAdd}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all uppercase text-[11px] tracking-widest active:scale-95"
              >
                <Plus size={16} /> New Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-[1600px] mx-auto px-8 py-10">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">
              Synchronizing Records
            </span>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/30 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-emerald-600">
                    <th className="px-6 py-5 text-[11px] font-bold text-emerald-50 uppercase tracking-[0.15em] text-center border-r border-emerald-500/50">
                      Company Info
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-emerald-50 uppercase tracking-[0.15em] text-center border-r border-emerald-500/50">
                      Contact Details
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-emerald-50 uppercase tracking-[0.15em] text-center border-r border-emerald-500/50">
                      Headquarters
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-emerald-50 uppercase tracking-[0.15em] text-center border-r border-emerald-500/50">
                      Status
                    </th>
                    <th className="px-6 py-5 text-[11px] font-bold text-emerald-50 uppercase tracking-[0.15em] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuppliers.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-7 text-center">
                        <p className="font-bold text-slate-800 text-base">
                          {s.name}
                        </p>
                        <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          <Calendar size={12} className="text-emerald-500" />{" "}
                          Since {new Date(s.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-7">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-2 text-[13px] text-slate-600 font-semibold px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                            <Mail size={13} className="text-emerald-500" />{" "}
                            {s.email}
                          </div>
                          <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                            <Phone size={13} className="text-slate-400" />{" "}
                            {s.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-7">
                        <div className="flex justify-center items-start gap-2 text-[13px] text-slate-500 max-w-[250px] mx-auto text-center font-medium leading-relaxed">
                          <MapPin
                            size={15}
                            className="text-rose-400 flex-shrink-0 mt-0.5"
                          />
                          <span>{s.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-7">
                        <div className="flex justify-center">
                          <span
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest border shadow-sm ${
                              s.is_active
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-slate-50 border-slate-200 text-slate-400"
                            }`}
                          >
                            {s.is_active ? "● ACTIVE" : "○ INACTIVE"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-7">
                        <div className="flex justify-center gap-2.5">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100 active:scale-90"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ show: true, id: s.id })
                            }
                            className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm border border-rose-100 active:scale-90"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredSuppliers.length === 0 && (
              <div className="p-20 text-center">
                <p className="font-bold text-slate-300 uppercase tracking-[0.4em] text-[10px]">
                  Registry Empty
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
