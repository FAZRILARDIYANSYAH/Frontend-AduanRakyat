"use client";

import type { StatusType } from "@/hooks/useLaporan";
import { Circle, Eye, Hourglass, CheckCheck, X } from "lucide-react";

export const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  dot: string;
  icon: React.ElementType;
  progress: number;
  ring: string;
}> = {
  menunggu:     { label: "Menunggu",   color: "bg-slate-50 text-slate-500 border border-slate-200",         dot: "bg-slate-400",   ring: "ring-slate-200/60",   icon: Circle,     progress: 10  },
  verifikasi: { label: "Verifikasi", color: "bg-amber-50 text-amber-600 border border-amber-200",         dot: "bg-amber-400",   ring: "ring-amber-200/60",   icon: Eye,        progress: 30  },
  diproses:     { label: "Diproses",   color: "bg-indigo-50 text-indigo-600 border border-indigo-200",      dot: "bg-indigo-500",  ring: "ring-indigo-200/60",  icon: Hourglass,  progress: 65  },
  selesai:      { label: "Selesai",    color: "bg-emerald-50 text-emerald-600 border border-emerald-200",   dot: "bg-emerald-500", ring: "ring-emerald-200/60", icon: CheckCheck, progress: 100 },
  ditolak:      { label: "Ditolak",    color: "bg-red-50 text-red-500 border border-red-200",               dot: "bg-red-400",     ring: "ring-red-200/60",     icon: X,          progress: 0   },
};

export default function StatusBadge({ status }: { status: StatusType | string }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.menunggu;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide ring-1 ${cfg.color} ${cfg.ring} shrink-0`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  );
}