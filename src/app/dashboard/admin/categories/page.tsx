"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import {
  Search,
  Loader2,
  RefreshCcw,
  Edit3,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  Layers,
  Plus,
  Hash,
} from "lucide-react";

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  const triggerDelete = (id: string, name: string) => {
    setSelectedCategory({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", selectedCategory.id);
      if (error) throw error;

      fetchCategories();
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert("Gagal menghapus kategori");
    } finally {
      setDeleting(false);
      setSelectedCategory(null);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
          Loading Categories...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
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
            <span className="text-sm font-bold uppercase tracking-widest">
              Back
            </span>
          </Link>

          <Link
            href="/dashboard/admin/categories/create"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-4 h-4" /> Add New Category
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Data <span className="text-blue-600 italic">Categories</span>{" "}
              <Layers className="text-slate-300" />
            </h1>
            <p className="text-slate-500 font-medium">
              Klasifikasi produk dan pengarsipan sistem.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search category name..."
                className="pl-11 pr-5 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full md:w-72 transition-all font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchCategories}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES TABLE CARD */}
      <div className="bg-slate-50 rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 w-24">
                  ID
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Category Name
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Description
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-center w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCategories.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-white transition-all duration-200"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 font-bold bg-white px-3 py-1 rounded-lg border border-slate-100 w-fit">
                      <Hash className="w-3 h-3 text-blue-400" />{" "}
                      {item.id.toString().substring(0, 5)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 text-lg tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                      {item.name}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-slate-500 text-sm font-medium line-clamp-1 italic max-w-md">
                      {item.description || "No description provided."}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <Link
                        href={`/dashboard/admin/categories/edit/${item.id}`}
                        className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <Edit3 className="w-5 h-5" />
                      </Link>

                      <button
                        onClick={() => triggerDelete(item.id, item.name)}
                        className="p-2.5 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOM DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => !deleting && setIsDeleteModalOpen(false)}
          />
          <div className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Hapus Kategori?
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed px-4">
                  Menghapus kategori{" "}
                  <span className="text-red-600 font-bold uppercase italic">
                    {selectedCategory?.name}
                  </span>{" "}
                  akan berdampak pada data terkait.
                </p>
              </div>
              <div className="flex flex-col w-full gap-3 pt-4">
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Ya, Hapus Sekarang"
                  )}
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleting}
                  className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
