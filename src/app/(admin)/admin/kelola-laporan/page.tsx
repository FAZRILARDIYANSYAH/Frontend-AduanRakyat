"use client";

import { motion } from "framer-motion";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import AdminLaporanTable from "@/components/admin/LaporanTable";

export default function LaporanPage() {
  const {
    laporan,
    loadingLaporan,
    updateStatus,
    deleteLaporan,
  } = useAdminDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-black text-slate-900">
          Semua Laporan
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Kelola dan update status laporan masuk
        </p>
      </div>

      <AdminLaporanTable
        laporan={laporan}
        loading={loadingLaporan}
        onUpdateStatus={updateStatus}
        onDelete={deleteLaporan}
      />
    </motion.div>
  );
}