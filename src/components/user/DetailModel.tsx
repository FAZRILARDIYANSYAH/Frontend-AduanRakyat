"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { ProgressBar } from "./ReportCard";
import type { UserReport } from "@/hooks/useLaporan";

interface DetailModalProps {
  item: UserReport | null;
  onClose: () => void;
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                Laporan #{item.id}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">{item.judul}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Status & Progress */}
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-500">Status Laporan</span>
                <StatusBadge status={item.status} />
              </div>
              <ProgressBar status={item.status} />
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-400 font-semibold mb-0.5">Kategori</p>
                <p className="font-bold text-slate-800 capitalize">{item.kategori || "-"}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-400 font-semibold mb-0.5">Tanggal</p>
                <p className="font-bold text-slate-800">
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="col-span-2 p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-400 font-semibold mb-0.5">Lokasi</p>
                <p className="font-bold text-slate-800">{item.lokasi || "Tidak dicantumkan"}</p>
              </div>
              {item.instansi && (
                <div className="col-span-2 p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-400 font-semibold mb-0.5">Instansi</p>
                  <p className="font-bold text-slate-800">{item.instansi}</p>
                </div>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Masalah</p>
              <p className="text-sm text-slate-600 leading-relaxed">{item.deskripsi || "-"}</p>
            </div>

            {/* Foto */}
            {item.foto && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Foto Bukti</p>
                <img
                  src={item.foto}
                  alt="Bukti"
                  className="w-full h-48 object-cover rounded-2xl border border-slate-100"
                />
              </div>
            )}

            {/* Tanggapan */}
            {item.tanggapan && (
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                  💬 Tanggapan Instansi
                </p>
                <p className="text-sm text-indigo-800 leading-relaxed">{item.tanggapan}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}