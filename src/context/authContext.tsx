"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// ─────────────────────────────
// TYPES
// ─────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  nik: string;
  no_tlp: string;
  role: "user" | "admin" | "superadmin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

// ─────────────────────────────
// CONTEXT
// ─────────────────────────────
const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

// ─────────────────────────────
// PROVIDER
// ─────────────────────────────
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const router =
    useRouter();

  // ───────────────────────────
  // FETCH USER
  // ───────────────────────────
  const fetchUser =
    useCallback(async () => {
      const token =
        typeof window !==
        "undefined"
          ? localStorage.getItem(
              "token"
            )
          : null;

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res =
          await api.get(
            "/auth/me"
          );

        const data: User =
          res.data?.user ??
          res.data;

        setUser(data);
      } catch {
        const saved =
          localStorage.getItem(
            "user"
          );

        if (saved) {
          try {
            setUser(
              JSON.parse(saved)
            );
          } catch {
            localStorage.removeItem(
              "user"
            );
            localStorage.removeItem(
              "token"
            );
            setUser(null);
          }
        } else {
          localStorage.removeItem(
            "token"
          );
          localStorage.removeItem(
            "user"
          );
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ───────────────────────────
  // LOGIN
  // ───────────────────────────
  const login = async (
    email: string,
    password: string
  ) => {
    setLoading(true);

    try {
      const res =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const {
        token,
        user: userData,
      } = res.data as {
        token: string;
        user: User;
      };

      if (!token) {
        throw new Error(
          "Token tidak ditemukan"
        );
      }

      // simpan localStorage
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          userData
        )
      );

      // simpan cookie untuk middleware
      document.cookie =
        `token=${token}; path=/`;

      document.cookie =
        `role=${userData.role}; path=/`;

      setUser(userData);

      // redirect role
      if (
        userData.role ===
        "superadmin"
      ) {
        router.replace(
          "/superadmin/dashboard"
        );
      } else if (
        userData.role ===
        "admin"
      ) {
        router.replace(
          "/admin/dashboard"
        );
      } else {
        router.replace(
          "/homepage"
        );
      }
    } catch (
      err: unknown
    ) {
      const msg =
        (
          err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        )?.response?.data
          ?.message ??
        "Login gagal";

      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────
  // LOGOUT
  // ───────────────────────────
  const logout =
    useCallback(() => {
      // hapus localStorage
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      // hapus cookie
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

      document.cookie =
        "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

      setUser(null);

      // balik ke landing page
      router.replace("/");
    }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated:
          !!user,
        login,
        logout,
        refetchUser:
          fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────
// HOOK
// ─────────────────────────────
export function useAuth(): AuthContextType {
  const ctx =
    useContext(
      AuthContext
    );

  if (!ctx) {
    throw new Error(
      "useAuth harus dipakai di dalam AuthProvider"
    );
  }

  return ctx;
}