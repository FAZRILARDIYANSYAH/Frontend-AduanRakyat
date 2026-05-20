"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import type { AdminStats, AdminLaporan, AdminCategory } from "@/types/admin";

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({ total: 0, diproses: 0, selesai: 0, verifikasi: 0, ditolak: 0 });
  const [laporan, setLaporan] = useState<AdminLaporan[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLaporan, setLoadingLaporan] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

const fetchStats = useCallback(async () => {
  try {
    setLoadingStats(true);
    const res = await api.get("/dashboard/admin");

    console.log(res.data.data); // cek isi stats

    setStats(res.data.data);
  } catch (err) {
    console.error("Fetch stats error:", err);
  } finally {
    setLoadingStats(false);
  }
}, []);

  const fetchLaporan = useCallback(async () => {
    try {
      setLoadingLaporan(true);
      const res = await api.get("/laporan");
      setLaporan(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch laporan error:", err);
    } finally {
      setLoadingLaporan(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const res = await api.get("/categories");
      setCategories(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const updateStatus = async (id: number, status: string, tanggapan: string) => {
    await api.put(`/laporan/status/${id}`, { status, tanggapan });
    await Promise.all([fetchStats(), fetchLaporan()]);
  };

  const deleteLaporan = async (id: number) => {
    await api.delete(`/laporan/${id}`);
    await Promise.all([fetchStats(), fetchLaporan()]);
  };

  const createCategory = async (name: string, description: string) => {
    await api.post("/categories", { name, description });
    await fetchCategories();
  };

  const updateCategory = async (id: number, name: string, description: string) => {
    await api.put(`/categories/${id}`, { name, description });
    await fetchCategories();
  };

  const deleteCategory = async (id: number) => {
    await api.delete(`/categories/${id}`);
    await fetchCategories();
  };

  useEffect(() => {
    fetchStats();
    fetchLaporan();
    fetchCategories();
  }, []);

  return {
    stats, laporan, categories,
    loadingStats, loadingLaporan, loadingCategories,
    updateStatus, deleteLaporan,
    createCategory, updateCategory, deleteCategory,
    refetchLaporan: fetchLaporan,
    refetchCategories: fetchCategories,
  };
}