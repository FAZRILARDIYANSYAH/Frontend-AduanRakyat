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
  verifikasi: number; // ✅ tambah ini
  ditolak: number;
}

// ================= NORMALIZE STATUS =================

function normalizeStatus(
  status: string
): StatusType {
  const s =
    status?.toLowerCase()?.trim();

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

export function useLaporan() {
  const [reports, setReports] =
    useState<UserReport[]>([]);

  const [stats, setStats] =
    useState<UserStats>({
      total: 0,
      selesai: 0,
      diproses: 0,
      menunggu: 0,
      verifikasi: 0, // ✅ tambah ini
      ditolak: 0,
    });

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  // ================= FETCH =================

  const fetchReports =
    useCallback(async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const res =
          await api.get(
            "/laporan"
          );

        const rawData =
          res.data ?? [];

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
                normalizeStatus(
                  item.status
                ),

              deskripsi:
                item.deskripsi,
              foto:
                item.foto,
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

        setReports(data);

        // ================= STATS =================

        setStats({
          total: data.length,

          selesai:
            data.filter(
              (r) =>
                r.status ===
                "selesai"
            ).length,

          diproses:
            data.filter(
              (r) =>
                r.status ===
                "diproses"
            ).length,

          menunggu:
            data.filter(
              (r) =>
                r.status ===
                "menunggu"
            ).length,

          verifikasi:
            data.filter(
              (r) =>
                r.status ===
                "verifikasi"
            ).length, // ✅ ini yang bikin muncul 1

          ditolak:
            data.filter(
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
    }, []);

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
    refetch:
      fetchReports,
  };
}