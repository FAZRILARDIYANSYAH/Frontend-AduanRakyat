import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title:
    "AduanRakyat – Platform Pengaduan Warga",
  description:
    "Laporkan masalah di sekitar Anda. Cepat, transparan, terselesaikan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}

          {/* GLOBAL TOAST */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius:
                  "16px",
                padding:
                  "14px 18px",
                fontWeight:
                  "500",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}