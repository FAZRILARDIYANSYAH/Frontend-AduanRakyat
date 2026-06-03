"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  FileText,
  CheckCheck,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState } from "react";

import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { signOut, useSession } from "next-auth/react";
import { useLaporan } from "@/hooks/useLaporan";
import { getCategoryIcon, STATUS_CONFIG } from "@/components/admin/StatusBadge";
import type { AdminStats, AdminLaporan } from "@/types/admin";

// ─── SuperAdminStats extends AdminStats dengan users & admins ────────
interface SuperAdminStats extends AdminStats {
  users?: number;
  admins?: number;

  monthly?: {
    users?: { bulan: string; val: number }[];
    admins?: { bulan: string; val: number }[];
    total?: { bulan: string; val: number }[];
    selesai?: { bulan: string; val: number }[];
    ditolak?: { bulan: string; val: number }[];
    verifikasi?: { bulan: string; val: number }[];
    diproses?: { bulan: string; val: number }[];
  };

  sparkline?: {
    users?: { v: number }[];
    admins?: { v: number }[];
    total?: { v: number }[];
    selesai?: { v: number }[];
    ditolak?: { v: number }[];
    verifikasi?: { v: number }[];
    diproses?: { v: number }[];
  };
}

// ─── stat card config ────────────────────────────────────────────────
const STAT_CARDS = [
  {
    key: "users",
    label: "Total Users",
    icon: Users,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    accentColor: "#4F46E5",
    trend: { value: "+12.5%", dir: "up", label: "vs bulan lalu" },
  },
  {
    key: "admins",
    label: "Total Admin",
    icon: ShieldCheck,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
    accentColor: "#0284C7",
    trend: { value: "+2.1%", dir: "up", label: "vs bulan lalu" },
  },
  {
    key: "total",
    label: "Total Laporan",
    icon: FileText,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    accentColor: "#7C3AED",
    trend: { value: "+8.4%", dir: "up", label: "vs bulan lalu" },
  },
  {
    key: "selesai",
    label: "Laporan Selesai",
    icon: CheckCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    accentColor: "#059669",
    trend: { value: "+24.7%", dir: "up", label: "vs bulan lalu" },
  },
  {
    key: "ditolak",
    label: "Laporan Ditolak",
    icon: X,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    accentColor: "#DC2626",
    trend: { value: "Stabil", dir: "neutral", label: "" },
  },
];

// ─── fallback sparkline (dipakai kalau backend belum return data) ────
const FALLBACK_SPARKLINE: Record<string, { v: number }[]> = {
  users:   [4, 7, 5, 9, 8, 12, 11, 14, 13, 18, 15, 20].map((v) => ({ v })),
  admins:  [1, 1, 2, 2, 2, 3,  3,  3,  4,  4,  4,  5 ].map((v) => ({ v })),
  total:   [4, 7, 5, 9, 8, 12, 11, 14, 13, 18, 15, 20].map((v) => ({ v })),
  selesai: [3, 5, 4, 8, 7, 10, 9,  12, 11, 14, 13, 16].map((v) => ({ v })),
  ditolak: [1, 2, 1, 2, 1, 2,  2,  1,  2,  1,  2,  2 ].map((v) => ({ v })),
};

// ─── fallback monthly chart ──────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const FALLBACK_MONTHLY: Record<string, { bulan: string; val: number }[]> = {
  users:   [12,15,14,18,20,24,22,27,29,32,35,40].map((val, i) => ({ bulan: MONTHS[i], val })),
  admins:  [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5 ].map((val, i) => ({ bulan: MONTHS[i], val })),
  total:   [14,18,15,22,25,30,28,32,35,38,44,48].map((val, i) => ({ bulan: MONTHS[i], val })),
  selesai: [10,13,12,18,20,24,22,27,29,32,34,36].map((val, i) => ({ bulan: MONTHS[i], val })),
  ditolak: [1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2 ].map((val, i) => ({ bulan: MONTHS[i], val })),
};

// ─── chart tabs ──────────────────────────────────────────────────────
const CHART_TABS = [
  { key: "users",   label: "User",   color: "#4F46E5" },
  { key: "admins",  label: "Admin",   color: "#0284C7" },
  { key: "total",   label: "Laporan", color: "#7C3AED" },
  { key: "selesai", label: "Selesai", color: "#059669" },
  { key: "ditolak", label: "Ditolak", color: "#DC2626" },
] as const;

type ChartTabKey = typeof CHART_TABS[number]["key"];

// ─── donut config ────────────────────────────────────────────────────
const STATUS_COLORS = [
  { label: "Verifikasi", color: "#4F46E5" },
  { label: "Diproses",   color: "#7C3AED" },
  { label: "Selesai",    color: "#059669" },
  { label: "Ditolak",    color: "#DC2626" },
];

// ─── monthly goals ───────────────────────────────────────────────────
const GOALS = [
  { label: "Laporan Diselesaikan",     color: "#4F46E5", target: 41, statKey: "selesai" },
  { label: "Pengguna Baru Terdaftar",  color: "#059669", target: 50, statKey: "users"   },
  { label: "Tingkat Penolakan Rendah", color: "#D97706", target: 4,  statKey: "ditolak" },
];

