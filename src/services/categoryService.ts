import api from "@/lib/axios";


// ==============================================
// TYPES
// ==============================================
export interface Category {

  id: number;

  name: string;

  description: string;

}


// ==============================================
// GET ALL CATEGORY
// ==============================================
export const getCategories =
  async (): Promise<Category[]> => {

    const response =
      await api.get(
        "/categories"
      );

    return response.data;

};


// ==============================================
// GET CATEGORY BY ID
// ==============================================
export const getCategoryById =
  async (
    id: number
  ): Promise<Category> => {

    const response =
      await api.get(
        `/categories/${id}`
      );

    return response.data;

};


// ==============================================
// CREATE CATEGORY
// ==============================================
export const createCategory =
  async (
    data: {
      name: string;
      description: string;
    }
  ) => {

    const response =
      await api.post(
        "/categories",
        data
      );

    return response.data;

};


// ==============================================
// UPDATE CATEGORY
// ==============================================
export const updateCategory =
  async (
    id: number,
    data: {
      name: string;
      description: string;
    }
  ) => {

    const response =
      await api.put(
        `/categories/${id}`,
        data
      );

    return response.data;

};


// ==============================================
// DELETE CATEGORY
// ==============================================
export const deleteCategory =
  async (
    id: number
  ) => {

    const response =
      await api.delete(
        `/categories/${id}`
      );

    return response.data;

};