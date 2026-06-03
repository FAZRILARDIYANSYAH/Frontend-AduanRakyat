import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import { Toaster } from "react-hot-toast";

import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";

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
        <SessionProviderWrapper>
          {children}

          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,

              style: {
                borderRadius: "16px",
                padding: "14px 18px",
                fontWeight: "500",
              },
            }}
          />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}