// ─── skeleton ────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="h-[150px] bg-white rounded-2xl border border-slate-100 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-50 to-transparent" />
    </div>
  );
}

// ─── trend icon ──────────────────────────────────────────────────────
function TrendIcon({ dir }: { dir: string }) {
  if (dir === "up")   return <TrendingUp   className="w-3 h-3" />;
  if (dir === "down") return <TrendingDown className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
}

// ─── sparkline ───────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: { v: number }[]; color: string }) {
  const gradId = `spark-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── main component ──────────────────────────────────────────────────
export default function DashboardSection() {
  const [activeTab, setActiveTab] = useState<ChartTabKey>("users");

  // ── Pakai hook yang sama dengan admin, cukup pass role="superadmin" ─
  const { stats: rawStats, loadingStats } = useAdminDashboard("superadmin");
  const { data: session } = useSession(); 
  const { reports } = useLaporan("feed");

  // Cast ke SuperAdminStats supaya bisa akses users & admins
  const stats = rawStats as SuperAdminStats;

  // Mapping UserReport → AdminLaporan (sama persis dengan admin DashboardPage)
  const laporan: AdminLaporan[] = reports.map((r: any) => ({
  id: Number(r.id),
  judul_laporan: r.judul,
  kategori: r.kategori,
  deskripsi: r.deskripsi,
  lokasi: r.lokasi,
  status: r.status,
  foto: r.foto ?? null,
  tanggapan: r.tanggapan ?? null,
  tanggapan_at: null,
  created_at: r.createdAt,
  tanggal_kejadian: r.tanggal_kejadian ?? null,
  user_name: r.user_name ?? "User",
}));
const firstName =
  session?.user?.name?.split(" ")[0] || "Super Admin";
  const activeChart = CHART_TABS.find((t) => t.key === activeTab)!;

  // Nilai stat per key (users & admins dari field extra backend)
  const getStatValue = (key: string): number => {
    if (key === "users")   return stats.users   ?? 0;
    if (key === "admins")  return stats.admins  ?? 0;
    return (stats[key as keyof AdminStats] as number) ?? 0;
  };

  const resolusiRate = stats.total > 0
    ? Math.round(((stats.selesai ?? 0) / stats.total) * 100)
    : 0;

  // Sparkline: ambil dari backend kalau ada, fallback ke dummy
  const sparklineData: Record<string, { v: number }[]> = {
    users:   stats.sparkline?.users   ?? FALLBACK_SPARKLINE.users,
    admins:  stats.sparkline?.admins  ?? FALLBACK_SPARKLINE.admins,
    total:   stats.sparkline?.total   ?? FALLBACK_SPARKLINE.total,
    selesai: stats.sparkline?.selesai    ?? FALLBACK_SPARKLINE.selesai,
    ditolak: stats.sparkline?.ditolak    ?? FALLBACK_SPARKLINE.ditolak,
  };

  // Monthly chart: ambil dari backend kalau ada, fallback ke dummy
 const monthlyData: Record<ChartTabKey, { bulan: string; val: number }[]> = {
  users:   stats.monthly?.users    ?? FALLBACK_MONTHLY.users,
  admins:  stats.monthly?.admins   ?? FALLBACK_MONTHLY.admins,
  total:   stats.monthly?.total    ?? FALLBACK_MONTHLY.total,
  selesai: stats.monthly?.selesai  ?? FALLBACK_MONTHLY.selesai,
  ditolak: stats.monthly?.ditolak  ?? FALLBACK_MONTHLY.ditolak,
};

  // Donut — distribusi status laporan (sama dengan admin)
  const donutData = [
    { name: "Verifikasi", value: stats.verifikasi ?? 0 },
    { name: "Diproses",   value: stats.diproses   ?? 0 },
    { name: "Selesai",    value: stats.selesai    ?? 0 },
    { name: "Ditolak",    value: stats.ditolak    ?? 0 },
  ];
  const donutTotal = stats.total ?? 0;

  return (
    <div className="space-y-5 mb-8">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 p-7 shadow-xl shadow-indigo-200/50">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -bottom-10 right-20 w-28 h-28 rounded-full bg-blue-400/20" />
        <div className="absolute top-6 right-40 w-5 h-5 rounded-full bg-white/20" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2.5 py-1 bg-white/20 rounded-lg flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-white/80" />
                <span className="text-[11px] font-bold text-white/90">SUPER ADMIN PANEL</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Halo, {firstName}!
            </h1>
            <p className="text-indigo-200/80 mt-1.5 text-sm">
              Pantau statistik sistem secara keseluruhan.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-3">
            {[
              { num: loadingStats ? "—" : (stats.users  ?? 0),        lbl: "Total Users"  },
              { num: loadingStats ? "—" : (stats.admins ?? 0),        lbl: "Total Admin"  },
              { num: loadingStats ? "—" : `${resolusiRate}%`,         lbl: "Diselesaikan" },
            ].map(({ num, lbl }) => (
              <div
                key={lbl}
                className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/20"
              >
                <p className="text-2xl font-black text-white">{num}</p>
                <p className="text-[11px] text-indigo-200 mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {loadingStats
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : STAT_CARDS.map((s, i) => {
              const Icon      = s.icon;
              const value     = getStatValue(s.key);
              const sparkData = sparklineData[s.key] ?? FALLBACK_SPARKLINE[s.key];
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="flex items-start justify-between px-5 pt-5 pb-2">
                    <p className="text-xs text-slate-400 font-semibold tracking-wide leading-tight">
                      {s.label}
                    </p>
                    <div className={`w-9 h-9 ${s.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 ml-2`}>
                      <Icon className={`w-4 h-4 ${s.iconColor}`} />
                    </div>
                  </div>
                  <div className="px-5 pb-1">
                    <div className="text-3xl font-black text-slate-800 leading-none">
                      {value}
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-1.5 text-[11px] font-medium ${
                        s.trend.dir === "up"
                          ? "text-emerald-500"
                          : s.trend.dir === "down"
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}
                    >
                      <TrendIcon dir={s.trend.dir} />
                      <span>{s.trend.value}</span>
                      {s.trend.label && (
                        <span className="text-slate-400 font-normal">{s.trend.label}</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Sparkline data={sparkData} color={s.accentColor} />
                  </div>
                </motion.div>
              );
            })}
      </div>

      {/* ── Bottom: 2-kolom layout ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "16px",
          alignItems: "start",
        }}
        className="max-lg:!grid-cols-1"
      >
        {/* ── Kolom Kiri: Chart + Laporan Terbaru ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Ikhtisar Sistem */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <p className="text-sm font-semibold text-slate-800">Ikhtisar Sistem</p>
                <p className="text-xs text-slate-400 mt-0.5">Performa bulanan sepanjang tahun</p>
              </div>
              <div className="flex gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1 flex-shrink-0">
                {CHART_TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                      activeTab === t.key
                        ? "text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                    style={activeTab === t.key ? { background: t.color } : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={monthlyData[activeTab]}
                margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
              >
                <defs>
                  <linearGradient id="areaGradMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={activeChart.color} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={activeChart.color} stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#475569", fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke={activeChart.color}
                  strokeWidth={2}
                  fill="url(#areaGradMain)"
                  dot={false}
                  activeDot={{ r: 5, fill: activeChart.color, strokeWidth: 0 }}
                  name="Jumlah"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Laporan Terbaru — persis sama dengan admin */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Laporan Terbaru</p>
                <p className="text-xs text-slate-400 mt-0.5">5 laporan masuk terakhir</p>
              </div>
            </div>

            {loadingStats ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : laporan.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <FileText className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">Belum ada laporan masuk</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {laporan.slice(0, 5).map((item, i) => {
                  const catCfg    = getCategoryIcon(item.kategori);
                  const CatIcon   = catCfg.icon;
                  const statusCfg = STATUS_CONFIG[item.status?.toLowerCase()] ?? STATUS_CONFIG.menunggu;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${catCfg.bg}`}>
                        <CatIcon className={`w-4 h-4 ${catCfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate capitalize">
                          {item.judul_laporan}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.kategori} · #{item.id} · {item.user_name ?? "—"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold flex-shrink-0 ${statusCfg.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Kolom Kanan: Status Laporan + Target Bulanan ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="min-w-0">

          {/* Status Laporan — donut sama persis dengan admin */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Status Laporan</p>
            <p className="text-xs text-slate-400 mt-0.5 mb-5">Distribusi seluruh laporan</p>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <PieChart width={120} height={120}>
                  <Pie
                    data={donutData}
                    cx={60} cy={60}
                    innerRadius={38} outerRadius={56}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {donutData.map((_, idx) => (
                      <Cell key={idx} fill={STATUS_COLORS[idx].color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-800 leading-none">
                    {loadingStats ? "—" : donutTotal}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Laporan</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                {donutData.map((d, idx) => {
                  const pct = donutTotal > 0
                    ? Math.round((d.value / donutTotal) * 100)
                    : 0;
                  return (
                    <div key={d.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                          style={{ background: STATUS_COLORS[idx].color }}
                        />
                        <span className="text-xs text-slate-500 truncate">{d.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 flex-shrink-0">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Target Bulanan */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Target Bulanan</p>
            <p className="text-xs text-slate-400 mt-0.5 mb-5">Progres menuju target</p>
            <div className="space-y-5">
              {GOALS.map((g) => {
                const actual = getStatValue(g.statKey);
                const pct    = Math.round(Math.min((actual / g.target) * 100, 100));
                return (
                  <div key={g.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600">{g.label}</span>
                      <span className="text-xs font-bold text-slate-700">{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: g.color }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[11px] text-slate-400">{actual}</span>
                      <span className="text-[11px] text-slate-400">Target: {g.target}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}