import api from "@/lib/axios";


// ==============================================
// TYPES
// ==============================================
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


// ==============================================
// GET SEMUA LAPORAN USER LOGIN
// ==============================================
export const getUserReports =
  async (): Promise<Laporan[]> => {

    const response =
      await api.get("/laporan");

    return response.data;

};


// ==============================================
// DASHBOARD USER
// ==============================================
export const getDashboardUser =
  async (): Promise<DashboardData> => {

    const response =
      await api.get("/laporan");

    const laporan =
      response.data;

    return {

      total: laporan.length,

      diproses: laporan.filter(
        (item: Laporan) =>
          item.status === "diproses"
      ).length,

      selesai: laporan.filter(
        (item: Laporan) =>
          item.status === "selesai"
      ).length,

      verifikasi: laporan.filter(
        (item: Laporan) =>
          item.status === "verifikasi"
      ).length,

      laporanTerbaru:
        laporan.slice(0, 5),

    };

};


// ==============================================
// DASHBOARD ADMIN
// ==============================================
export const getDashboardAdmin =
  async () => {

    const response =
      await api.get(
        "/dashboard/admin"
      );

    return response.data.data;

};


// ==============================================
// DASHBOARD SUPERADMIN
// ==============================================
export const getDashboardSuperAdmin =
  async () => {

    const response =
      await api.get(
        "/dashboard/superadmin"
      );

    return response.data.data;

};


// ==============================================
// GET DETAIL LAPORAN
// ==============================================
export const getReportById =
  async (
    id: number
  ): Promise<Laporan> => {

    const response =
      await api.get(
        `/laporan/${id}`
      );

    return response.data;

};


// ==============================================
// CREATE LAPORAN
// ==============================================
export const createReport =
  async (
    formData: FormData
  ) => {

    const response =
      await api.post(
        "/laporan",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;

};


// ==============================================
// UPDATE STATUS LAPORAN
// ADMIN / SUPERADMIN
// ==============================================
export const updateReportStatus =
  async (
    id: number,
    data: {
      status:
        | "menunggu"
        | "verifikasi"
        | "diproses"
        | "selesai"
        | "ditolak";

      tanggapan?: string;
    }
  ) => {

    const response =
      await api.put(
        `/laporan/status/${id}`,
        data
      );

    return response.data;

};


// ==============================================
// DELETE LAPORAN
// ADMIN ONLY
// ==============================================
export const deleteReport =
  async (
    id: number
  ) => {

    const response =
      await api.delete(
        `/laporan/${id}`
      );

    return response.data;

};