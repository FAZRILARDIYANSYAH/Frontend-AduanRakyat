// src/components/auth/Login/LoginForm.tsx
"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { signIn, getSession } from "next-auth/react";

function Field({ label, name, type = "text", value, onChange, placeholder, error, icon, rightSlot }: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; error?: string; icon: React.ReactNode; rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 700, color: "#334155", display: "block", marginBottom: 7 }}>{label}</label>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, height: 50,
        padding: "0 14px", borderRadius: 12,
        border: `1.5px solid ${error ? "#f87171" : focused ? "#2563eb" : "#e2e8f0"}`,
        boxShadow: error ? "0 0 0 3px rgba(248,113,113,0.1)" : focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
        background: "#fff", transition: "border-color 0.15s, box-shadow 0.15s",
      }}>
        <span style={{ color: "#94a3b8", display: "flex", flexShrink: 0 }}>{icon}</span>
        <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, height: "100%", border: "none", outline: "none", fontSize: 14, color: "#0f172a", background: "transparent" }} />
        {rightSlot}
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}>{error}</p>}
    </div>
  );
}

export default function LoginForm() {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

const submit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  const errs = {
    email: !data.email
      ? "Email wajib diisi"
      : "",

    password:
      !data.password
        ? "Kata sandi wajib diisi"
        : "",
  };

  setErrors(errs);

  if (
    errs.email ||
    errs.password
  )
    return;

  try {
    setLoading(true);

    const res =
      await signIn(
        "credentials",
        {
          email:
            data.email,

          password:
            data.password,

          redirect: false,
        }
      );

    if (res?.error) {
      toast.error(
        "Email atau password salah"
      );

      return;
    }

    const session =
      await getSession();
  
    toast.success(
      "Login berhasil!"
    );

    const role =
      session?.user?.role?.toLowerCase();

    if (
      role ===
      "superadmin"
    ) {
      window.location.href =
        "/superadmin/dashboard";
    } else if (
      role === "admin"
    ) {
      window.location.href =
        "/admin/dashboard";
    } else {
      window.location.href =
        "/homepage";
    }
  } catch (err: any) {
    toast.error(
      err.message ||
        "Login gagal"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 6 }}>Selamat Datang</h2>
        <p style={{ color: "#64748b", fontSize: 14 }}>Silakan masuk untuk melanjutkan pengaduan.</p>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <Field label="Alamat Email" name="email" type="email" value={data.email} onChange={change}
          placeholder="contoh@email.com" error={errors.email} icon={<Mail size={16} strokeWidth={2} />} />

        <Field label="Kata Sandi" name="password" type={showPw ? "text" : "password"} value={data.password}
          onChange={change} placeholder="••••••••••" error={errors.password}
          icon={<Lock size={16} strokeWidth={2} />}
          rightSlot={
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 0 }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          } />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div onClick={() => setRemember(!remember)} style={{
              width: 16, height: 16, borderRadius: 4, cursor: "pointer", flexShrink: 0,
              border: remember ? "none" : "1.5px solid #cbd5e1", background: remember ? "#2563eb" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s",
            }}>
              {remember && <svg viewBox="0 0 10 8" width="10" height="10"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span style={{ fontSize: 13, color: "#475569", userSelect: "none" }}>Ingat saya</span>
          </label>
          <button type="button" style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>
            Lupa Password?
          </button>
        </div>

        <button type="submit" disabled={loading} style={{
          width: "100%", height: 50, background: loading ? "#93c5fd" : "#2563eb",
          border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
          color: "#fff", fontSize: 14, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 8px 24px rgba(37,99,235,0.22)", transition: "background 0.15s", marginTop: 6,
        }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#1d4ed8"; }}
          onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#2563eb"; }}
        >
          {loading
            ? <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "auth-spin 0.6s linear infinite" }} />Memproses...</>
            : <><LogIn size={16} />Masuk Sekarang</>}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em" }}>ATAU MASUK DENGAN</span>
        <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {[
          { label: "Google", icon: <svg viewBox="0 0 24 24" width="17" height="17"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
          { label: "Apple", icon: <svg viewBox="0 0 24 24" width="17" height="17" fill="#0f172a"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/></svg> },
        ].map(({ label, icon }) => (
          <button key={label} type="button" style={{
            height: 46, borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff",
            cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#334155",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            transition: "background 0.15s, border-color 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f8fafc"; (e.currentTarget as HTMLElement).style.borderColor = "#cbd5e1"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; }}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#64748b" }}>
        Belum punya akun?{" "}
        {/* Pakai router.push supaya layout mendeteksi perubahan URL dan animasi terpicu */}
        <button
          onClick={() => (window.location.href = "/auth/register")}
          type="button"
          style={{ color: "#2563eb", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
        >
          Daftar Sekarang
        </button>
      </p>
    </div>
  );
}