"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Bell, 
  ArrowRight, 
  ArrowUp,
  ChevronRight,
  BarChart,
  Edit3, 
  Send, 
  FileText, 
  MessageSquare, 
  CheckCircle,
  MapPin,
  ThumbsUp,
  Clock,
  Star,
  Globe,
  Mail,
  Share2,
  ArrowUpRight,
  Info,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from "next/link";
import Image from "next/image";

// ─── TAMBAHAN: Data untuk section baru ───────────────────────────────────────

const SAMPLE_REPORTS = [
  {
    id: 1,
    category: "Infrastruktur",
    title: "Jalan Berlubang di Jl. Pajajaran No. 42",
    location: "Bogor Tengah",
    status: "Selesai",
    time: "2 hari lalu",
    statusColor: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  {
    id: 2,
    category: "Kebersihan",
    title: "Tumpukan Sampah Liar Pinggir Sungai Ciliwung",
    location: "Tanah Sareal",
    status: "Diproses",
    time: "5 jam lalu",
    statusColor: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
  {
    id: 3,
    category: "PJU",
    title: "Lampu Penerangan Jalan Mati Sudah 3 Bulan",
    location: "Bogor Utara",
    status: "Diverifikasi",
    time: "1 hari lalu",
    statusColor: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
];


const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};




// ─── KOMPONEN UTAMA ───────────────────────────────────────────────────────────

export default function AduCepatLandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const categories = ["Semua", "Infrastruktur", "Kebersihan", "PJU", "Pelayanan Publik"];
  const filtered = activeCategory === "Semua"
    ? SAMPLE_REPORTS
    : SAMPLE_REPORTS.filter(r => r.category === activeCategory);
  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">

      {/* ── ASLI: Navigation ─────────────────────────────────────────────────── */}
   <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-2 cursor-pointer group">
      <div className="w-16 h-16 relative group-hover:scale-105 transition-transform">
        <Image
          src="/images/logo.png"
          alt="AduanRakyat Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    <span className="text-2xl font-extrabold tracking-tight">
      <span className="text-indigo-600">Aduan</span>
      <span className="text-slate-800">Rakyat</span>
    </span>
    </div>
    
    {/* Menu Navigasi - Disesuaikan dengan Section Landing Page */}
    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
      <a href="#alur" className="relative group py-2 hover:text-indigo-600 transition-colors">
        Alur Laporan
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
      </a>
       <a href="#statistik" className="relative group py-2 hover:text-indigo-600 transition-colors">
        Statistik
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
      </a>
            <a href="#laporan" className="relative group py-2 hover:text-indigo-600 transition-colors">
        Laporan Terkini
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
      </a>
      <a href="#testimoni" className="relative group py-2 hover:text-indigo-600 transition-colors">
        Testimoni 
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
      </a>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center gap-3">
     <Link href="/auth/login">
      <motion.button 
        whileTap={{ scale: 0.95 }}
        className="hidden sm:block text-sm font-bold text-slate-600 hover:text-indigo-600 transition px-4"
      >
        Masuk
      </motion.button>
    </Link>

    <Link href="/auth/register">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
      >
        Mulai Melapor
      </motion.button>
    </Link>
    </div>
  </div>
</nav>

      {/* ── ASLI: Hero Section ───────────────────────────────────────────────── */}
      <section className="relative py-30 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full text-indigo-700 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Platform Terintegrasi Pemerintah 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
            Layanan Pengaduan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Cepat & Transparan.
            </span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Laporkan kendala di lingkungan Anda hanya dalam hitungan menit. Pantau prosesnya secara real-time hingga selesai ditangani oleh pihak berwenang.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
              Buat Laporan <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#alur" className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Lihat Alur Kerja
            </a>
          </div>
        </div>
      </section>

    {/* ── SECTION: ALUR LAPORAN ────────────────────────────────────────────────── */}
<section id="alur" className="py-20 bg-white border-y border-slate-100 relative overflow-hidden">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Alur Laporan Kami</h2>
      <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base">
        Sistematis dan transparan. Klik pada setiap tahapan untuk melihat prosesnya.
      </p>
    </div>

    <div className="relative">
      {/* Garis Penghubung Statis */}
      <div className="hidden lg:block absolute top-8 left-0 w-full h-[1px] bg-slate-300 -z-0" />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
        {[
          { icon: <Edit3 />, title: "Tulis Laporan", desc: "Laporkan keluhan anda dengan jelas dan lengkap." },
          { icon: <Send />, title: "Verifikasi", desc: "Validasi data dalam 3 hari kerja oleh tim admin." },
          { icon: <FileText />, title: "Tindak Lanjut", desc: "Laporan diteruskan ke instansi teknis terkait." },
          { icon: <MessageSquare />, title: "Tanggapan", desc: "Pantau dan balas respon langsung dari instansi." },
          { icon: <CheckCircle />, title: "Selesai", desc: "Masalah tuntas terselesaikan dan diarsipkan." }
        ].map((step, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }} 
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-white border-2 border-slate-300 text-slate-400 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 group-hover:shadow-lg group-hover:shadow-indigo-100 group-active:bg-indigo-700">
              {React.cloneElement(step.icon, { className: "w-6 h-6 transition-transform group-hover:scale-110" })}
            </div>
            
            <h3 className="font-bold text-base mb-2 text-slate-800 transition-colors group-hover:text-indigo-600 text-center">
              {step.title}
            </h3>
            
            <p className="text-[13px] text-slate-500 leading-relaxed text-center px-2 opacity-70 group-hover:opacity-100 transition-opacity">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>

{/* ── SECTION: FEATURE CARDS ────────────────────────────────────────────────── */}
  <section className="py-20 bg-slate-50/50">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: <Zap className="w-5 h-5 text-amber-500" />, title: "Respon Kilat", desc: "Langsung diteruskan ke dinas terkait tanpa birokrasi berbelit." },
          { icon: <Bell className="w-5 h-5 text-indigo-500" />, title: "Notifikasi Real-time", desc: "Update status laporan via WhatsApp atau email di setiap tahap." },
          { icon: <BarChart className="w-5 h-5 text-emerald-500" />, title: "Analitik Publik", desc: "Pantau performa kerja pemerintah melalui dashboard transparan." }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            className="group p-8 rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {feature.desc}
            </p>
            
            <div className="mt-5 flex items-center text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              PELAJARI <ChevronRight className="w-3 h-3 ml-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>

      {/* ── ASLI: Trust / Statistik Section ─────────────────────────────────── */}
    <section id="statistik" className="py-24 bg-white relative overflow-hidden">
  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] opacity-60 -z-10" />

  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
      
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          Dipercaya oleh <span className="text-indigo-600">ribuan warga</span> setiap harinya.
        </h2>
        <p className="text-lg text-slate-500 leading-relaxed">
          Membangun ekosistem kota yang lebih cerdas dan responsif melalui kolaborasi teknologi 
          serta partisipasi aktif masyarakat dalam melaporkan kendala di lapangan.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full lg:w-auto">
        {[
          { label: "Laporan Selesai", value: "45k+", color: "from-blue-600 to-indigo-600" },
          { label: "Instansi Aktif", value: "120+", color: "from-indigo-600 to-violet-600" },
          { label: "Kepuasan Warga", value: "98%", color: "from-violet-600 to-fuchsia-600" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ y: -5 }}
            className="relative group p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center min-w-[200px]"
          >
            <div className="absolute inset-0 bg-white rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl shadow-indigo-100/50 -z-10" />
            
            <div className={`text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  </div>
</section>

      {/* ── Live Reports Feed ───────────────────────────────────────────────── */}
      <section id="laporan" className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full text-indigo-700 text-xs font-semibold mb-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600"></span>
                </span>
                Live Feed
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Laporan Terkini</h2>
              <p className="text-slate-500 mt-2 max-w-lg">Temukan laporan warga yang sedang aktif ditangani di sekitar Anda.</p>
            </div>
            {/* Filter kategori */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filtered.length > 0 ? filtered.map(r => (
              <div key={r.id} className="group bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 cursor-pointer">
                {/* Fake image placeholder */}
                <div className="w-full h-36 rounded-2xl bg-slate-50 mb-5 flex items-center justify-center border border-slate-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth={1.5} className="w-10 h-10">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>

                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{r.category}</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${r.statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`}></span>
                    {r.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-4 group-hover:text-indigo-700 transition-colors">{r.title}</h3>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {r.location}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {r.support}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.time}</span>
                  </span>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-16 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-slate-300" />
                </div>
                <p className="font-medium">Belum ada laporan dalam kategori ini.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 mx-auto">
              Lihat Semua Laporan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonial / Social Proof ──────────────────────────────────────── */}
      <section id="testimoni"  className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Kata Warga yang Sudah Mencoba</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Ribuan warga telah merasakan manfaat nyata dari platform ini.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Budi Santoso",
                loc: "Bogor, Jawa Barat",
                avatar: "BS",
                text: "Laporan jalan rusak saya ditindaklanjuti dalam 3 hari. Sangat cepat dan ada update terus di WhatsApp. Luar biasa!",
                stars: 5,
              },
              {
                name: "Siti Rahayu",
                loc: "Depok, Jawa Barat",
                avatar: "SR",
                text: "Akhirnya ada platform yang benar-benar terhubung ke pemerintah. Laporan banjir saya langsung direspons dinas PU.",
                stars: 5,
              },
              {
                name: "Ahmad Fauzi",
                loc: "Bekasi, Jawa Barat",
                avatar: "AF",
                text: "Fitur pelacak status laporan sangat membantu. Saya bisa tahu persis laporan saya sudah sampai mana prosesnya.",
                stars: 4,
              },
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-[2rem] border border-slate-100 bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`w-4 h-4 ${s < t.stars ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`} />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-50">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ASLI: Footer ─────────────────────────────────────────────────────── */}
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 mb-16">
        
        {/* Kolom 1: Branding & Deskripsi */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative shrink-0">
              <Image
                src="/images/logo.png"
                alt="AduanRakyat Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-indigo-600">Aduan</span>
                <span className="text-black">Rakyat</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            Platform digital terintegrasi untuk menghubungkan suara warga dengan pemerintah secara transparan dan cepat demi lingkungan yang lebih baik.
          </p>
          
          <div className="flex gap-3">
            {[Globe, Mail, MessageSquare, Share2].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Kolom 2: Navigasi Layanan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <h4 className="font-bold text-slate-900">Layanan Kami</h4>
          <ul className="space-y-4">
            {["Buat Laporan", "Cek Status Aduan", "Statistik Kota", "Daftar Instansi"].map((item) => (
              <li key={item}>
                <a href="#" className="text-slate-500 text-sm hover:text-indigo-600 hover:translate-x-1 transition-all inline-flex items-center gap-1 group">
                  {item} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Kolom 3: Informasi Umum */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h4 className="font-bold text-slate-900">Pusat Informasi</h4>
          <ul className="space-y-4">
            {["Panduan Pengguna", "Kebijakan Privasi", "Ketentuan Layanan", "FAQ"].map((item) => (
              <li key={item}>
                <a href="#" className="text-slate-500 text-sm hover:text-indigo-600 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Kolom 4: Hubungi Kami */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h4 className="font-bold text-slate-900">Hubungi Kami</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-slate-500">
              <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>Gedung Balai Kota, Lantai 2, Bogor, Jawa Barat.</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-500">
              <Phone className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>+62 812-3456-7890</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-500">
              <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>halo@aduancepat.id</span>
            </li>
          </ul>
        </motion.div>

      </div>

      {/* Baris Paling Bawah */}
      <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-slate-400 text-sm">
          © 2026 <span className="font-semibold text-slate-600">AduanRakyat</span>. Bangga Melayani Warga.
        </p>
        <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Verifikasi 2.0.4</span>
          <button className="hover:text-indigo-600 transition-colors">Indonesia</button>
        </div>
      </div>
    </div>
  </footer>

  {/* Floating Scroll To Top */}
{showScrollTop && (
  <motion.button
    onClick={scrollToTop}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-300 flex items-center justify-center hover:bg-indigo-700 transition-all"
  >
    <ArrowUp className="w-6 h-6" />
  </motion.button>
)}

    </div>
  );
}