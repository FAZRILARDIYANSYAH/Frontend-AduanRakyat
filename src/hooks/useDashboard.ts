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
  | "diverifikasi"
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

  createdAt: string;

  updatedAt: string;

  tanggapan?: string;

  instansi?: string;
}

// ================= STATS TYPE =================

export interface UserStats {
  total: number;

  selesai: number;

  diproses: number;

  menunggu: number;

  ditolak: number;
}

// ================= HOOK =================

export function useLaporan() {
  // ================= STATE =================

  const [reports, setReports] =
    useState<UserReport[]>([]);

  const [stats, setStats] =
    useState<UserStats>({
      total: 0,
      selesai: 0,
      diproses: 0,
      menunggu: 0,
      ditolak: 0,
    });

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  // ================= FETCH REPORTS =================

  const fetchReports = useCallback(
    async (): Promise<void> => {
      try {
        setLoading(true);

        setError(null);

        // endpoint backend:
        // GET /api/laporan

        const res = await api.get(
          "/laporan"
        );

        console.log(
          "DATA LAPORAN:",
          res.data
        );

        // backend return array
        const rawData =
          res.data ?? [];

        // mapping backend -> frontend
        const data: UserReport[] =
          rawData.map(
            (item: any) => ({
              id: String(item.id),

              judul:
                item.judul_laporan,

              kategori:
                item.kategori,

              lokasi:
                item.lokasi,

              status:
                item.status,

              deskripsi:
                item.deskripsi,

              foto: item.foto,

              createdAt:
                item.created_at,

              updatedAt:
                item.updated_at ??
                item.created_at,

              tanggapan:
                item.tanggapan,

              instansi:
                item.instansi,
            })
          );

        // simpan data
        setReports(data);

        // ================= STATS =================

        setStats({
          total: data.length,

          selesai: data.filter(
            (r) =>
              r.status ===
              "selesai"
          ).length,

          diproses: data.filter(
            (r) =>
              r.status ===
                "diproses" ||
              r.status ===
                "diverifikasi"
          ).length,

          menunggu: data.filter(
            (r) =>
              r.status ===
              "menunggu"
          ).length,

          ditolak: data.filter(
            (r) =>
              r.status ===
              "ditolak"
          ).length,
        });
      } catch (err: any) {
        console.log(
          "Fetch laporan error:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Gagal memuat laporan"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ================= FIRST LOAD =================

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ================= RETURN =================

  return {
    reports,
    stats,
    loading,
    error,
    refetch: fetchReports,
  };
}