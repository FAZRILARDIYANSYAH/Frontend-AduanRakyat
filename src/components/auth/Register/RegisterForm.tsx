// src/components/auth/Register/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, CreditCard, Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "@/services/authService";

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

export default function RegisterForm() {
  const router = useRouter();
  const [data, setData] = useState({ name: "", email: "", password: "", nik: "", no_tlp: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "", nik: "", no_tlp: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = {
      name: !data.name ? "Nama wajib diisi" : "",
      email: !data.email ? "Email wajib diisi" : "",
      password: !data.password
        ? "Password wajib diisi"
        : data.password.length < 6
        ? "Password minimal 6 karakter"
        : "",
      nik: !data.nik
        ? "NIK wajib diisi"
        : !/^[0-9]+$/.test(data.nik)
        ? "NIK hanya boleh angka"
        : data.nik.length < 16
        ? "NIK minimal 16 digit"
        : "",
      no_tlp: !data.no_tlp
        ? "Nomor telepon wajib diisi"
        : !/^[0-9]+$/.test(data.no_tlp)
        ? "Nomor telepon hanya boleh angka"
        : data.no_tlp.length < 10
        ? "Nomor telepon minimal 10 digit"
        : "",
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    try {
      setLoading(true);
      const res = await registerUser(data);
      toast.success(res.message || "Registrasi berhasil!");
      router.push("/homepage");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Register gagal");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 6 }}>Buat Akun</h2>
        <p style={{ color: "#64748b", fontSize: 14 }}>Daftar untuk mulai membuat laporan pengaduan.</p>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        <Field label="Nama Lengkap" name="name" value={data.name} onChange={change}
          placeholder="Masukkan nama lengkap" error={errors.name} icon={<User size={16} strokeWidth={2} />} />
        <Field label="Email" name="email" type="email" value={data.email} onChange={change}
          placeholder="Masukkan email" error={errors.email} icon={<Mail size={16} strokeWidth={2} />} />
        <Field label="Password" name="password" type={showPw ? "text" : "password"} value={data.password}
          onChange={change} placeholder="Buat password" error={errors.password}
          icon={<Lock size={16} strokeWidth={2} />}
          rightSlot={
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", padding: 0 }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          } />
        <Field label="NIK" name="nik" value={data.nik} onChange={change}
          placeholder="16 digit NIK KTP" error={errors.nik} icon={<CreditCard size={16} strokeWidth={2} />} />
        <Field label="Nomor Telepon" name="no_tlp" value={data.no_tlp} onChange={change}
          placeholder="08xxxxxxxxxx" error={errors.no_tlp} icon={<Phone size={16} strokeWidth={2} />} />

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
            ? <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "auth-spin 0.6s linear infinite" }} />Mendaftarkan...</>
            : <><UserPlus size={16} />Daftar Sekarang</>}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 20 }}>
        Sudah punya akun?{" "}
        <button
          onClick={() => router.push("/auth/login")}
          type="button"
          style={{ color: "#2563eb", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
        >
          Masuk
        </button>
      </p>
    </div>
  );
}