"use client";

import { motion } from "framer-motion";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

import AdminCategoryManager from "@/components/admin/CategoryMeneger";

export default function KategoriPage() {
  const {
    categories,
    loadingCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAdminDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900">
          Manajemen Kategori
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Tambah, edit, atau hapus kategori laporan
        </p>
      </div>

      <AdminCategoryManager
        categories={categories}
        loading={loadingCategories}
        onCreate={createCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />
    </motion.div>
  );
}