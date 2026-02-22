"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import {
  Package,
  Boxes,
  Activity,
  ArrowUpRight,
  AlertCircle,
  Loader2,
  Warehouse,
  Users,
  Tags,
  Truck,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";

export default function ManagerDashboard() {
  const [counts, setCounts] = useState({
    products: 0,
    inventory: 0,
    lowStock: 0,
    movements: 0,
    warehouses: 0,
    categories: 0,
    profiles: 0,
    suppliers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getManagerData() {
      try {
        setLoading(true);
        const [resProd, resInv, resLow, resMov, resWh, resCat, resPro, resSup] =
          await Promise.all([
            supabase
              .from("products")
              .select("*", { count: "exact", head: true }),
            supabase.from("inventory").select("quantity"),
            supabase
              .from("inventory")
              .select("*", { count: "exact", head: true })
              .lt("quantity", 15),
            supabase
              .from("stock_movements")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("warehouses")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("categories")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("profiles")
              .select("*", { count: "exact", head: true }),
            supabase
              .from("suppliers")
              .select("*", { count: "exact", head: true }),
          ]);

        const totalQty =
          resInv.data?.reduce((acc, curr) => acc + (curr.quantity || 0), 0) ||
          0;

        setCounts({
          products: resProd.count || 0,
          inventory: totalQty,
          lowStock: resLow.count || 0,
          movements: resMov.count || 0,
          warehouses: resWh.count || 0,
          categories: resCat.count || 0,
          profiles: resPro.count || 0,
          suppliers: resSup.count || 0,
        });
      } finally {
        setLoading(false);
      }
    }
    getManagerData();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <span className="text-[10px] tracking-[0.5em] text-blue-200/50 font-black uppercase">
            Synchronizing Data...
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans selection:bg-blue-100 antialiased pb-20">
      <div className="max-w-[1600px] mx-auto px-6 py-6 lg:px-10 space-y-6">
        {/* --- HEADER: NEUMORPHIC STYLE --- */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white/70 backdrop-blur-md p-6 rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center shadow-xl shadow-slate-900/20">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  System Intelligence
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Manager <span className="font-light text-slate-400">Hub</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-8 mt-4 md:mt-0 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="px-4 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                Asset Value
              </p>
              <p className="text-xl font-bold text-slate-900">
                {counts.inventory.toLocaleString()}
              </p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="px-4 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                Entity Status
              </p>
              <p className="text-xl font-bold text-blue-600">Active</p>
            </div>
          </div>
        </header>

        {/* --- MAIN GRID: ACTION CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: "Inventory",
              val: counts.inventory,
              icon: Boxes,
              color: "text-blue-600",
              bg: "bg-blue-50",
              link: "/dashboard/manager/inventory",
              desc: "Full Stock Control",
            },
            {
              label: "Catalog",
              val: counts.products,
              icon: Package,
              color: "text-slate-900",
              bg: "bg-slate-100",
              link: "/dashboard/manager/products",
              desc: "Manage Products",
            },
            {
              label: "Categories",
              val: counts.categories,
              icon: Tags,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              link: "/dashboard/manager/categories",
              desc: "Classifications",
            },
            {
              label: "Movements",
              val: counts.movements,
              icon: Activity,
              color: "text-orange-600",
              bg: "bg-orange-50",
              link: "/dashboard/manager/stock-movements",
              desc: "Audit Trails",
            },
          ].map((item, i) => (
            <Link
              href={item.link}
              key={i}
              className="group bg-white/80 backdrop-blur-sm border border-white hover:border-blue-500/30 p-6 rounded-[35px] transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm`}
                >
                  <item.icon size={22} />
                </div>
                <ArrowUpRight
                  className="text-slate-200 group-hover:text-blue-600 transition-colors"
                  size={20}
                />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold tracking-tighter text-slate-900">
                    {item.val}
                  </h2>
                  <span className="text-[9px] font-medium text-slate-400 italic lowercase">
                    {item.desc}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- ANALYTICS & DIRECTORY SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart Card */}
          <div className="lg:col-span-8 bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[80px] -mr-20 -mt-20 rounded-full" />

            <div className="relative z-10 flex justify-between items-start mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <TrendingUp size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                    Live Analytics
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Stock Distribution
                </h3>
              </div>
              <BarChart3 className="text-slate-700" size={32} />
            </div>

            <div className="relative z-10 flex items-end justify-between h-40 gap-3 border-b border-white/5 pb-3 px-2">
              {[60, 40, 75, 50, 90, 30, 85, 45].map((h, i) => (
                <div key={i} className="flex-1 group relative cursor-crosshair">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-white text-slate-900 text-[9px] font-black px-2 py-0.5 rounded shadow-xl">
                    {h}%
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-600/40 to-blue-400/80 rounded-t-lg transition-all duration-700 ease-out delay-75 group-hover:from-blue-500"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 italic">
              <span>Section A</span>
              <span>Section B</span>
              <span>Section C</span>
              <span>Others</span>
            </div>
          </div>

          {/* Directory Access Side */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <LayoutDashboard size={12} /> Authority Control
            </h3>

            {/* Profiles - NOW CLICKABLE & PREMIUM */}
            <Link
              href="/dashboard/manager/profiles"
              className="group block bg-white border border-white hover:border-indigo-200 p-5 rounded-[28px] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      Profiles & Team
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Access Directory
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">
                    {counts.profiles}
                  </p>
                  <ArrowRight
                    size={14}
                    className="text-slate-200 group-hover:text-indigo-600 ml-auto mt-1"
                  />
                </div>
              </div>
            </Link>

            {/* Warehouses */}
            <Link
              href="/dashboard/manager/warehouses"
              className="group block bg-white border border-white hover:border-blue-200 p-5 rounded-[28px] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Warehouse size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      Warehouses
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Operation Sites
                    </p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-900">
                  {counts.warehouses}
                </span>
              </div>
            </Link>

            {/* Suppliers */}
            <Link
              href="/dashboard/manager/suppliers"
              className="group block bg-white border border-white hover:border-emerald-200 p-5 rounded-[28px] shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      Suppliers
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Vendor List
                    </p>
                  </div>
                </div>
                <span className="text-sm font-black text-slate-900">
                  {counts.suppliers}
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* --- ALERT: LOW STOCK (CRITICAL) --- */}
        {counts.lowStock > 0 && (
          <div className="bg-rose-50 border border-white p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_10px_40px_-10px_rgba(225,29,72,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-600 text-white rounded-[18px] flex items-center justify-center shadow-lg shadow-rose-200">
                <AlertCircle size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  Stock Depletion Warning
                </h4>
                <p className="text-xs text-rose-600 font-medium">
                  Identified {counts.lowStock} products requiring immediate
                  replenishment.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/manager/inventory"
              className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all text-center"
            >
              Action Required
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
