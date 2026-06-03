"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, User, FileSearch, ImageOff, MessageSquare, ChevronRight } from "lucide-react";
import api from "@/lib/axios";
import StatusBadge from "./StatusBadge";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-slate-50/80 to-transparent" />
      <div className="flex justify-between"><div className="w-32 h-4 rounded bg-slate-100" /><div className="w-16 h-5 rounded-full bg-slate-100" /></div>
      <div className="w-full h-3 rounded bg-slate-100/70" />
      <div className="w-2/3 h-3 rounded bg-slate-100/60" />
    </div>
  );
}

export default function MonitoringLaporan() {
  const [laporan, setLaporan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchLaporan = async () => {
    try {
      const res = await api.get("/laporan");
      setLaporan(res.data);
      if (res.data.length > 0) {
        setSelectedItem(res.data[0]); // Set laporan pertama sebagai default detail
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-1">
      {/* HEADER UTAMA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Monitoring Laporan
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Pusat kendali dan pengawasan laporan masuk masyarakat.</p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 align-middle self-start sm:self-center">
          <FileSearch className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-bold text-indigo-600 tabular-nums">
            {loading ? "—" : laporan.length} Total Laporan
          </span>
        </div>
      </div>

      {/* LAYOUT UTAMA: 2 KOLOM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* KOLOM KIRI: DAFTAR LAPORAN (7/12) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arsip Masuk</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : laporan.length === 0 ? (
              <div className="sm:col-span-2 flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
                <FileSearch className="w-12 h-12 text-slate-300 mb-2" strokeWidth={1.5} />
                <p className="text-sm font-medium text-slate-400">Belum ada laporan terkini</p>
              </div>
            ) : (
              laporan.map((item, i) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-4 bg-white ${
                      isSelected 
                        ? "border-indigo-500 shadow-md shadow-indigo-50/50 ring-1 ring-indigo-500/20" 
                        : "border-slate-100 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Thumbnail Kecil di Kiri */}
                    <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.foto ? (
                        <img src={item.foto} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <ImageOff className="w-4 h-4 text-slate-300" />
                      )}
                    </div>

                    {/* Ringkasan Konten */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h2 className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                            {item.judul_laporan}
                          </h2>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mb-2">{item.deskripsi}</p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-medium text-slate-600 truncate max-w-[120px]">{item.user_name}</span>
                        <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 shrink-0">{item.kategori}</span>
                      </div>
                    </div>

                    {/* Dekorasi Indikator Aktif */}
                    <ChevronRight className={`w-4 h-4 self-center transition-transform text-slate-300 ${isSelected ? "text-indigo-500 translate-x-1" : "group-hover:translate-x-0.5"}`} />
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* KOLOM KANAN: PREVIEW & DETAIL INTENS (5/12) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pratinjau Detail</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Image Section (Mewah) */}
                {selectedItem.foto ? (
                  <div className="w-full h-48 bg-slate-900 relative border-b border-slate-100">
                    <img src={selectedItem.foto} alt="Detail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-9s00/40 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-slate-50 border-b border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <ImageOff className="w-6 h-6 text-slate-300" />
                    <span className="text-xs">Laporan ini tidak melampirkan foto pendukung</span>
                  </div>
                )}

                {/* Main Body Info */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                        {selectedItem.kategori}
                      </span>
                      <StatusBadge status={selectedItem.status} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 leading-snug">{selectedItem.judul_laporan}</h2>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 block">Pelapor</span>
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{selectedItem.user_name}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 block">Lokasi Kejadian</span>
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{selectedItem.lokasi}</span>
                      </div>
                    </div>
                  </div>

                  {/* Konten Utama */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Kronologi / Deskripsi</span>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/30 p-3 rounded-xl border border-slate-100/70 whitespace-pre-line">
                      {selectedItem.deskripsi}
                    </p>
                  </div>

                  {/* Bagian Tanggapan Admin */}
                  <div className="pt-2">
                    {selectedItem.tanggapan ? (
                      <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                            Respon & Tindakan Resmi
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{selectedItem.tanggapan}</p>
                      </div>
                    ) : (
                      <div className="bg-amber-50/40 border border-amber-100/60 rounded-xl p-4 flex gap-2.5 items-start">
                        <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-amber-700 uppercase tracking-wide block mb-0.5">Menunggu Tindakan</span>
                          <p className="text-xs text-amber-600/90 leading-normal">Belum ada tanggapan resmi yang dikeluarkan untuk laporan ini.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 h-64 flex flex-col items-center justify-center">
                <FileSearch className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs">Pilih salah satu laporan di sebelah kiri untuk melihat visualisasi detail lengkap.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}