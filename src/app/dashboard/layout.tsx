"use client";

import { useState, useEffect } from "react";
import {
  Boxes,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
  History,
  PlusCircle,
  Warehouse,
  ShieldCheck,
  ChevronRight,
  Bell,
  Search,
  Globe,
  ChevronDown,
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchNotifs = async () => {
      const { data } = await supabase
        .from("stock_movements")
        .select("id, type, quantity, products(name)")
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setNotifications(data);
    };
    fetchNotifs();

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "stock_movements" },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev.slice(0, 4)]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1024
        ? setIsSidebarOpen(false)
        : setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["ADMIN", "MANAGER", "STAFF"],
    },
    {
      name: "Inventory Stock",
      icon: Package,
      href: "/dashboard/admin/inventory",
      roles: ["ADMIN", "MANAGER", "STAFF"],
    },
    {
      name: "Create Movement",
      icon: PlusCircle,
      href: "/dashboard/admin/stock-movements/create",
      roles: ["ADMIN", "STAFF"],
    },
    {
      name: "Audit History",
      icon: History,
      href: "/dashboard/admin/stock-movements",
      roles: ["ADMIN", "MANAGER"],
    },
    {
      name: "Product Master",
      icon: Boxes,
      href: "/dashboard/admin/products",
      roles: ["ADMIN", "MANAGER"],
    },
    {
      name: "Warehouses",
      icon: Warehouse,
      href: "/dashboard/admin/warehouses",
      roles: ["ADMIN", "MANAGER"],
    },
    {
      name: "Suppliers",
      icon: Users,
      href: "/dashboard/admin/suppliers",
      roles: ["ADMIN"],
    },
    {
      name: "User Profiles",
      icon: ShieldCheck,
      href: "/dashboard/admin/profiles",
      roles: ["ADMIN"],
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden font-sans antialiased text-slate-900">
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR - ELEGAN SLATE (TIDAK TERLALU GELAP & TIDAK PUTIH) */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-[70] bg-slate-100/80 backdrop-blur-md transition-all duration-500 ease-in-out lg:relative
        ${isSidebarOpen ? "w-[290px]" : "w-0 lg:w-[100px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        border-r border-slate-200/60 shadow-inner
      `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-24 flex items-center px-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10 border border-slate-100">
                <Globe className="text-blue-600 w-6 h-6 animate-pulse" />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col tracking-tighter uppercase font-black">
                  <span className="text-xl leading-none text-slate-800">
                    ERP
                    <span className="text-blue-600 font-extrabold">CORE</span>
                  </span>
                  <span className="text-[9px] text-slate-400 tracking-widest mt-0.5">
                    Professional V1
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation - Button Style with Spacing */}
          <nav className="flex-1 px-5 py-4 overflow-y-auto custom-sidebar-scroll space-y-2">
            {menuItems.map((item) => {
              if (userProfile && !item.roles.includes(userProfile.role))
                return null;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                  flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-[1.02]"
                      : "text-slate-500 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
                  }
                `}
                >
                  <item.icon
                    className={`w-5 h-5 shrink-0 transition-colors duration-300 ${isActive ? "text-white" : "group-hover:text-white"}`}
                  />
                  {isSidebarOpen && (
                    <span className="font-bold text-[13.5px] tracking-tight">
                      {item.name}
                    </span>
                  )}
                  {/* Glass highlight effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-colors" />
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer User Info */}
          <div className="p-6 bg-slate-200/30 border-t border-slate-200/50">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-red-200 active:scale-95 bg-white border border-slate-200"
            >
              <LogOut className="w-4 h-4" />
              {isSidebarOpen && <span>Exit System</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                window.innerWidth < 1024
                  ? setIsMobileOpen(true)
                  : setIsSidebarOpen(!isSidebarOpen)
              }
              className="p-2.5 bg-slate-100 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all text-slate-600 shadow-sm border border-slate-200 active:scale-90"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />
            <div className="hidden md:block">
              <h1 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">
                {pathname.split("/").pop() || "Summary"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Notification */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all relative"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-bounce" />
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-4 z-[100] animate-in slide-in-from-top-2">
                  <h3 className="px-6 pb-3 border-b border-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-400">
                    Activity Logs
                  </h3>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="px-6 py-4 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
                      >
                        <p className="text-xs font-bold text-slate-700">
                          {n.type} Operation: {n.quantity} Units
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-black text-slate-800 leading-none tracking-tight">
                  {userProfile?.full_name}
                </p>
                <p className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-widest px-2 py-0.5 bg-blue-50 rounded-full inline-block">
                  {userProfile?.role}
                </p>
              </div>
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg border-2 border-white shadow-md ring-1 ring-slate-200">
                {userProfile?.full_name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div
          id="main-content"
          className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar scroll-smooth"
        >
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
}
