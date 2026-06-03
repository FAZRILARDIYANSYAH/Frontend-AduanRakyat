"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Plus,
  Send,
  RefreshCw,
  Camera,
  MapPin,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Calendar,
  Tag,
  AlignLeft,
} from "lucide-react";


import api from "@/lib/axios";
const MapPicker = dynamic(
  () => import("@/components/MapPicker"),
  {
    ssr: false,
  }
);

// ================= TYPES =================

interface Category {
  id: number;
  name: string;
  description?: string;
}

// ================= TATA CARA =================

const TATA_CARA = [
  { step: "01", title: "Isi Detail Laporan",  desc: "Tulis judul yang jelas, pilih kategori yang sesuai, dan deskripsikan masalah secara lengkap." },
  { step: "02", title: "Sertakan Lokasi",     desc: "Tambahkan alamat atau titik lokasi masalah secara spesifik agar mudah ditemukan petugas." },
  { step: "03", title: "Unggah Foto Bukti",   desc: "Foto pendukung mempercepat verifikasi. Pastikan gambar jelas dan relevan dengan laporan." },
  { step: "04", title: "Kirim & Pantau",      desc: "Setelah terkirim, pantau perkembangan laporan secara real-time melalui dashboard." },
];

// ================= LABEL =================

function FieldLabel({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
      <Icon className="w-3 h-3" />
      {text}
    </label>
  );
}

// ================= COMPONENT =================

export default function FormLaporan({ onSuccess }: { onSuccess: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const [form, setForm] = useState({
    judul_laporan: "",
    category_id: "",
    deskripsi: "",
    lokasi: "",
    tanggal_kejadian: "",
  });

  const [foto, setFoto]       = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef               = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategory(true);
        const res  = await api.get("/categories");
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCategories(data);
      } catch (err) {
        console.log("Fetch category error:", err);
      } finally {
        setLoadingCategory(false);
      }
    };
    fetchCategories();
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Ukuran foto maksimal 5MB"); return; }
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.judul_laporan || !form.category_id || !form.deskripsi || !form.lokasi || !form.tanggal_kejadian) {
      setError("Semua field wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("judul_laporan",   form.judul_laporan);
      fd.append("category_id",     form.category_id);
      fd.append("deskripsi",       form.deskripsi);
      fd.append("lokasi",          form.lokasi);
      fd.append("tanggal_kejadian",form.tanggal_kejadian);
      if (foto) fd.append("foto", foto);
      await api.post("/laporan", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setForm({ judul_laporan: "", category_id: "", deskripsi: "", lokasi: "", tanggal_kejadian: "" });
      setFoto(null); setPreview(null);
      setTimeout(() => { setSuccess(false); onSuccess(); }, 2000);
    } catch (err: any) {
      console.log("Submit laporan error:", err);
      setError(err?.response?.data?.error || "Gagal mengirim laporan");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ judul_laporan: "", category_id: "", deskripsi: "", lokasi: "", tanggal_kejadian: "" });
    setFoto(null); setPreview(null); setError("");
  };

  const inputStyle = "w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/60 outline-none transition-all text-sm font-medium";

  return (
    <div className="mb-8 space-y-5">
      {/* Guide Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-500 shadow-xl shadow-indigo-200/50">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 rounded-full bg-blue-400/20 blur-xl" />

        <div className="relative p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Panduan Membuat Laporan</h2>
              <p className="text-indigo-200 text-xs mt-0.5">Ikuti langkah berikut agar laporan diproses lebih cepat</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TATA_CARA.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="text-3xl font-black text-white/20 mb-2 leading-none">{t.step}</div>
                <h4 className="text-sm font-bold text-white mb-1.5">{t.title}</h4>
                <p className="text-[11px] text-indigo-200/80 leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Plus className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Form Laporan Baru</h3>
            <p className="text-xs text-slate-400 mt-0.5">Isi semua kolom yang tersedia dengan lengkap</p>
          </div>
        </div>

        <div className="p-7">
          {/* Alerts */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-700">Laporan berhasil dikirim!</p>
                  <p className="text-xs text-emerald-600/70 mt-0.5">Anda akan diarahkan kembali ke dashboard.</p>
                </div>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-sm font-bold text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Judul */}
            <div className="md:col-span-2">
              <FieldLabel icon={FileText} text="Judul Laporan" />
              <input
                type="text"
                value={form.judul_laporan}
                onChange={(e) => setForm((f) => ({ ...f, judul_laporan: e.target.value }))}
                placeholder="Masukkan judul laporan yang jelas dan singkat"
                className={inputStyle}
              />
            </div>

            {/* Kategori */}
            <div>
              <FieldLabel icon={Tag} text="Kategori" />
              <div className="relative">
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                  className={`${inputStyle} appearance-none pr-10`}
                >
                  <option value="">{loadingCategory ? "Memuat kategori..." : "Pilih kategori"}</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <FieldLabel icon={Calendar} text="Tanggal Kejadian" />
              <div className="relative">
                <input
                  type="date"
                  value={form.tanggal_kejadian}
                  onChange={(e) => setForm((f) => ({ ...f, tanggal_kejadian: e.target.value }))}
                  className={inputStyle}
                />
              </div>
            </div>

           {/* Lokasi */}
            <div className="md:col-span-2">
              <FieldLabel
                icon={MapPin}
                text="Lokasi"
              />

              <div className="relative mb-4">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />

                <input
                  type="text"
                  value={form.lokasi}
                  readOnly
                  placeholder="Klik lokasi pada map"
                  className={`${inputStyle} pl-10`}
                />
              </div>

              <MapPicker
                onSelectLocation={(
                  lokasi: string
                ) =>
                  setForm((f) => ({
                    ...f,
                    lokasi,
                  }))
                }
              />

              <p className="text-xs text-slate-400 mt-2">
                Klik pada map untuk
                memilih lokasi
                kejadian.
              </p>
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <FieldLabel icon={AlignLeft} text="Deskripsi" />
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
                rows={4}
                placeholder="Jelaskan masalah secara detail agar mudah ditangani petugas..."
                className={`${inputStyle} resize-none`}
              />
            </div>

            {/* Foto */}
            <div className="md:col-span-2">
              <FieldLabel icon={Camera} text="Foto Bukti" />
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/30 rounded-2xl p-6 cursor-pointer transition-all group"
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-full h-52 object-cover rounded-xl" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setFoto(null); setPreview(null); }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-4">
                    <div className="w-14 h-14 bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 transition-all shadow-sm">
                      <Camera className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                      Klik untuk upload foto
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5">PNG, JPG, JPEG · Maks 5MB</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-indigo-400 disabled:to-blue-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-200/70 text-sm"
            >
              {loading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Mengirim laporan...</>
              ) : (
                <><Send className="w-4 h-4" /> Kirim Laporan</>
              )}
            </motion.button>

            <button
              onClick={handleReset}
              className="sm:w-auto px-7 py-4 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}