export interface Laporan {
  id: number;

  judul_laporan: string;

  kategori: string;

  deskripsi: string;

  lokasi: string;

  status:
    | "menunggu"
    | "verifikasi"
    | "diproses"
    | "selesai"
    | "ditolak";

  foto?: string;

  tanggapan?: string;

  tanggapan_at?: string;

  created_at: string;
}


export interface DashboardData {
  total: number;

  diproses: number;

  selesai: number;

  verifikasi: number;

  laporanTerbaru: Laporan[];
}