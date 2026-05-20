"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, X, CheckCircle, AlertCircle,
  RefreshCw, Save, Tag, ChevronDown,
} from "lucide-react";
import { getCategoryIcon } from "./StatusBadge";
import type { AdminCategory } from "@/types/admin";

// ===================== FORM MODAL =====================

interface CategoryFormProps {
  initial?: AdminCategory;
  onClose: () => void;
  onSave: (name: string, description: string) => Promise<void>;
}

function CategoryForm({ initial, onClose, onSave }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initial;
  const preview = getCategoryIcon(name);
  const PreviewIcon = preview.icon;

  const handleSave = async () => {
    if (!name.trim()) { setError("Nama kategori wajib diisi."); return; }
    try {
      setLoading(true);
      setError("");
      await onSave(name, description);
      setSuccess(true);
      setTimeout(onClose, 1000);
    } catch {
      setError("Gagal menyimpan kategori.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-blue-500 p-6">
          <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">{isEdit ? "Edit Kategori" : "Tambah Kategori"}</h2>
                <p className="text-indigo-200 text-xs mt-0.5">{isEdit ? "Ubah nama dan deskripsi" : "Buat kategori baru"}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Preview icon */}
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className={`w-10 h-10 ${preview.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <PreviewIcon className={`w-5 h-5 ${preview.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Preview Icon</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{name || "Nama kategori"}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Kategori *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="cth: Infrastruktur, Pengaduan, Air Bersih..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium"
            />
            <p className="text-[10px] text-slate-400 mt-1.5">Icon akan menyesuaikan nama secara otomatis</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Deskripsi singkat kategori ini..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none resize-none transition-all"
            />
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-sm font-bold text-emerald-700">Berhasil disimpan!</p>
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl">
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
            className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-200/50 transition-all"
          >
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> {isEdit ? "Simpan Perubahan" : "Tambah Kategori"}</>}
          </motion.button>
          <button onClick={onClose} className="px-5 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all text-sm">
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===================== DELETE CONFIRM =====================

function DeleteCategoryConfirm({ name, onConfirm, onCancel, loading }: { name: string; onConfirm: () => void; onCancel: () => void; loading?: boolean }) {
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
        <h3 className="text-base font-black text-slate-900 text-center">Hapus Kategori?</h3>
        <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
          Kategori <span className="font-bold text-slate-700">"{name}"</span> akan dihapus. Laporan yang menggunakan kategori ini mungkin terpengaruh.
        </p>
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 text-sm transition-all">Batal</button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm transition-all"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Hapus
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===================== CATEGORY CARD =====================

function CategoryCard({ category, onEdit, onDelete }: { category: AdminCategory; onEdit: (c: AdminCategory) => void; onDelete: (c: AdminCategory) => void }) {
  const cat = getCategoryIcon(category.name);
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/40 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`w-11 h-11 ${cat.bg} rounded-xl flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${cat.color}`} />
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category)}
            className="w-8 h-8 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <h4 className="font-black text-slate-800 capitalize">{category.name}</h4>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
        {category.description || "Tidak ada deskripsi"}
      </p>
      <div className="mt-3 pt-3 border-t border-slate-50">
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">ID #{category.id}</span>
      </div>
    </motion.div>
  );
}

// ===================== MAIN =====================

interface AdminCategoryManagerProps {
  categories: AdminCategory[];
  loading: boolean;
  onCreate: (name: string, description: string) => Promise<void>;
  onUpdate: (id: number, name: string, description: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function AdminCategoryManager({ categories, loading, onCreate, onUpdate, onDelete }: AdminCategoryManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState(false);

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
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Manajemen Kategori</h3>
            <p className="text-xs text-slate-400 mt-0.5">{categories.length} kategori tersedia</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" /> Tambah Kategori
          </motion.button>
        </div>

        {/* Grid */}
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-36 bg-slate-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Tag className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-slate-400 font-semibold text-sm">Belum ada kategori</p>
              <p className="text-slate-300 text-xs mt-1">Klik tombol di atas untuk menambah kategori</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((c) => (
                <CategoryCard
                  key={c.id}
                  category={c}
                  onEdit={setEditTarget}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <CategoryForm
            onClose={() => setShowCreate(false)}
            onSave={onCreate}
          />
        )}
        {editTarget && (
          <CategoryForm
            initial={editTarget}
            onClose={() => setEditTarget(null)}
            onSave={(name, desc) => onUpdate(editTarget.id, name, desc)}
          />
        )}
        {deleteTarget && (
          <DeleteCategoryConfirm
            name={deleteTarget.name}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}