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
}

export type AdminTab = "dashboard" | "laporan" | "kategori";
export type StatusType = "menunggu" | "verifikasi" | "diproses" | "selesai" | "ditolak";