"use client";

import { motion } from "framer-motion";
import { MapPin, MessageSquare } from "lucide-react";
import StatusBadge, { STATUS_CONFIG } from "./StatusBadge";
import type { UserReport } from "@/hooks/useLaporan";

interface ReportCardProps {
  report: UserReport;
  onClick?: (report: UserReport) => void;
}

function ProgressBar({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.menunggu;
  const steps = ["menunggu", "diverifikasi", "diproses", "selesai"];
  const current = steps.indexOf(status?.toLowerCase());

  return (
    <div className="mt-4">
      <div className="flex justify-between mb-2">
        {steps.map((s, i) => {
          const sc = STATUS_CONFIG[s];
          const done = i <= current && status?.toLowerCase() !== "ditolak";
          return (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                done ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-semibold ${done ? "text-indigo-600" : "text-slate-400"}`}>
                {sc.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: status?.toLowerCase() === "ditolak" ? "0%" : `${cfg.progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export { ProgressBar };

export default function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => onClick?.(report)}
      className="group bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
            #{report.id} · {report.kategori || "Umum"}
          </span>
          <h3 className="font-bold text-slate-800 mt-1 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
            {report.judul}
          </h3>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <ProgressBar status={report.status} />

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[150px]">{report.lokasi || "Lokasi tidak tersedia"}</span>
        </div>
        <span className="text-xs text-slate-400">
          {new Date(report.createdAt).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>
      </div>

      {report.tanggapan && (
        <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 mb-1">
            <MessageSquare className="w-3 h-3" /> Tanggapan Instansi
          </div>
          <p className="text-xs text-indigo-700 line-clamp-2">{report.tanggapan}</p>
        </div>
      )}
    </motion.div>
  );
}