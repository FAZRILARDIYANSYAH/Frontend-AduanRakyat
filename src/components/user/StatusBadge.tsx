"use client";

import type { StatusType } from "@/hooks/useLaporan";
import { Circle, Eye, Hourglass, CheckCheck, X } from "lucide-react";

export const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  dot: string;
  icon: React.ElementType;
  progress: number;
}> = {
  menunggu:     { label: "Menunggu",   color: "bg-slate-100 text-slate-600",     dot: "bg-slate-400",   icon: Circle,     progress: 10  },
  diverifikasi: { label: "Verifikasi", color: "bg-amber-100 text-amber-700",     dot: "bg-amber-500",   icon: Eye,        progress: 30  },
  diproses:     { label: "Diproses",   color: "bg-indigo-100 text-indigo-700",   dot: "bg-indigo-500",  icon: Hourglass,  progress: 65  },
  selesai:      { label: "Selesai",    color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", icon: CheckCheck, progress: 100 },
  ditolak:      { label: "Ditolak",    color: "bg-red-100 text-red-700",         dot: "bg-red-500",     icon: X,          progress: 0   },
};

export default function StatusBadge({ status }: { status: StatusType | string }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.menunggu;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}