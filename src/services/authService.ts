import api from "@/lib/axios";

// LOGIN
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

// REGISTER
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  nik: string;
  no_tlp: string;
}) => {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};