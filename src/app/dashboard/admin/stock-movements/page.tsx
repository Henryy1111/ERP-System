"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import {
  Search,
  Loader2,
  RefreshCcw,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Package,
  Warehouse,
  User,
  FileText,
  Activity,
  ChevronRight,
  ClipboardList,
  Plus,
} from "lucide-react";

export default function StockMovementsPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMovements();
  }, []);

  async function fetchMovements() {
    try {
      setLoading(true);
      // Join ke products, warehouses, dan profiles (pastikan tabel profiles ada atau sesuaikan dengan tabel user kamu)
      const { data, error } = await supabase
        .from("stock_movements")
        .select(
          `
          *,
          products (name, sku, unit),
          warehouses (name),
          profiles:user_id (full_name)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMovements(data || []);
    } catch (error) {
      console.error("Error fetching movements:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredMovements = movements.filter(
    (m) =>
      m.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
          Gathering Stock Movements Logs...
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
            <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Back
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* TOMBOL ADD/CREATE */}
            <Link
              href="/dashboard/admin/stock-movements/create"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-blue-200"
            >
              <Plus className="w-4 h-4" /> Create Stock Entry
            </Link>

            <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-[11px] shadow-xl uppercase tracking-widest">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Audit Trail Active
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
              Stock <span className="text-blue-600">Movements.</span>{" "}
              <ClipboardList className="text-slate-300" />
            </h1>
            <p className="text-slate-500 font-medium italic">
              Rekam jejak mutasi barang keluar dan masuk secara sistematis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search SKU or Ref Number..."
                className="pl-11 pr-5 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full md:w-72 transition-all font-medium text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchMovements}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-[45px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Date & Time
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Reference ID
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Product
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                  Type
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                  Qty
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Warehouse
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  User
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMovements.length > 0 ? (
                filteredMovements.map((m) => (
                  <tr
                    key={m.id}
                    className="group hover:bg-slate-50/50 transition-all duration-200"
                  >
                    {/* DATE */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-white transition-colors">
                          <Calendar className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-xs">
                            {new Date(m.created_at).toLocaleDateString("id-ID")}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(m.created_at).toLocaleTimeString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* REF NUMBER */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-mono text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-1 rounded-md uppercase">
                          {m.reference_number || "NO-REF"}
                        </span>
                      </div>
                    </td>

                    {/* PRODUCT */}
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">
                          {m.products?.sku}
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          {m.products?.name}
                        </span>
                      </div>
                    </td>

                    {/* TYPE BADGE */}
                    <td className="px-8 py-6 text-center">
                      {m.type === "in" ? (
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase">
                            Stock In
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 rounded-full border border-red-100">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase">
                            Stock Out
                          </span>
                        </div>
                      )}
                    </td>

                    {/* QUANTITY */}
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span
                          className={`text-lg font-black tracking-tighter ${m.type === "in" ? "text-emerald-600" : "text-red-600"}`}
                        >
                          {m.type === "in" ? "+" : "-"}
                          {m.quantity}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          {m.products?.unit}
                        </span>
                      </div>
                    </td>

                    {/* WAREHOUSE */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase">
                        <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                        {m.warehouses?.name}
                      </div>
                    </td>

                    {/* USER */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {m.profiles?.full_name || "Admin"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <Activity className="w-12 h-12 mb-4" />
                      <p className="font-black uppercase tracking-widest text-xs">
                        No transactions recorded yet
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-slate-900 rounded-[35px] text-white flex flex-col justify-between min-h-[160px]">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
            Audit Trail Status
          </p>
          <div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Semua mutasi stok dicatat secara real-time dan tidak dapat diubah
              untuk menjaga integritas data gudang.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            System Secure & Verified
          </div>
        </div>

        <div className="p-8 bg-blue-50 border border-blue-100 rounded-[35px] flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
              Movement Summary
            </p>
            <h3 className="text-xl font-black text-slate-900 mt-1 uppercase tracking-tight leading-tight">
              Review & Export <br /> Full Transaction Log
            </h3>
          </div>
          <button className="p-4 bg-white rounded-2xl shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-all group">
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
