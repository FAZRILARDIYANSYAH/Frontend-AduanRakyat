// Jika AuthProvider belum ada di root layout, tambahkan seperti ini.
// File: src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";

export const metadata: Metadata = {
  title: "AduanRakyat – Platform Pengaduan Warga",
  description: "Laporkan masalah di sekitar Anda. Cepat, transparan, terselesaikan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {/*
          AuthProvider di root agar semua halaman (user, admin, superadmin)
          bisa akses useAuth() tanpa perlu wrap di masing-masing layout.
          Hapus AuthProvider di (user)/layout.tsx jika pakai cara ini.
        */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}