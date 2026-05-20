"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Building2, Tag, ImageIcon, MessageSquare, Hash } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { ProgressBar } from "./ReportCard";
import type { UserReport } from "@/hooks/useLaporan";

interface DetailModalProps {
  item: UserReport | null;
  onClose: () => void;
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-slate-800 capitalize">{value}</p>
      </div>
    </div>
  );
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.97 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full sm:max-w-xl max-h-[92vh] overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 p-6 shrink-0">
            {/* Decorative */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-20 w-20 h-20 rounded-full bg-blue-400/20" />

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-lg">
                    <Hash className="w-3 h-3 text-white/80" />
                    <span className="text-xs font-bold text-white/90 tracking-wider">{item.id}</span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <h2 className="text-xl font-black text-white leading-snug">{item.judul}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors shrink-0 mt-0.5"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Progress */}
            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Progres Laporan</p>
              <ProgressBar status={item.status} />
            </div>

            {/* Detail Grid */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Informasi Laporan</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow icon={Tag} label="Kategori" value={item.kategori || "Tidak dikategorikan"} />
                <DetailRow
                  icon={Calendar}
                  label="Tanggal"
                  value={new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                />
                <div className="sm:col-span-2">
                  <DetailRow icon={MapPin} label="Lokasi" value={item.lokasi || "Tidak dicantumkan"} />
                </div>
                {item.instansi && (
                  <div className="sm:col-span-2">
                    <DetailRow icon={Building2} label="Instansi" value={item.instansi} />
                  </div>
                )}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Deskripsi Masalah</p>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-sm text-slate-600 leading-relaxed">{item.deskripsi || "-"}</p>
              </div>
            </div>

            {/* Foto */}
            {item.foto && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foto Bukti</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-100">
                  <img
                    src={item.foto}
                    alt="Bukti"
                    className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            )}

            {/* Tanggapan */}
            {item.tanggapan && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50/60 rounded-2xl border border-indigo-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Tanggapan Instansi</p>
                </div>
                <p className="text-sm text-indigo-800/80 leading-relaxed">{item.tanggapan}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}