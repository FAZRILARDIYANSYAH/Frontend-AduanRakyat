"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import api from "@/lib/axios";

// ================= STATUS =================

export type StatusType =
  | "menunggu"
  | "verifikasi"
  | "diproses"
  | "selesai"
  | "ditolak";

// ================= REPORT TYPE =================

export interface UserReport {
  id: string;
  judul: string;
  kategori: string;
  lokasi: string;
  status: StatusType;
  deskripsi: string;
  foto?: string;
  tanggal_kejadian?: string;
  createdAt: string;
  updatedAt: string;
  tanggapan?: string;
  instansi?: string;
  user_name?: string;
}

// ================= STATS =================

export interface UserStats {
  total: number;
  selesai: number;
  diproses: number;
  menunggu: number;
  verifikasi: number;
  ditolak: number;
}

// ================= NORMALIZE =================

function normalizeStatus(status: string): StatusType {
  const s = status?.toLowerCase()?.trim();

  switch (s) {
    case "proses":
    case "diproses":
      return "diproses";

    case "verifikasi":
    case "diverifikasi":
      return "verifikasi";

    case "selesai":
      return "selesai";

    case "ditolak":
      return "ditolak";

    case "menunggu":
    case "pending":
      return "menunggu";

    default:
      return "menunggu";
  }
}

// ================= HOOK =================

export function useLaporan(type: "mine" | "feed" = "mine") {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    selesai: 0,
    diproses: 0,
    menunggu: 0,
    verifikasi: 0,
    ditolak: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ================= FETCH =================

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/laporan", {
        params: {
          type, // 🔥 INI YANG PENTING
        },
      });

      const rawData = res.data ?? [];

      const data: UserReport[] = rawData.map((item: any) => ({
        id: String(item.id),
        judul: item.judul_laporan,
        kategori: item.kategori,
        lokasi: item.lokasi,
        status: normalizeStatus(item.status),
        deskripsi: item.deskripsi,
        foto: item.foto,
        tanggal_kejadian: item.tanggal_kejadian,
        createdAt: item.created_at,
        updatedAt: item.updated_at ?? item.created_at,
        tanggapan: item.tanggapan,
        instansi: item.instansi,
        user_name: item.user_name,
      }));

      setReports(data);

      // ================= STATS =================

      setStats({
        total: data.length,
        selesai: data.filter(r => r.status === "selesai").length,
        diproses: data.filter(r => r.status === "diproses").length,
        menunggu: data.filter(r => r.status === "menunggu").length,
        verifikasi: data.filter(r => r.status === "verifikasi").length,
        ditolak: data.filter(r => r.status === "ditolak").length,
      });

    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Gagal memuat laporan"
      );
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    stats,
    loading,
    error,
    refetch: fetchReports,
  };
}