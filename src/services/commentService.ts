import api from "@/lib/axios";


// ==============================================
// TYPES
// ==============================================
export interface Comment {

  id: number;

  laporan_id: number;

  user_id: number;

  comment: string;

  created_at: string;

  name: string;

}


// ==============================================
// GET COMMENT BY LAPORAN
// ==============================================
export const getCommentsByLaporan =
  async (
    laporanId: number
  ): Promise<Comment[]> => {

    const response =
      await api.get(
        `/comments/laporan/${laporanId}`
      );

    return response.data;

};


// ==============================================
// CREATE COMMENT
// ==============================================
export const createComment =
  async (
    data: {
      laporan_id: number;
      comment: string;
    }
  ) => {

    const response =
      await api.post(
        "/comments",
        data
      );

    return response.data;

};


// ==============================================
// UPDATE COMMENT
// ==============================================
export const updateComment =
  async (
    id: number,
    data: {
      comment: string;
    }
  ) => {

    const response =
      await api.put(
        `/comments/${id}`,
        data
      );

    return response.data;

};


// ==============================================
// DELETE COMMENT
// ==============================================
export const deleteComment =
  async (
    id: number
  ) => {

    const response =
      await api.delete(
        `/comments/${id}`
      );

    return response.data;

};