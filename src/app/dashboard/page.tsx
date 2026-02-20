"use client";

import {
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

export default function OverviewPage() {
  // Stat data mock (nanti kita ambil dari database)
  const stats = [
    {
      label: "Total Products",
      value: "1,240",
      icon: Package,
      change: "+12%",
      trend: "up",
    },
    {
      label: "Active Users",
      value: "48",
      icon: Users,
      change: "+3%",
      trend: "up",
    },
    {
      label: "Low Stock Items",
      value: "12",
      icon: Activity,
      change: "-5%",
      trend: "down",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          System Overview
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Monitoring your enterprise resources in real-time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <stat.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold ${stat.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}
              >
                {stat.change}
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder untuk tabel atau grafik nantinya */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-8 h-64 flex items-center justify-center border-dashed">
        <p className="text-slate-400 font-medium italic text-sm">
          Recent activity logs will appear here...
        </p>
      </div>
    </div>
  );
}
