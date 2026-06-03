"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  Hourglass,
  CheckCheck,
  Plus,
  TrendingUp,
  X,
  Eye,
} from "lucide-react";

import type { UserStats } from "@/hooks/useLaporan";

interface DashboardSectionProps {
  stats: UserStats;
  loading: boolean;
  userName?: string;
  onBuat?: () => void;
}

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Laporan",
    icon: FileText,
    accent: "#6366f1",
    bg: "from-indigo-500/10 to-blue-500/5",
    border: "border-indigo-100",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    textGradient: "from-indigo-600 to-blue-600",
  },

  {
    key: "verifikasi",
    label: "Verifikasi",
    icon: Eye,
    accent: "#f59e0b",
    bg: "from-amber-500/10 to-orange-400/5",
    border: "border-amber-100",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    textGradient: "from-amber-500 to-orange-500",
  },

  {
    key: "menunggu",
    label: "Menunggu",
    icon: Clock,
    accent: "#facc15",
    bg: "from-yellow-500/10 to-amber-400/5",
    border: "border-yellow-100",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    textGradient: "from-yellow-500 to-amber-500",
  },

  {
    key: "diproses",
    label: "Diproses",
    icon: Hourglass,
    accent: "#8b5cf6",
    bg: "from-violet-500/10 to-indigo-400/5",
    border: "border-violet-100",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    textGradient: "from-violet-500 to-indigo-600",
  },

  {
    key: "selesai",
    label: "Selesai",
    icon: CheckCheck,
    accent: "#10b981",
    bg: "from-emerald-500/10 to-teal-400/5",
    border: "border-emerald-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    textGradient: "from-emerald-500 to-teal-500",
  },

  {
    key: "ditolak",
    label: "Ditolak",
    icon: X,
    accent: "#ef4444",
    bg: "from-red-500/10 to-rose-400/5",
    border: "border-red-100",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    textGradient: "from-red-500 to-rose-500",
  },
];

function SkeletonCard() {
  return (
    <div className="h-[140px] bg-white rounded-2xl border border-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50 to-transparent" />
    </div>
  );
}

export default function DashboardSection({
  stats,
  loading,
  userName,
  onBuat,
}: DashboardSectionProps) {
const firstName =
  userName?.split(" ")[0] || "User";

console.log(userName);

  return (
    <div className="space-y-6 mb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 p-7 shadow-xl shadow-indigo-200/50">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-10 right-20 w-28 h-28 rounded-full bg-blue-400/20" />
        <div className="absolute top-6 right-40 w-5 h-5 rounded-full bg-white/20" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-indigo-200 text-sm font-medium tracking-wide">
              Selamat datang kembali 👋
            </p>

            <h1 className="text-3xl font-black text-white mt-1 tracking-tight">
              Halo, {firstName}!
            </h1>

            <p className="text-indigo-200/80 mt-1.5 text-sm">
              Pantau semua laporan Anda di sini.
            </p>
          </div>

          {onBuat && (
            <motion.button
              whileHover={{
                scale: 1.03,
                y: -1,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={onBuat}
              className="flex items-center gap-2.5 bg-white text-indigo-600 font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all shrink-0 text-sm"
            >
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Plus className="w-3.5 h-3.5" />
              </div>

              Buat Laporan Baru
            </motion.button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
        {loading
          ? Array.from({
              length: 6,
            }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : STAT_CARDS.map(
              (s, i) => {
                const Icon =
                  s.icon;

                const value =
                  stats[
                    s.key as keyof UserStats
                  ] ?? 0;

                return (
                  <motion.div
                    key={s.key}
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        i * 0.07,
                      duration:
                        0.4,
                      ease:
                        "easeOut",
                    }}
                    whileHover={{
                      y: -3,
                      transition: {
                        duration:
                          0.2,
                      },
                    }}
                    className={`relative overflow-hidden bg-white rounded-2xl border ${s.border} p-5 shadow-sm hover:shadow-lg transition-shadow`}
                  >
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-60`}
                    />

                    <div className="relative">
                      <div
                        className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}
                      >
                        <Icon
                          className={`w-5 h-5 ${s.iconColor}`}
                        />
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
              }
            )}
      </div>
    </div>
  );
}