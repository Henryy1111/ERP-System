"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  RefreshCcw,
  Search,
  Loader2,
  Calendar,
  Filter,
  User,
  Package,
  Warehouse,
  ChevronLeft,
  FileText,
  Tag,
} from "lucide-react";

interface StockMovement {
  id: string;
  type: "IN" | "OUT" | "ADJUSTMENT" | "TRANSFER";
  quantity: number;
  reference_number: string;
  notes: string;
  created_at: string;
  products: { name: string; sku: string };
  warehouses: { name: string };
  profiles: { full_name: string }; // Mengasumsikan tabel auth/profiles kamu bernama profiles
}

export default function StockMovements() {
  const router = useRouter();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    fetchMovements();
  }, []);

  async function fetchMovements() {
    setLoading(true);
    const { data, error } = await supabase
      .from("stock_movements")
      .select(
        `
        id, type, quantity, reference_number, notes, created_at,
        products (name, sku),
        warehouses (name),
        profiles:user_id (full_name)
      `,
      )
      .order("created_at", { ascending: false });

    if (!error) setMovements((data as any) || []);
    setLoading(false);
  }

  const filteredData = movements.filter((m) => {
    const matchesSearch =
      m.products?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || m.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "IN":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "OUT":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "ADJUSTMENT":
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-violet-50 text-violet-600 border-violet-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] pb-20 font-sans">
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

        <div className="bg-white border border-slate-200 shadow-xl shadow-violet-900/5 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-600 rounded-xl text-white shadow-lg shadow-violet-100">
                <History size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  Stock Movements
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5">
                  Audit Trail & Transaction History
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search SKU or Reference..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-violet-500 outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 outline-none focus:border-violet-500 cursor-pointer"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">ALL TYPES</option>
                <option value="IN">STOCK IN</option>
                <option value="OUT">STOCK OUT</option>
                <option value="ADJUSTMENT">ADJUSTMENT</option>
              </select>
              <button
                onClick={fetchMovements}
                className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-violet-600 rounded-xl transition-all shadow-sm"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="max-w-[1600px] mx-auto px-8">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">
              Loading Audit Logs...
            </span>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/30 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                      Date & Time
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                      Product Details
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Type
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Quantity
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                      Warehouse & Staff
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredData.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-violet-50/30 transition-colors group"
                    >
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">
                            {new Date(m.created_at).toLocaleDateString("en-GB")}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock size={10} />{" "}
                            {new Date(m.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                            <Package
                              size={18}
                              className="text-slate-400 group-hover:text-violet-500"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">
                              {m.products?.name}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                              SKU: {m.products?.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider border ${getTypeStyle(m.type)}`}
                        >
                          {m.type === "IN" && <ArrowDownLeft size={12} />}
                          {m.type === "OUT" && <ArrowUpRight size={12} />}
                          {m.type}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span
                          className={`text-sm font-black ${m.type === "IN" ? "text-emerald-600" : m.type === "OUT" ? "text-rose-600" : "text-slate-700"}`}
                        >
                          {m.type === "OUT" ? "-" : "+"}
                          {m.quantity.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase">
                            <Warehouse size={12} className="text-violet-400" />{" "}
                            {m.warehouses?.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                            <User size={12} />{" "}
                            {m.profiles?.full_name || "System Auto"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="max-w-[200px]">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-violet-600">
                            <Tag size={12} /> {m.reference_number || "N/A"}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 truncate italic">
                            "{m.notes || "No notes"}"
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
