import api from "@/lib/axios";

// GET SEMUA LAPORAN USER LOGIN
export const getUserReports = async () => {

  const response =
    await api.get("/laporan");

  return response.data;
};


// DASHBOARD USER
export const getDashboardUser =
  async () => {

    const response =
      await api.get("/laporan");

    const laporan =
      response.data;

    return {

      total: laporan.length,

      diproses: laporan.filter(
        (item: any) =>
          item.status === "diproses"
      ).length,

      selesai: laporan.filter(
        (item: any) =>
          item.status === "selesai"
      ).length,

      verifikasi: laporan.filter(
        (item: any) =>
          item.status === "verifikasi"
      ).length,

      laporanTerbaru:
        laporan.slice(0, 5),

    };
};