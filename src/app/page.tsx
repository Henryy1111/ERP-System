import Link from "next/link";
import { ArrowRight, BarChart3, Boxes, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Boxes className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            ERP<span className="text-blue-600">CORE</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-blue-600 transition">
            Features
          </Link>
          <Link href="#about" className="hover:text-blue-600 transition">
            Solutions
          </Link>
          {/* Tombol Login di Navbar */}
          <Link
            href="/login"
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition shadow-md"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 border border-blue-100">
            <Zap className="w-4 h-4 fill-current" />
            <span>v2.0 is now live with Supabase integration</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Manage inventory with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              unmatched precision.
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistem ERP modern yang dirancang untuk kecepatan dan akurasi. Pantau
            stok, kelola supplier, dan analisis data dalam satu platform
            terintegrasi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Tombol Start Managing juga diarahkan ke Login agar user masuk dulu */}
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
            >
              Start Managing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section
        id="features"
        className="py-24 bg-slate-50 border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
              title="Real-time Analytics"
              desc="Pantau pergerakan stok secara instan dengan laporan yang akurat dan mendalam."
            />
            <FeatureCard
              icon={<Boxes className="w-6 h-6 text-blue-600" />}
              title="Multi-Warehouse"
              desc="Kelola inventaris di berbagai lokasi gudang tanpa sinkronisasi manual."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
              title="Enterprise Security"
              desc="Keamanan data tingkat tinggi dengan Row Level Security dari Supabase."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
