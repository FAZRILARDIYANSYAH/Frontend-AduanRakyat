"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

import api from "@/lib/axios";

// ================= TYPES =================

interface Category {
  id: number;
  name: string;
  description?: string;
}

// ================= TATA CARA =================

const TATA_CARA = [
  {
    step: "01",
    title: "Isi Detail Laporan",
    desc: "Tulis judul yang jelas, pilih kategori yang sesuai, dan deskripsikan masalah secara lengkap.",
  },
  {
    step: "02",
    title: "Sertakan Lokasi",
    desc: "Tambahkan alamat atau titik lokasi masalah secara spesifik agar mudah ditemukan petugas.",
  },
  {
    step: "03",
    title: "Unggah Foto Bukti",
    desc: "Foto pendukung mempercepat verifikasi. Pastikan gambar jelas dan relevan dengan laporan.",
  },
  {
    step: "04",
    title: "Kirim & Pantau",
    desc: "Setelah terkirim, pantau perkembangan laporan secara real-time melalui dashboard.",
  },
];

// ================= COMPONENT =================

export default function FormLaporan({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  // ================= CATEGORY =================

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // ================= FORM =================

  const [form, setForm] = useState({
    judul_laporan: "",
    category_id: "",
    deskripsi: "",
    lokasi: "",
  });

  // ================= STATE =================

  const [foto, setFoto] = useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const fileRef =
    useRef<HTMLInputElement>(null);

  // ================= FETCH CATEGORY =================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategory(true);

        const res = await api.get("/categories");

        const data =
          Array.isArray(res.data)
            ? res.data
            : res.data?.data || [];

        setCategories(data);
      } catch (err) {
        console.log(
          "Fetch category error:",
          err
        );
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategories();
  }, []);

  // ================= HANDLE FILE =================

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    // max 5MB
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Ukuran foto maksimal 5MB"
      );
      return;
    }

    setFoto(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // ================= HANDLE SUBMIT =================

  const handleSubmit = async () => {
    setError("");

    if (
      !form.judul_laporan ||
      !form.category_id ||
      !form.deskripsi
    ) {
      setError(
        "Judul, kategori, dan deskripsi wajib diisi."
      );
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append(
        "judul_laporan",
        form.judul_laporan
      );

      fd.append(
        "category_id",
        form.category_id
      );

      fd.append(
        "deskripsi",
        form.deskripsi
      );

      fd.append(
        "lokasi",
        form.lokasi
      );

      if (foto) {
        fd.append(
          "foto",
          foto
        );
      }

      await api.post(
        "/laporan",
        fd,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setSuccess(true);

      setForm({
        judul_laporan: "",
        category_id: "",
        deskripsi: "",
        lokasi: "",
      });

      setFoto(null);

      setPreview(null);

      setTimeout(() => {
        setSuccess(false);

        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.log(
        "Submit laporan error:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          "Gagal mengirim laporan"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE RESET =================

  const handleReset = () => {
    setForm({
      judul_laporan: "",
      category_id: "",
      deskripsi: "",
      lokasi: "",
    });

    setFoto(null);

    setPreview(null);

    setError("");
  };

  // ================= INPUT STYLE =================

  const inputStyle =
    "w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm font-medium";

  // ================= RETURN =================

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm mb-8">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white">
              Panduan Membuat Laporan
            </h2>

            <p className="text-indigo-200 text-sm">
              Ikuti langkah berikut agar laporan diproses lebih cepat
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TATA_CARA.map((t, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.1,
              }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="text-2xl font-black text-white/30 mb-2">
                {t.step}
              </div>

              <h4 className="text-sm font-bold text-white mb-1">
                {t.title}
              </h4>

              <p className="text-[11px] text-indigo-200 leading-relaxed">
                {t.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="w-5 h-5 text-indigo-600" />

          <h3 className="text-xl font-extrabold text-slate-900">
            Form Laporan Baru
          </h3>
        </div>

        {/* SUCCESS */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />

              <p className="text-sm font-bold text-emerald-700">
                Laporan berhasil dikirim!
              </p>
            </motion.div>
          )}

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />

              <p className="text-sm font-bold text-red-600">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-5">
          {/* JUDUL */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Judul Laporan
            </label>

            <input
              type="text"
              value={
                form.judul_laporan
              }
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  judul_laporan:
                    e.target.value,
                }))
              }
              placeholder="Masukkan judul laporan"
              className={inputStyle}
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Kategori
            </label>

            <div className="relative">
              <select
                value={
                  form.category_id
                }
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category_id:
                      e.target.value,
                  }))
                }
                className={`${inputStyle} appearance-none`}
              >
                <option value="">
                  {loadingCategory
                    ? "Loading kategori..."
                    : "Pilih kategori"}
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  )
                )}
              </select>

              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* LOKASI */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Lokasi
            </label>

            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

              <input
                type="text"
                value={
                  form.lokasi
                }
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    lokasi:
                      e.target.value,
                  }))
                }
                placeholder="Masukkan lokasi"
                className={`${inputStyle} pl-10`}
              />
            </div>
          </div>

          {/* DESKRIPSI */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Deskripsi
            </label>

            <textarea
              value={
                form.deskripsi
              }
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  deskripsi:
                    e.target.value,
                }))
              }
              rows={4}
              placeholder="Masukkan deskripsi laporan"
              className={`${inputStyle} resize-none`}
            />
          </div>

          {/* FOTO */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Foto Bukti
            </label>

            <div
              onClick={() =>
                fileRef.current?.click()
              }
              className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl p-6 cursor-pointer transition-all group hover:bg-indigo-50/30"
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setFoto(null);

                      setPreview(
                        null
                      );
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                    <Camera className="w-6 h-6 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    Klik upload foto
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, JPEG
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Kirim Laporan
              </>
            )}
          </motion.button>

          <button
            onClick={handleReset}
            className="sm:w-auto px-6 py-4 border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}