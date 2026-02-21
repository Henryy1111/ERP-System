"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import {
  Users,
  Package,
  Truck,
  Warehouse,
  Tags,
  Boxes,
  Activity,
  ArrowUpRight,
  ClipboardList,
  Loader2,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function AdminPage() {
  const [counts, setCounts] = useState({
    users: 0,
    products: 0,
    suppliers: 0,
    warehouses: 0,
    categories: 0,
    inventory: 0,
    movements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRealData() {
      try {
        setLoading(true);
        const [
          resUsers,
          resProducts,
          resSuppliers,
          resWarehouses,
          resCategories,
          resInventory,
          resMovements,
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase
            .from("suppliers")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("warehouses")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("categories")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("inventory")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("stock_movements")
            .select("*", { count: "exact", head: true }),
        ]);

        setCounts({
          users: resUsers.count || 0,
          products: resProducts.count || 0,
          suppliers: resSuppliers.count || 0,
          warehouses: resWarehouses.count || 0,
          categories: resCategories.count || 0,
          inventory: resInventory.count || 0,
          movements: resMovements.count || 0,
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }
    getRealData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          <LayoutDashboard className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <p className="text-slate-500 font-medium tracking-[0.2em] text-[10px] uppercase">
          Securing Connection...
        </p>
      </div>
    );
  }

  const mainStats = [
    {
      label: "User Management",
      value: counts.users,
      icon: Users,
      color: "from-blue-600 to-indigo-700",
      href: "/dashboard/admin/profiles",
      trend: "+2.4%",
    },
    {
      label: "Product Catalog",
      value: counts.products,
      icon: Package,
      color: "from-violet-600 to-purple-700",
      href: "/dashboard/admin/products",
      trend: "+12%",
    },
    {
      label: "Stock Inventory",
      value: counts.inventory,
      icon: Boxes,
      color: "from-emerald-500 to-teal-700",
      href: "/dashboard/admin/inventory",
      trend: "Stable",
    },
    {
      label: "Global Suppliers",
      value: counts.suppliers,
      icon: Truck,
      color: "from-amber-500 to-orange-600",
      href: "/dashboard/admin/suppliers",
      trend: "+1 new",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              System Verified
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Executive{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Overview
            </span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Control and monitor your enterprise resources in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right mr-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              System Status
            </p>
            <p className="text-sm font-bold text-emerald-500">
              All Systems Operational
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
            <Activity className="w-5 h-5 text-slate-600" />
          </div>
        </div>
      </div>

      {/* --- MAIN CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {mainStats.map((stat, i) => (
          <Link href={stat.href} key={i} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10 rounded-[32px] scale-95" />
            <div className="bg-white border border-slate-200/60 p-6 rounded-[32px] shadow-sm group-hover:border-transparent group-hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-full transform translate-x-8 -translate-y-8`}
              />

              <div className="flex justify-between items-start relative z-10">
                <div
                  className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-500`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-1">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                    {stat.value}
                  </h3>
                  <span className="text-slate-300 text-xs font-medium italic">
                    records
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                <span className="text-[10px] text-slate-400 font-bold uppercase group-hover:text-blue-600 transition-colors">
                  Manage Data
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* --- SECONDARY SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support Grid */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">
            Support Infrastructure
          </h3>
          {[
            {
              label: "Warehouses",
              val: counts.warehouses,
              icon: Warehouse,
              href: "/dashboard/admin/warehouses",
            },
            {
              label: "Categories",
              val: counts.categories,
              icon: Tags,
              href: "/dashboard/admin/categories",
            },
            {
              label: "Movements",
              val: counts.movements,
              icon: Activity,
              href: "/dashboard/admin/stock-movements",
            },
          ].map((item, idx) => (
            <Link href={item.href} key={idx} className="block group">
              <div className="bg-white/50 backdrop-blur-md border border-slate-200/50 p-4 rounded-[24px] flex items-center justify-between hover:bg-white hover:shadow-lg hover:border-white transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:rotate-12 transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.label}
                    </p>
                    <p className="text-lg font-black text-slate-800">
                      {item.val}
                    </p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Intelligence Panel */}
        <div className="lg:col-span-2 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[40px] shadow-2xl" />
          <div className="relative h-full border border-white/10 rounded-[40px] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                  <ClipboardList className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold tracking-tight">
                    Audit Intelligence
                  </h2>
                  <p className="text-blue-400/60 text-[10px] font-bold uppercase tracking-widest">
                    Active Monitoring System
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/movements"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all border border-white/10"
              >
                VIEW FULL REPORT
              </Link>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-600/10 flex items-center justify-center mb-6 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <h4 className="text-white text-lg font-bold mb-2">
                Live Logs Connected
              </h4>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                The system is currently aggregating data from all endpoints.
                Click on any metric card to drill down into specific analytics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
