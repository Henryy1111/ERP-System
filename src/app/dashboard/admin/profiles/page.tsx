"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Loader2,
  Calendar,
  UserCircle2,
  RefreshCcw,
  Edit3,
  Trash2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

export default function ProfilesManagementPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Custom Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, avatar_url, updated_at")
        .order("full_name", { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  }

  // Fungsi untuk memicu modal hapus
  const triggerDelete = (id: string, name: string) => {
    setSelectedProfile({ id, name });
    setIsDeleteModalOpen(true);
  };

  // Fungsi eksekusi hapus beneran
  const confirmDelete = async () => {
    if (!selectedProfile) return;
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", selectedProfile.id);
      if (error) throw error;

      fetchProfiles(); // Refresh data
      setIsDeleteModalOpen(false); // Tutup modal
    } catch (error) {
      alert("Gagal menghapus profil");
    } finally {
      setDeleting(false);
      setSelectedProfile(null);
    }
  };

  const filteredProfiles = profiles.filter((p) =>
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
          Synchronizing Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6">
        <Link
          href="/dashboard/admin"
          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit"
        >
          <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-blue-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">
            Back to Dashboard
          </span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              System <span className="text-blue-600">Profiles</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Manajemen identitas dan otoritas akses sistem.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama..."
                className="pl-11 pr-5 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full md:w-72 transition-all font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchProfiles}
              className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-slate-50 rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Identity
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Privilege
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-center">
                  Last Activity
                </th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-70 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProfiles.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-white transition-all duration-200"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {item.avatar_url ? (
                        <img
                          src={item.avatar_url}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 group-hover:ring-blue-400 transition-all"
                          alt="avatar"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-300 border border-slate-200 shadow-inner">
                          <UserCircle2 className="w-7 h-7" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 text-base leading-none">
                          {item.full_name || "No Name"}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1.5 font-mono uppercase">
                          ID: {item.id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wider ${
                        item.role === "ADMIN"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {item.role}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleDateString("id-ID")
                        : "-"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center items-center gap-3">
                      <Link
                        href={`/dashboard/admin/profiles/edit/${item.id}`}
                        className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                        title="Edit Profile"
                      >
                        <Edit3 className="w-5 h-5" />
                      </Link>

                      <button
                        onClick={() => triggerDelete(item.id, item.full_name)}
                        className="p-2.5 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                        title="Delete Profile"
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

      {/* LUXURY CUSTOM DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 animate-in fade-in duration-300">
          {/* Backdrop Blur */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => !deleting && setIsDeleteModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icon Warning */}
              <div className="w-20 h-20 bg-red-50 rounded-[30px] flex items-center justify-center animate-bounce">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Hapus Akun?
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Apakah Anda yakin ingin menghapus profil{" "}
                  <span className="text-red-600 font-bold italic">
                    "{selectedProfile?.name}"
                  </span>
                  ? Data ini akan hilang dari sistem secara permanen.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-4">
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:shadow-2xl hover:shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
                  className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all shadow-sm"
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
