"use client";

import { motion } from "framer-motion";
import { FileText, Hourglass, CheckCheck, Eye, TrendingUp, X } from "lucide-react";
import type { AdminStats } from "@/types/admin";

interface AdminDashboardSectionProps {
  stats: AdminStats;
  loading: boolean;
  adminName?: string;
}

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Laporan",
    icon: FileText,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    border: "border-indigo-100",
    bg: "from-indigo-500/10 to-blue-500/5",
    textGradient: "from-indigo-600 to-blue-600",
  },
  {
    key: "verifikasi",
    label: "Perlu Verifikasi",
    icon: Eye,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    border: "border-amber-100",
    bg: "from-amber-400/10 to-orange-300/5",
    textGradient: "from-amber-500 to-orange-400",
  },
  {
    key: "diproses",
    label: "Sedang Diproses",
    icon: Hourglass,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-500",
    border: "border-violet-100",
    bg: "from-violet-400/10 to-indigo-300/5",
    textGradient: "from-violet-500 to-indigo-500",
  },
  {
    key: "selesai",
    label: "Selesai",
    icon: CheckCheck,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
    border: "border-emerald-100",
    bg: "from-emerald-400/10 to-teal-300/5",
    textGradient: "from-emerald-500 to-teal-400",
  },
  {
    key: "ditolak",
    label: "Ditolak",
    icon: X,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    border: "border-red-100",
    bg: "from-red-400/10 to-rose-300/5",
    textGradient: "from-red-500 to-rose-400",
  },
];

function SkeletonCard() {
  return (
    <div className="h-[140px] bg-white rounded-2xl border border-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50 to-transparent" />
    </div>
  );
}

export default function AdminDashboardSection({
  stats,
  loading,
  adminName,
}: AdminDashboardSectionProps) {
  const firstName = adminName?.split(" ")[0] || "Admin";
  const resolusiRate =
    stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0;
  const pending = (stats.verifikasi ?? 0) + (stats.diproses ?? 0);

  return (
    <div className="space-y-6 mb-8">
      {/* Welcome Banner — sama persis dengan user */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 p-7 shadow-xl shadow-indigo-200/50">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-10 right-20 w-28 h-28 rounded-full bg-blue-400/20" />
        <div className="absolute top-6 right-40 w-5 h-5 rounded-full bg-white/20" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2.5 py-1 bg-white/20 rounded-lg flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-white/80" />
                <span className="text-[11px] font-bold text-white/90">
                  Panel Admin
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Halo, {firstName}!
            </h1>
            <p className="text-indigo-200/80 mt-1.5 text-sm">
              Kelola dan pantau semua laporan masuk dari sini.
            </p>
          </div>

          {/* Mini stats di banner — pembeda admin vs user */}
          <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/20">
              <p className="text-2xl font-black text-white">
                {loading ? "—" : stats.total}
              </p>
              <p className="text-[11px] text-indigo-200 mt-0.5">Total Masuk</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/20">
              <p className="text-2xl font-black text-white">
                {loading ? "—" : `${resolusiRate}%`}
              </p>
              <p className="text-[11px] text-indigo-200 mt-0.5">
                Diselesaikan
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/20">
              <p className="text-2xl font-black text-white">
                {loading ? "—" : pending}
              </p>
              <p className="text-[11px] text-indigo-200 mt-0.5">
                Perlu Tindakan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards — warna & struktur identik user dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : STAT_CARDS.map((s, i) => {
              const Icon = s.icon;
              const value = stats[s.key as keyof AdminStats] ?? 0;
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className={`relative overflow-hidden bg-white rounded-2xl border ${s.border} p-5 shadow-sm hover:shadow-lg transition-shadow`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-60`}
                  />
                  <div className="relative">
                    <div
                      className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}
                    >
                      <Icon className={`w-5 h-5 ${s.iconColor}`} />
                    </div>
                    <div
                      className={`text-4xl font-black bg-gradient-to-r ${s.textGradient} bg-clip-text text-transparent leading-none`}
                    >
                      {value}
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-1.5 tracking-wide">
                      {s.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}