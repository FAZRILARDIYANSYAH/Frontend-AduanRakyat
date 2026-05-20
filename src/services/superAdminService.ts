import api from "@/lib/axios";


// ==============================================
// TYPES
// ==============================================
export interface User {

  id: number;

  name: string;

  email: string;

  role: string;

}


// ==============================================
// GET ALL USERS
// ==============================================
export const getAllUsers =
  async (): Promise<User[]> => {

    const response =
      await api.get(
        "/superadmin/users"
      );

    return response.data;

};


// ==============================================
// DELETE USER
// ==============================================
export const deleteUser =
  async (
    id: number
  ) => {

    const response =
      await api.delete(
        `/superadmin/users/${id}`
      );

    return response.data;

};