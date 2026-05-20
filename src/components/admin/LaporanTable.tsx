"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Trash2, X, CheckCircle, AlertCircle,
  MapPin, Calendar, User, Hash, ChevronDown, Save,
  MessageSquare, Image as ImageIcon, RefreshCw, Pencil,
} from "lucide-react";
import StatusBadge, { STATUS_CONFIG, getCategoryIcon } from "./StatusBadge";
import type { AdminLaporan } from "@/types/admin";

const STATUS_OPTIONS = ["menunggu", "verifikasi", "diproses", "selesai", "ditolak"];

// ===================== UPDATE MODAL =====================

interface UpdateModalProps {
  laporan: AdminLaporan;
  onClose: () => void;
  onSave: (id: number, status: string, tanggapan: string) => Promise<void>;
}

function UpdateModal({ laporan, onClose, onSave }: UpdateModalProps) {
  const [status, setStatus] = useState(laporan.status?.toLowerCase() || "menunggu");
  const [tanggapan, setTanggapan] = useState(laporan.tanggapan || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const cat = getCategoryIcon(laporan.kategori);
  const CatIcon = cat.icon;

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      await onSave(laporan.id, status, tanggapan);
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch {
      setError("Gagal menyimpan perubahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 p-6">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-lg">
                  <Hash className="w-3 h-3 text-white/80" />
                  <span className="text-xs font-bold text-white/90">{laporan.id}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/20">
                  <CatIcon className="w-3 h-3 text-white/80" />
                  <span className="text-xs font-bold text-white/90">{laporan.kategori || "Umum"}</span>
                </div>
              </div>
              <h2 className="text-lg font-black text-white leading-snug">{laporan.judul_laporan}</h2>
              {laporan.user_name && (
                <p className="text-indigo-200 text-xs mt-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> {laporan.user_name}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lokasi</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{laporan.lokasi || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tanggal</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {new Date(laporan.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Masalah</p>
            <div className="bg-slate-50 rounded-xl p-3.5 text-sm text-slate-600 leading-relaxed">
              {laporan.deskripsi || "Tidak ada deskripsi."}
            </div>
          </div>

          {laporan.foto && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-3 h-3" /> Foto Bukti
              </p>
              <img src={laporan.foto} alt="Bukti" className="w-full h-40 object-cover rounded-xl border border-slate-100" />
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Update Status</p>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none appearance-none transition-all"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" /> Tanggapan Instansi
            </p>
            <textarea
              value={tanggapan}
              onChange={(e) => setTanggapan(e.target.value)}
              rows={3}
              placeholder="Tulis tanggapan resmi untuk pelapor..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none resize-none transition-all"
            />
          </div>

          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-sm font-bold text-emerald-700">Berhasil disimpan!</p>
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm font-bold text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200/60 text-sm"
          >
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan...</>
              : <><Save className="w-4 h-4" /> Simpan Perubahan</>
            }
          </motion.button>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===================== DELETE CONFIRM =====================

interface DeleteConfirmProps {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function DeleteConfirm({ label, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm"
      >
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-black text-slate-900 text-center">Hapus Laporan?</h3>
        <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
          <span className="font-semibold text-slate-700">"{label}"</span> akan dihapus permanen dan tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm"
          >
            Batal
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Hapus
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===================== LAPORAN ROW =====================

interface LaporanRowProps {
  laporan: AdminLaporan;
  onUpdate: (l: AdminLaporan) => void;
  onDelete: (l: AdminLaporan) => void;
}

function LaporanRow({ laporan, onUpdate, onDelete }: LaporanRowProps) {
  const cat = getCategoryIcon(laporan.kategori);
  const CatIcon = cat.icon;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-slate-100 hover:bg-indigo-50/30 transition-colors"
    >
      {/* Laporan */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${cat.bg} rounded-xl flex items-center justify-center shrink-0`}>
            <CatIcon className={`w-4 h-4 ${cat.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{laporan.judul_laporan}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{laporan.kategori || "Umum"} · #{laporan.id}</p>
          </div>
        </div>
      </td>

      {/* Pelapor */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black text-indigo-600">
              {laporan.user_name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium">{laporan.user_name || "—"}</p>
        </div>
      </td>

      {/* Lokasi */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
          <span className="truncate max-w-[120px]">{laporan.lokasi || "—"}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <StatusBadge status={laporan.status} />
      </td>

      {/* Tanggal */}
      <td className="px-4 py-4">
        <p className="text-xs text-slate-400">
          {new Date(laporan.created_at).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </p>
      </td>

      {/* Aksi — selalu terlihat */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdate(laporan)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 text-xs font-bold rounded-xl transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Update
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(laporan)}
            className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}

// ===================== MAIN TABLE =====================

interface AdminLaporanTableProps {
  laporan: AdminLaporan[];
  loading: boolean;
  onUpdateStatus: (id: number, status: string, tanggapan: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function AdminLaporanTable({
  laporan, loading, onUpdateStatus, onDelete,
}: AdminLaporanTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [updateTarget, setUpdateTarget] = useState<AdminLaporan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminLaporan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    return laporan.filter((l) => {
      const matchSearch =
        l.judul_laporan?.toLowerCase().includes(search.toLowerCase()) ||
        l.user_name?.toLowerCase().includes(search.toLowerCase()) ||
        l.lokasi?.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        filterStatus === "semua" || l.status?.toLowerCase() === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [laporan, search, filterStatus]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await onDelete(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Manajemen Laporan</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {filtered.length} laporan ditemukan
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari laporan..."
                className="pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all w-48"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-4 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 outline-none appearance-none font-medium text-slate-700 transition-all"
              >
                <option value="semua">Semua Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{STATUS_CONFIG[s]?.label}</option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Laporan</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pelapor</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lokasi</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded-lg animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Search className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-semibold text-sm">Tidak ada laporan ditemukan</p>
                    <p className="text-slate-300 text-xs mt-1">Coba ubah filter atau kata kunci pencarian</p>
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <LaporanRow
                    key={l.id}
                    laporan={l}
                    onUpdate={setUpdateTarget}
                    onDelete={setDeleteTarget}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {updateTarget && (
          <UpdateModal
            laporan={updateTarget}
            onClose={() => setUpdateTarget(null)}
            onSave={onUpdateStatus}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            label={deleteTarget.judul_laporan}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}