"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  Layers,
  Plus,
  Search,
  Edit3,
  Trash2,
  ChevronLeft,
  Loader2,
  Check,
  X,
  AlertCircle,
  Tag,
  Info,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function ManagerCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form & Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("categories")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([formData]);
        if (error) throw error;
      }
      setIsPanelOpen(false);
      fetchCategories();
    } catch (err) {
      alert("Error saving category");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900 pb-20">
      <div className="max-w-5xl mx-auto px-8 pt-10">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/dashboard/manager")}
          className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-6"
        >
          <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all shadow-sm">
            <ChevronLeft size={16} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Back to Dashboard
          </span>
        </button>

        {/* HEADER CARD */}
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 rounded-2xl mb-8">
          <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                <Layers size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Product Categories
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                  Organize your inventory
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Find category..."
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", description: "" });
                  setIsPanelOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all text-[11px] uppercase tracking-widest"
              >
                <Plus size={16} /> Add New
              </button>
            </div>
          </div>
        </div>

        {/* LIST / TABLE */}
        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-300 transition-all group shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Tag size={18} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(cat.id);
                        setFormData({
                          name: cat.name,
                          description: cat.description,
                        });
                        setIsPanelOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">
                  {cat.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {cat.description || "No description provided."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL / PANEL SIMPEL */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-50 bg-indigo-600 text-white flex justify-between items-center">
              <h2 className="font-bold uppercase text-xs tracking-widest">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button onClick={() => setIsPanelOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Category Name
                </label>
                <input
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <button
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] shadow-lg shadow-indigo-100 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Check size={16} /> Save Category
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
