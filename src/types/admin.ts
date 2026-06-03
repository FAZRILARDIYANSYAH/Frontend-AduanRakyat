export interface AdminLaporan {
  id: number;
  judul_laporan: string;
  kategori: string;
  deskripsi: string;
  lokasi: string;
  status: string;
  foto: string | null;
  tanggapan: string | null;
  tanggapan_at: string | null;
  created_at: string;
  tanggal_kejadian: string | null;
  user_name?: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface AdminStats {
  total: number;
  diproses: number;
  selesai: number;
  verifikasi: number;
  ditolak: number;

  // optional kalau dipakai dashboard chart
  monthly?: {
    total?: { bulan: string; val: number }[];
    verifikasi?: { bulan: string; val: number }[];
    diproses?: { bulan: string; val: number }[];
    selesai?: { bulan: string; val: number }[];
    ditolak?: { bulan: string; val: number }[];
  };

  sparkline?: {
    total?: { v: number }[];
    verifikasi?: { v: number }[];
    diproses?: { v: number }[];
    selesai?: { v: number }[];
    ditolak?: { v: number }[];
  };
}

export type AdminTab =
  | "dashboard"
  | "laporan"
  | "kategori";

export type StatusType =
  | "menunggu"
  | "verifikasi"
  | "diproses"
  | "selesai"
  | "ditolak";