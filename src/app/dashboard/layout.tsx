"use client";

import { useState, useEffect } from "react";
import {
  Boxes,
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  // Ambil data profile asli dari Supabase saat halaman dimuat
  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  // Fungsi Logout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    {
      name: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["ADMIN", "MANAGER", "STAFF"],
    },
    {
      name: "Inventory",
      icon: Package,
      href: "/dashboard/inventory",
      roles: ["ADMIN", "MANAGER", "STAFF"],
    },
    {
      name: "User Management",
      icon: Users,
      href: "/dashboard/admin",
      roles: ["ADMIN"],
    },
    {
      name: "Reports",
      icon: BarChart3,
      href: "/dashboard/manager",
      roles: ["ADMIN", "MANAGER"],
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      roles: ["ADMIN", "MANAGER", "STAFF"],
    },
  ];

  // Tampilan saat sedang loading data profile
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">
          Initializing Workspace
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* --- SIDEBAR --- */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
            <Boxes className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && (
            <span className="font-black tracking-tighter text-xl text-slate-900 animate-in fade-in duration-500">
              ERP<span className="text-blue-600">CORE</span>
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {menuItems.map((item) => {
            // Gunakan role asli dari database
            if (userProfile && !item.roles.includes(userProfile.role))
              return null;

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}
                />
                {isSidebarOpen && (
                  <span className="font-bold text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col">
        {/* Navbar Atas */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {userProfile?.full_name || "User"}
              </p>
              <p className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">
                {userProfile?.role || "Role"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
              {userProfile?.full_name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Isi Halaman Dashboard */}
        <div className="p-8 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
