"use client";

import { motion } from "framer-motion";
import { FileText, Clock, Hourglass, CheckCheck, Plus } from "lucide-react";
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
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    key: "menunggu",
    label: "Menunggu",
    icon: Clock,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    gradient: "from-amber-400 to-orange-400",
  },
  {
    key: "diproses",
    label: "Diproses",
    icon: Hourglass,
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    gradient: "from-violet-500 to-indigo-500",
  },
  {
    key: "selesai",
    label: "Selesai",
    icon: CheckCheck,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function DashboardSection({ stats, loading, userName, onBuat }: DashboardSectionProps) {
  return (
    <div className="space-y-6 mb-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm">Selamat datang kembali 👋</p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Halo, {userName?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Pantau semua laporan Anda di sini.</p>
        </div>
        {onBuat && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBuat}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all"
          >
            <Plus className="w-5 h-5" /> Buat Laporan Baru
          </motion.button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 bg-white rounded-3xl border border-slate-100 animate-pulse" />
            ))
          : STAT_CARDS.map((s, i) => {
              const Icon = s.icon;
              const value = stats[s.key as keyof UserStats] ?? 0;
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all"
                >
                  <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${s.iconColor}`} />
                  </div>
                  <div className={`text-4xl font-black bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                    {value}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{s.label}</p>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}