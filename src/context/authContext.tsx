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

// ─── Types ─────────────────────────────────────────────────────────────────
// Sesuai kolom tabel users backend: id, name, email, nik, no_tlp, role
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router                = useRouter();

  /**
   * Fetch user:
   * 1. Coba GET /api/auth/me (kalau route ini sudah ada di backend)
   * 2. Fallback: baca object user yang disimpan di localStorage saat login
   */
  const fetchUser = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      const data: User = res.data?.user ?? res.data;
      setUser(data);
    } catch {
      // /auth/me belum ada → pakai user yang disimpan saat login
      const saved = localStorage.getItem("user");
      if (saved) {
        try { setUser(JSON.parse(saved)); }
        catch { localStorage.removeItem("user"); setUser(null); }
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  // ── Login ─────────────────────────────────────────────────────────────────
  // Backend response: { message: "Login berhasil", token, user }
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user: userData } = res.data as { token: string; user: User };

      if (!token) throw new Error("Token tidak ditemukan dalam respons.");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData)); // backup untuk fetchUser fallback

      setUser(userData);

      // Redirect berdasarkan role
      if (userData.role === "superadmin") router.push("/superadmin/dashboard");
      else if (userData.role === "admin")  router.push("/admin/dashboard");
      else                                 router.push("/user/homepage");

    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Login gagal. Periksa email dan password.";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}