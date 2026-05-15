"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Search, RefreshCw, ChevronRight, Inbox,
  SlidersHorizontal, Plus, Menu, Bell, LayoutDashboard, ClipboardList,
} from "lucide-react";
import Link from "next/link";

import { useLaporan }       from "@/hooks/useLaporan";
import { useAuth }          from "@/context/authContext";
import Sidebar              from "@/components/user/Sidebar";
import DashboardSection     from "@/components/user/DashboardSection";
import FormLaporan          from "@/components/user/FormLaporan";
import ReportCard           from "@/components/user/ReportCard";
import DetailModal          from "@/components/user/DetailModel";
import type { StatusType, UserReport } from "@/hooks/useLaporan";

const FILTER_TABS: { label: string; value: "semua" | StatusType }[] = [
  { label: "Semua",        value: "semua"        },
  { label: "Menunggu",     value: "menunggu"      },
  { label: "Diverifikasi", value: "diverifikasi"  },
  { label: "Diproses",     value: "diproses"      },
  { label: "Selesai",      value: "selesai"       },
  { label: "Ditolak",      value: "ditolak"       },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",    icon: LayoutDashboard },
  { id: "laporan",   label: "Laporan Saya", icon: ClipboardList   },
  { id: "buat",      label: "Buat Laporan", icon: Plus            },
];

const TAB_LABEL: Record<string, string> = {
  dashboard: "Beranda",
  laporan:   "Laporan Saya",
  buat:      "Buat Laporan",
};

export default function UserHomepage() {
  const { user }                                    = useAuth();
  const { reports, stats, loading, error, refetch } = useLaporan();

  const [activeTab, setActiveTab]           = useState("dashboard");
  const [activeFilter, setActiveFilter]     = useState<"semua" | StatusType>("semua");
  const [search, setSearch]                 = useState("");
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const filtered = reports.filter((r) => {
    const matchStatus = activeFilter === "semua" || r.status === activeFilter;
    const matchSearch =
      !search ||
      r.judul.toLowerCase().includes(search.toLowerCase()) ||
      r.lokasi?.toLowerCase().includes(search.toLowerCase()) ||
      r.kategori?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">

      {/* ── SIDEBAR DESKTOP ── */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ── SIDEBAR MOBILE OVERLAY ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl"
            >
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => { setActiveTab(tab); setMobileSidebarOpen(false); }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Breadcrumb Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Menu className="w-4 h-4 text-slate-600" />
            </button>
            <div>
              <span className="text-sm font-bold text-slate-400">Dashboard</span>
              <span className="text-slate-300 mx-2">/</span>
              <span className="text-sm font-bold text-slate-700">{TAB_LABEL[activeTab]}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.slice(0, 2)?.toUpperCase() || "??"}
              </div>
              <span className="text-sm font-bold text-slate-700 hidden sm:block">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 max-w-6xl w-full mx-auto pb-24 lg:pb-6">

          {/* ── DASHBOARD TAB ── */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <DashboardSection
                stats={stats}
                loading={loading}
                userName={user?.name}
                onBuat={() => setActiveTab("buat")}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold text-slate-900">Laporan Terkini</h2>
                  <button
                    onClick={() => setActiveTab("laporan")}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    Lihat Semua <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {loading ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-40 bg-white rounded-2xl border animate-pulse" />
                    ))}
                  </div>
                ) : reports.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {reports.slice(0, 4).map((item) => (
                      <ReportCard key={item.id} report={item} onClick={setSelectedReport} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-7 h-7 text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-600">Belum ada laporan</p>
                    <p className="text-sm text-slate-400 mt-1">Mulai dengan membuat laporan pertama Anda</p>
                    <button
                      onClick={() => setActiveTab("buat")}
                      className="mt-4 bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-colors"
                    >
                      Buat Laporan
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── LAPORAN TAB ── */}
          {activeTab === "laporan" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Laporan Saya</h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {loading ? "Memuat..." : `${reports.length} laporan ditemukan`}
                  </p>
                </div>
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Perbarui
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari judul, lokasi, atau kategori..."
                  className="w-full bg-white border-2 border-slate-100 focus:border-indigo-300 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-700 outline-none transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-lg leading-none"
                  >×</button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 flex-wrap">
                {FILTER_TABS.map((tab) => {
                  const count = tab.value === "semua"
                    ? reports.length
                    : reports.filter((r) => r.status === tab.value).length;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setActiveFilter(tab.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeFilter === tab.value
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                    >
                      {tab.label}
                      {count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                          activeFilter === tab.value ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        }`}>{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-700 text-sm flex items-center gap-3">
                  <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
                  {error}
                  <button onClick={refetch} className="ml-auto font-bold hover:underline">Coba Lagi</button>
                </div>
              )}

              {/* Content */}
              {loading ? (
                <div className="grid md:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-6 animate-pulse space-y-3 border border-slate-100">
                      <div className="flex justify-between">
                        <div className="w-20 h-5 bg-slate-100 rounded-lg" />
                        <div className="w-20 h-5 bg-slate-100 rounded-full" />
                      </div>
                      <div className="w-3/4 h-5 bg-slate-100 rounded-lg" />
                      <div className="w-1/2 h-4 bg-slate-100 rounded-lg" />
                      <div className="w-full h-10 bg-slate-100 rounded-xl mt-4" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-4">
                    <Inbox className="w-9 h-9 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">
                    {search ? "Tidak ditemukan" : "Belum ada laporan"}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-xs">
                    {search
                      ? `Tidak ada laporan yang cocok dengan "${search}".`
                      : "Anda belum membuat laporan. Klik tombol di atas untuk mulai melapor."}
                  </p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  {filtered.map((report) => (
                    <ReportCard key={report.id} report={report} onClick={setSelectedReport} />
                  ))}
                </div>
              )}

              {!loading && reports.length > 0 && (
                <div className="mt-10 text-center">
                  <Link href="/user/laporan">
                    <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-indigo-200 text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors">
                      <FileText className="w-4 h-4" />
                      Lihat Riwayat Lengkap
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* ── BUAT LAPORAN TAB ── */}
          {activeTab === "buat" && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Buat Laporan Baru</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Sampaikan masalah di sekitar Anda kepada pihak berwenang.
                </p>
              </div>
              <FormLaporan onSuccess={() => { refetch(); setActiveTab("laporan"); }} />
            </div>
          )}

        </main>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold transition-colors ${
                  active ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-indigo-600" : "text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <DetailModal item={selectedReport} onClose={() => setSelectedReport(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}