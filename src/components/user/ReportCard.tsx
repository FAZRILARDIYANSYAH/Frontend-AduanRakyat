"use client";

import { motion } from "framer-motion";
import { MapPin, MessageSquare, ArrowUpRight } from "lucide-react";
import StatusBadge, { STATUS_CONFIG } from "./StatusBadge";
import type { UserReport } from "@/hooks/useLaporan";

interface ReportCardProps {
  report: UserReport;
  onClick?: (report: UserReport) => void;
}
  
function ProgressBar({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.menunggu;
  const steps = ["menunggu", "verifikasi", "diproses", "selesai"];
  const current = steps.indexOf(status?.toLowerCase());
  const isRejected = status?.toLowerCase() === "ditolak";

  return (
    <div className="mt-5">
      <div className="flex items-center gap-1 mb-3">
        {steps.map((s, i) => {
          const done = !isRejected && i <= current;
          const active = !isRejected && i === current;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border-2 transition-all duration-500 ${
                    done
                      ? active
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {done && !active ? "✓" : i + 1}
                </div>
                <span className={`text-[8px] font-bold tracking-wide whitespace-nowrap ${done ? "text-indigo-600" : "text-slate-300"}`}>
                  {STATUS_CONFIG[s]?.label}
                </span>
              </div>
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-1 mb-4 transition-all duration-700 ${
                  !isRejected && i < current ? "bg-indigo-400" : "bg-slate-150 bg-slate-200"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ProgressBar };

export default function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={() => onClick?.(report)}
      className="group relative bg-white rounded-2xl border border-slate-100 p-5 cursor-pointer hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300 overflow-hidden"
    >
      {/* Subtle top accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              #{report.id}
            </span>
            {report.kategori && (
              <>
                <span className="text-slate-200">·</span>
                <span className="text-[10px] font-semibold text-slate-400 capitalize">{report.kategori}</span>
              </>
            )}
          </div>
          <h3 className="font-bold text-slate-800 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2 text-sm pr-2">
            {report.judul}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={report.status} />
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
        </div>
      </div>

      {/* Progress */}
      <ProgressBar status={report.status} />

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-3.5 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="w-5 h-5 bg-slate-50 rounded-lg flex items-center justify-center">
            <MapPin className="w-3 h-3" />
          </div>
          <span className="truncate max-w-[150px]">{report.lokasi || "Lokasi tidak tersedia"}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {new Date(
            report.tanggal_kejadian || report.createdAt
          ).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Tanggapan */}
      {report.tanggapan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-3.5 bg-gradient-to-br from-indigo-50 to-blue-50/50 rounded-xl border border-indigo-100/70"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 mb-1.5 uppercase tracking-wider">
            <MessageSquare className="w-3 h-3" /> Tanggapan Instansi
          </div>
          <p className="text-xs text-indigo-700/80 line-clamp-2 leading-relaxed">{report.tanggapan}</p>
        </motion.div>
      )}
    </motion.div>
  );
}