"use client";

import { motion } from "framer-motion";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useSession } from "next-auth/react";
import { useLaporan } from "@/hooks/useLaporan";

import AdminDashboardSection from "@/components/admin/DashboardSection";

export default function DashboardPage() {
    const { data: session } = useSession(); 

  const {
    stats,
    loadingStats,
  } = useAdminDashboard();

  const { reports } = useLaporan("feed");

  // mapping UserReport -> AdminLaporan
  const dashboardLaporan = reports.map((r) => ({
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
    user_name: r.instansi ?? "User",
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AdminDashboardSection
        stats={stats}
        loading={loadingStats}
        adminName={session?.user?.name?.split(" ")[0] || "Admin"}
        laporan={dashboardLaporan}
      />
    </motion.div>
  );
}