"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

function BluePanel({ isLogin }: { isLogin: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
        overflow: "hidden",
        background:
          "linear-gradient(145deg, #1d4ed8 0%, #1a3fbf 45%, #1e40af 100%)",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-15%",
          width: "75%",
          height: "75%",
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(96,165,250,0.5) 0%, transparent 70%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "-25%",
          right: "-20%",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(147,197,253,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/logo.png"
            alt="AduanRakyat"
            fill
            priority
            style={{
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        <span
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          AduanRakyat
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          transition: "all .35s ease",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 999,
            padding: "6px 16px",
            marginBottom: 18,
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(219,234,254,0.9)",
            letterSpacing: "0.06em",
          }}
        >
          {isLogin
            ? "✦ PLATFORM PENGADUAN RAKYAT"
            : "✦ BERGABUNG BERSAMA KAMI"}
        </div>

        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: 18,
          }}
        >
          {isLogin ? (
            <>
              "Suara Anda,
              <br />
              Perubahan Kita."
            </>
          ) : (
            <>
              "Bersama Kita
              <br />
              Bisa Berubah."
            </>
          )}
        </h1>

        <p
          style={{
            color: "rgba(219,234,254,0.85)",
            fontSize: 14,
            lineHeight: 1.8,
            maxWidth: 290,
          }}
        >
          {isLogin
            ? "Sampaikan pengaduan Anda secara aman, transparan, dan terpercaya untuk pelayanan publik yang lebih baik."
            : "Bergabunglah dengan ribuan warga yang telah melaporkan masalah dan melihat perubahan nyata di lingkungan mereka."}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 30,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
            }}
          />

          <div
            style={{
              width: 28,
              height: 8,
              borderRadius: 999,
              background: "#fff",
            }}
          />

          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          gap: 10,
        }}
      >
        {[
          { value: "45k+", label: "LAPORAN SELESAI" },
          { value: "98%", label: "KEPUASAN WARGA" },
          { value: "120+", label: "INSTANSI AKTIF" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              textAlign: "center",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 16,
              padding: "14px 6px",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              {s.value}
            </div>

            <div
              style={{
                color: "rgba(219,234,254,0.75)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                marginTop: 5,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/auth/login";

  const [displayLogin, setDisplayLogin] = useState(isLogin);
  const [formOpacity, setFormOpacity] = useState(1);

  useEffect(() => {
    setFormOpacity(0);

    const fadeOut = setTimeout(() => {
      setDisplayLogin(isLogin);
    }, 120);

    const fadeIn = setTimeout(() => {
      setFormOpacity(1);
    }, 220);

    return () => {
      clearTimeout(fadeOut);
      clearTimeout(fadeIn);
    };
  }, [isLogin]);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }

        @keyframes authFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {/* BLUE PANEL */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: displayLogin ? 0 : "52%",
            width: "48%",
            height: "100%",
            transition:
              "left .7s cubic-bezier(0.77, 0, 0.175, 1)",
            zIndex: 2,
          }}
        >
          <BluePanel isLogin={displayLogin} />
        </div>

        {/* FORM PANEL */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: displayLogin ? "48%" : 0,
            width: "52%",
            height: "100%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 32px",
            overflowY: "auto",
            transition:
              "left .7s cubic-bezier(0.77, 0, 0.175, 1)",
            zIndex: 1,
          }}
        >
          <div
            key={pathname}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              opacity: formOpacity,
              transition: "opacity .25s ease",
              animation: "authFadeUp .45s ease",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}