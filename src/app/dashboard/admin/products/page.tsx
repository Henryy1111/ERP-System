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
  Plus,
  Hash,
  Package,
  Tag,
  Truck,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      // Kita join dengan categories dan suppliers supaya tampil nama, bukan cuma ID
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          categories(name),
          suppliers(name)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  const triggerDelete = (id: string, name: string) => {
    setSelectedProduct({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct.id);
      if (error) throw error;

      fetchProducts();
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert("Gagal menghapus produk");
    } finally {
      setDeleting(false);
      setSelectedProduct(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
          Loading Products...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER SECTION - Sama Persis dengan Suppliers */}
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
            href="/dashboard/admin/products/create"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Master <span className="text-blue-600 italic">Products</span>{" "}
              <Package className="text-slate-300" />
            </h1>
            <p className="text-slate-500 font-medium">
              Manajemen aset produk, penetapan harga, dan kontrol stok.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search SKU or name..."
                className="pl-11 pr-5 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full md:w-72 transition-all font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchProducts}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE CARD - Konsistensi 40px rounded */}
      <div className="bg-slate-50 rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Product Info
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Category & Partner
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Pricing (IDR)
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Inventory
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-center w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-white transition-all duration-200"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:border-blue-200 transition-all">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
                            {item.sku}
                          </span>
                        </div>
                        <p className="font-black text-slate-800 text-base tracking-tight uppercase group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-600 text-[11px] font-bold uppercase tracking-wide">
                        <Layers className="w-3.5 h-3.5 text-blue-500" />{" "}
                        {item.categories?.name || "Uncategorized"}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium italic">
                        <Truck className="w-3.5 h-3.5 text-slate-300" />{" "}
                        {item.suppliers?.name || "No Supplier"}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Selling Price
                      </p>
                      <p className="font-bold text-slate-900">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(item.selling_price)}
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium italic">
                        Buy: {item.purchase_price.toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900 tracking-tighter">
                          {item.min_stock}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {item.unit}
                        </span>
                      </div>
                      <div className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded-md w-fit">
                        Min. Stock Alert
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <Link
                        href={`/dashboard/admin/products/edit/${item.id}`}
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

      {/* CUSTOM DELETE MODAL - Identik dengan Suppliers */}
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
                  Remove Product?
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed px-4">
                  Produk{" "}
                  <span className="text-red-600 font-bold uppercase italic">
                    {selectedProduct?.name}
                  </span>{" "}
                  akan dihapus permanen dari inventaris.
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
                    "Confirm Deletion"
                  )}
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleting}
                  className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
