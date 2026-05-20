"use client";

import { useRouter } from "next/navigation";
import FormLaporan from "@/components/user/FormLaporan";

export default function BuatLaporanPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Buat Laporan Baru
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Sampaikan masalah di
          sekitar Anda kepada pihak
          berwenang.
        </p>
      </div>

      <FormLaporan
        onSuccess={() => {
          router.push(
            "/laporan"
          );
        }}
      />
    </div>
  );
}