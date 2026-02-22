"use client";

import { useState } from "react";
import {
  Lock,
  Mail,
  ChevronRight,
  Boxes,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await loginUser(email, password);
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
      } else {
        const role = result.role;
        if (role === "ADMIN") router.push("/dashboard/admin");
        else if (role === "MANAGER") router.push("/dashboard/manager");
        else router.push("/dashboard/staff");
      }
    } catch (err) {
      setErrorMessage("System error. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] lg:bg-[radial-gradient(circle_at_top_right,_#e2e8f0_0%,_#f1f5f9_50%,_#ffffff_100%)] p-6 font-sans selection:bg-blue-100">
      <div className="w-full max-w-[400px] animate-in fade-in zoom-in-95 duration-700">
        {/* Card Login Utama - Shadow lebih deep agar tidak pucat */}
        <div className="bg-white rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200/60 overflow-hidden">
          <div className="p-8 sm:p-10">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
                <Boxes className="text-white w-7 h-7" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                ERP<span className="text-blue-600">CORE</span>
              </h1>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Please enter your credentials
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-red-600 text-xs font-semibold animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Input Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all placeholder-slate-300 text-slate-700 text-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    required
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all placeholder-slate-300 text-slate-700 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="pt-2 space-y-3">
                {/* Tombol Sign In (Biru) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-4 rounded-xl shadow-lg shadow-blue-100 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Tombol Back to Home (Hijau Emerald - Sesuai Request) */}
                <Link
                  href="/"
                  className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700 border border-emerald-100 transition-all active:scale-[0.98]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            </form>
          </div>

          <div className="bg-slate-50/50 border-t border-slate-100 p-5 text-center">
            <Link
              href="#"
              className="text-[10px] font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Footer simple */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            ERPCORE v2.0.4 &bull; Secure Environment
          </p>
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              System Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
