"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type {
  AdminStats,
  AdminLaporan,
  AdminCategory,
} from "@/types/admin";

type Role = "admin" | "superadmin";

export function useAdminDashboard(role: Role = "admin") {
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    diproses: 0,
    selesai: 0,
    verifikasi: 0,
    ditolak: 0,
  });

  const [laporan, setLaporan] = useState<AdminLaporan[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLaporan, setLoadingLaporan] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ── Fix: endpoint disesuaikan dengan route backend yang ada ──────────
  const getDashboardEndpoint = () => {
    return role === "superadmin"
      ? "/superadmin/dashboard"   // → router superadmin: GET /dashboard
      : "/dashboard/admin";       // → router dashboard:  GET /admin
  };

  // fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);

      const endpoint = getDashboardEndpoint();
      const res = await api.get(endpoint);

      console.log("Dashboard stats:", res.data);

      setStats(
        res.data?.data || {
          total: 0,
          diproses: 0,
          selesai: 0,
          verifikasi: 0,
          ditolak: 0,
        }
      );
    } catch (err: any) {
      console.error("Fetch stats error:", err);
      setStats({
        total: 0,
        diproses: 0,
        selesai: 0,
        verifikasi: 0,
        ditolak: 0,
      });
    } finally {
      setLoadingStats(false);
    }
  }, [role]);

  // fetch laporan
const fetchLaporan = useCallback(async () => {
  try {
    setLoadingLaporan(true);

    const res = await api.get("/laporan");

    console.log(
  "Laporan pertama:",
  Array.isArray(res.data)
    ? res.data[0]
    : res.data?.data?.[0]
);

    const raw =
      Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

    const mapped: AdminLaporan[] = raw.map((item: any) => ({
      id: Number(item.id),
      judul_laporan: item.judul_laporan,
      kategori: item.kategori,
      deskripsi: item.deskripsi,
      lokasi: item.lokasi,
      status: item.status,
      foto: item.foto ?? null,
      tanggapan: item.tanggapan ?? null,
      tanggapan_at: item.tanggapan_at ?? null,
      created_at: item.created_at,
      tanggal_kejadian: item.tanggal_kejadian ?? null,

      // sementara cek nama user
      user_name:
        item.user_name ??
        item.user?.name ??
        "User",
    }));

    setLaporan(mapped);
  } catch (err) {
    console.error("Fetch laporan error:", err);
  } finally {
    setLoadingLaporan(false);
  }
}, []);

  // fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const res = await api.get("/categories");
      setCategories(
        Array.isArray(res.data) ? res.data : res.data?.data || []
      );
    } catch (err) {
      console.error("Fetch categories error:", err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // update status laporan
  const updateStatus = async (id: number, status: string, tanggapan: string) => {
    await api.put(`/laporan/status/${id}`, { status, tanggapan });
    await Promise.all([fetchStats(), fetchLaporan()]);
  };

  // hapus laporan
  const deleteLaporan = async (id: number) => {
    await api.delete(`/laporan/${id}`);
    await Promise.all([fetchStats(), fetchLaporan()]);
  };

  // create category
  const createCategory = async (name: string, description: string) => {
    await api.post("/categories", { name, description });
    await fetchCategories();
  };

  // update category
  const updateCategory = async (id: number, name: string, description: string) => {
    await api.put(`/categories/${id}`, { name, description });
    await fetchCategories();
  };

  // delete category
  const deleteCategory = async (id: number) => {
    await api.delete(`/categories/${id}`);
    await fetchCategories();
  };

  useEffect(() => {
    fetchStats();
    fetchLaporan();
    fetchCategories();
  }, [fetchStats, fetchLaporan, fetchCategories]);

  return {
    stats,
    laporan,
    categories,

    loadingStats,
    loadingLaporan,
    loadingCategories,

    updateStatus,
    deleteLaporan,

    createCategory,
    updateCategory,
    deleteCategory,

    refetchLaporan: fetchLaporan,
    refetchCategories: fetchCategories,
    refetchStats: fetchStats,
  };
}