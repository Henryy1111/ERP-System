"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link"; // Tambahkan ini untuk navigasi
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
  Plus,
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

  // Tambahkan 'href' untuk mengarahkan ke halaman CRUD masing-masing
  const mainStats = [
    {
      label: "Management Users",
      value: counts.users,
      icon: Users,
      color: "bg-blue-600",
      shadow: "shadow-blue-100",
      table: "profiles",
      href: "/dashboard/admin/profiles", // Sesuai permintaan kamu tadi
    },
    {
      label: "Product Catalog",
      value: counts.products,
      icon: Package,
      color: "bg-indigo-600",
      shadow: "shadow-indigo-100",
      table: "products",
      href: "/dashboard/admin/products",
    },
    {
      label: "Total Stock Items",
      value: counts.inventory,
      icon: Boxes,
      color: "bg-emerald-600",
      shadow: "shadow-emerald-100",
      table: "inventory",
      href: "/dashboard/admin/inventory",
    },
    {
      label: "Registered Suppliers",
      value: counts.suppliers,
      icon: Truck,
      color: "bg-orange-600",
      shadow: "shadow-orange-100",
      table: "suppliers",
      href: "/dashboard/admin/suppliers",
    },
  ];

  const subStats = [
    {
      label: "Warehouses",
      value: counts.warehouses,
      icon: Warehouse,
      table: "warehouses",
      href: "/dashboard/admin/warehouses",
    },
    {
      label: "Categories",
      value: counts.categories,
      icon: Tags,
      table: "categories",
      href: "/dashboard/admin/categories",
    },
    {
      label: "Stock Movements",
      value: counts.movements,
      icon: Activity,
      table: "stock_movements",
      href: "/dashboard/admin/stock-movements",
    },
  ];

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
          Synchronizing Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* --- HERO SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Admin Command Center
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Enterprise <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Real-time infrastructure monitoring and system control.
          </p>
        </div>
      </div>

      {/* --- MAIN CARDS (High Priority) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <Link href={stat.href} key={index} className="block group">
            <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="p-2 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded-xl transition-all">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
                  {stat.value}
                </h3>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  View Details
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* --- SUB STATS & LOG SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sub Stats Grid */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="font-black text-slate-800 text-lg px-2 uppercase tracking-widest text-xs">
            Support Entities
          </h3>
          {subStats.map((sub, i) => (
            <Link href={sub.href} key={i} className="block group">
              <div className="bg-white/60 backdrop-blur-sm p-5 rounded-[24px] border border-slate-100 flex items-center justify-between hover:bg-white transition-all shadow-sm group-hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <sub.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {sub.label}
                    </p>
                    <p className="text-xl font-black text-slate-800">
                      {sub.value}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Audit Log Panel */}
        <div className="lg:col-span-8 bg-slate-900 rounded-[40px] p-1 shadow-2xl overflow-hidden min-h-[400px]">
          <div className="bg-white h-full w-full rounded-[38px] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 tracking-tight text-sm uppercase">
                    Audit Log Status
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold italic">
                    Connected to table: stock_movements
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/movements"
                className="text-[11px] font-black text-blue-600 border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all"
              >
                FULL AUDIT
              </Link>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <ClipboardList className="w-16 h-16 text-slate-200 mb-4" />
              <h4 className="text-slate-900 font-black italic">
                Monitoring Active
              </h4>
              <p className="text-slate-400 text-sm max-w-xs">
                Klik kartu statistik di atas untuk mulai mengelola data secara
                CRUD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
