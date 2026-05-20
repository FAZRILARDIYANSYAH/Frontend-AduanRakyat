"use client";

import {
  Circle, Eye, Hourglass, CheckCheck, X,
  Road, Megaphone, FlaskConical, Droplets, Zap,
  Trash2, Trees, Heart, ShieldAlert, Home,
} from "lucide-react";
import type { StatusType } from "@/types/admin";

// ===================== STATUS CONFIG =====================

export const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  dot: string;
  icon: React.ElementType;
  progress: number;
}> = {
  menunggu:     { label: "Menunggu",   color: "bg-slate-50 text-slate-500 border border-slate-200",       dot: "bg-slate-400",   icon: Circle,     progress: 10  },
  verifikasi:   { label: "Verifikasi", color: "bg-amber-50 text-amber-600 border border-amber-200",       dot: "bg-amber-400",   icon: Eye,        progress: 30  },
  diproses:     { label: "Diproses",   color: "bg-indigo-50 text-indigo-600 border border-indigo-200",    dot: "bg-indigo-500",  icon: Hourglass,  progress: 65  },
  selesai:      { label: "Selesai",    color: "bg-emerald-50 text-emerald-600 border border-emerald-200", dot: "bg-emerald-500", icon: CheckCheck, progress: 100 },
  ditolak:      { label: "Ditolak",    color: "bg-red-50 text-red-500 border border-red-200",             dot: "bg-red-400",     icon: X,          progress: 0   },
};

export default function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.menunggu;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide ring-1 ring-current/10 shrink-0 ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ===================== CATEGORY ICON MAP =====================

export const CATEGORY_ICON_MAP: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  infrastruktur: { icon: Road,        color: "text-blue-600",    bg: "bg-blue-50"    },
  pengaduan:     { icon: Megaphone,   color: "text-violet-600",  bg: "bg-violet-50"  },
  test:          { icon: FlaskConical,color: "text-slate-500",   bg: "bg-slate-100"  },
  "air bersih":  { icon: Droplets,    color: "text-cyan-600",    bg: "bg-cyan-50"    },
  listrik:       { icon: Zap,         color: "text-yellow-600",  bg: "bg-yellow-50"  },
  kebersihan:    { icon: Trash2,       color: "text-emerald-600", bg: "bg-emerald-50" },
  lingkungan:    { icon: Trees,        color: "text-green-600",   bg: "bg-green-50"   },
  kesehatan:     { icon: Heart,        color: "text-rose-600",    bg: "bg-rose-50"    },
  keamanan:      { icon: ShieldAlert,  color: "text-orange-600",  bg: "bg-orange-50"  },
  perumahan:     { icon: Home,         color: "text-indigo-600",  bg: "bg-indigo-50"  },
};

export function getCategoryIcon(name: string) {
  const key = name?.toLowerCase();
  return (
    CATEGORY_ICON_MAP[key] ??
    { icon: Megaphone, color: "text-slate-500", bg: "bg-slate-100" }
  );
}