"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import {
  User, Mail, Phone, CreditCard, Shield,
  Edit3, Key, CheckCircle, AlertCircle,
  Save, X, Eye, EyeOff, Loader2,
  Lock, RefreshCw,
} from "lucide-react";

// ─── types ───────────────────────────────────────────────
interface UserProfile {
  id: number;
  name: string;
  email: string;
  nik: string;
  no_tlp: string;
  role: string;
}

// ─── small helpers ───────────────────────────────────────
function Feedback({ type, msg }: { type: "success" | "error"; msg: string }) {
  return (
    <div className={`fb fb-${type}`}>
      {type === "success"
        ? <CheckCircle size={15} />
        : <AlertCircle size={15} />}
      <span>{msg}</span>
    </div>
  );
}

function SectionCard({
  title, icon: Icon, children,
}: {
  title: string; icon: any; children: React.ReactNode;
}) {
  return (
    <div className="sec-card">
      <div className="sec-header">
        <div className="sec-icon-wrap"><Icon size={15} strokeWidth={2.2} /></div>
        <h3 className="sec-title">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── main ────────────────────────────────────────────────
export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const sessionUser = session?.user as any;

  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [fetching, setFetching] = useState(true);

  // info edit state
  const [editMode, setEditMode] = useState(false);
  const [name, setName]         = useState("");
  const [noTlp, setNoTlp]       = useState("");
  const [saving, setSaving]     = useState(false);
  const [infoFb, setInfoFb]     = useState<{ type: "success"|"error"; msg: string }|null>(null);

  // password state
  const [oldPass, setOldPass]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confPass, setConfPass] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwFb, setPwFb]         = useState<{ type: "success"|"error"; msg: string }|null>(null);

  // ── fetch profile on mount ──
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data);
        setName(res.data.name);
        setNoTlp(res.data.no_tlp);
      } catch {
        // fallback ke session jika gagal
        if (sessionUser) {
          setProfile(sessionUser as any);
          setName(sessionUser.name || "");
          setNoTlp(sessionUser.no_tlp || "");
        }
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  const initials = (profile?.name || "??").slice(0, 2).toUpperCase();

  // ── save profile info ──
  const handleSaveInfo = async () => {
    if (!name.trim()) { setInfoFb({ type: "error", msg: "Nama tidak boleh kosong." }); return; }
    if (!noTlp.trim()) { setInfoFb({ type: "error", msg: "No. telepon tidak boleh kosong." }); return; }
    setSaving(true); setInfoFb(null);
    try {
      const res = await api.put("/auth/profile", { name, no_tlp: noTlp });
      setProfile(res.data.user);
      await updateSession({ name: res.data.user.name });
      setInfoFb({ type: "success", msg: "Profil berhasil diperbarui!" });
      setEditMode(false);
    } catch (err: any) {
      setInfoFb({ type: "error", msg: err?.response?.data?.message || "Gagal menyimpan profil." });
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setName(profile?.name || "");
    setNoTlp(profile?.no_tlp || "");
    setEditMode(false);
    setInfoFb(null);
  };

  // ── change password ──
  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confPass) { setPwFb({ type: "error", msg: "Semua field wajib diisi." }); return; }
    if (newPass !== confPass) { setPwFb({ type: "error", msg: "Konfirmasi password tidak cocok." }); return; }
    if (newPass.length < 6)  { setPwFb({ type: "error", msg: "Password baru minimal 6 karakter." }); return; }
    setPwSaving(true); setPwFb(null);
    try {
      await api.put("/auth/change-password", { old_password: oldPass, new_password: newPass });
      setPwFb({ type: "success", msg: "Password berhasil diubah!" });
      setOldPass(""); setNewPass(""); setConfPass("");
    } catch (err: any) {
      setPwFb({ type: "error", msg: err?.response?.data?.message || "Gagal mengubah password." });
    } finally {
      setPwSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="pg-loading">
        <Loader2 size={28} className="spin" color="#4f46e5" />
        <span>Memuat profil...</span>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

        .pg-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #f1f5fb;
          padding: 32px 24px 60px;
        }

        /* ── page header ── */
        .pg-header {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap; gap: 12px;
        }
        .pg-title { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
        .pg-sub   { font-size: 13px; color: #94a3b8; margin-top: 2px; }

        /* ── hero card ── */
        .hero-card {
          background: linear-gradient(135deg, #4f46e5 0%, #1d6beb 100%);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(79,70,229,0.28);
        }
        .hero-decor1 {
          position: absolute; width: 220px; height: 220px; border-radius: 50%;
          background: rgba(255,255,255,0.07); top: -80px; right: -40px;
        }
        .hero-decor2 {
          position: absolute; width: 120px; height: 120px; border-radius: 50%;
          background: rgba(255,255,255,0.05); bottom: -40px; left: 40px;
        }
        .hero-inner {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 20px;
        }
        .hero-avatar {
          width: 72px; height: 72px; border-radius: 22px;
          background: rgba(255,255,255,0.22);
          border: 2px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; font-weight: 800; color: white;
          letter-spacing: -0.5px; flex-shrink: 0;
        }
        .hero-name {
          font-size: 22px; font-weight: 800; color: white;
          letter-spacing: -0.5px; margin-bottom: 6px;
        }
        .hero-email {
          font-size: 13px; color: rgba(191,219,254,0.9); margin-bottom: 10px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.18);
          padding: 4px 12px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.95);
          text-transform: capitalize;
        }

        /* ── grid ── */
        .pg-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px) {
          .pg-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ── section card ── */
        .sec-card {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #eef2f8;
          box-shadow: 0 2px 10px rgba(99,102,241,0.06);
        }
        .sec-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .sec-icon-wrap {
          width: 32px; height: 32px; border-radius: 10px;
          background: #eff6ff;
          display: flex; align-items: center; justify-content: center;
          color: #4f46e5;
        }
        .sec-title {
          font-size: 14px; font-weight: 800; color: #0f172a;
          letter-spacing: -0.2px;
        }

        /* ── info rows ── */
        .info-row {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid #f8fafc;
        }
        .info-row:last-of-type { border-bottom: none; }
        .info-icon-box {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .info-label {
          font-size: 10px; font-weight: 700;
          color: #94a3b8; text-transform: uppercase;
          letter-spacing: 0.6px; margin-bottom: 2px;
        }
        .info-val {
          font-size: 14px; font-weight: 600; color: #0f172a;
        }
        .info-val.muted { color: #94a3b8; }

        /* ── edit form ── */
        .edit-actions {
          display: flex; gap: 8px; margin-top: 18px;
        }
        .field-label {
          display: block;
          font-size: 11px; font-weight: 700;
          color: #475569; text-transform: uppercase;
          letter-spacing: 0.6px; margin-bottom: 7px;
        }
        .field-wrap { margin-bottom: 14px; }
        .text-input {
          width: 100%;
          padding: 11px 14px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 500; color: #0f172a;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          outline: none;
          transition: all 0.2s;
        }
        .text-input:focus {
          background: #fff;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
        }
        .text-input:disabled {
          opacity: 0.6; cursor: not-allowed;
        }

        /* password field */
        .pw-rel { position: relative; }
        .pw-toggle {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: #94a3b8;
          display: flex; padding: 4px; border-radius: 6px;
          transition: color 0.2s;
        }
        .pw-toggle:hover { color: #4f46e5; }

        /* buttons */
        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px 20px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 700; color: white;
          background: linear-gradient(135deg, #4f46e5, #1d6beb);
          border: none; border-radius: 12px;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(79,70,229,0.28);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79,70,229,0.35); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-primary.full { width: 100%; }

        .btn-secondary {
          display: flex; align-items: center; gap: 6px;
          padding: 11px 16px;
          font-family: 'Sora', sans-serif;
          font-size: 13px; font-weight: 600; color: #64748b;
          background: #f1f5f9;
          border: none; border-radius: 12px;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover { background: #e2e8f0; }

        .btn-edit {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          font-family: 'Sora', sans-serif;
          font-size: 12px; font-weight: 700; color: #4f46e5;
          background: #eef2ff;
          border: none; border-radius: 10px;
          cursor: pointer; transition: all 0.2s;
          margin-left: auto;
        }
        .btn-edit:hover { background: #e0e7ff; }

        /* feedback */
        .fb {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px;
          border-radius: 12px;
          font-size: 13px; font-weight: 500;
          margin-bottom: 16px;
        }
        .fb-success { background: #f0fdf4; color: #065f46; border: 1px solid #bbf7d0; }
        .fb-error   { background: #fff5f5; color: #dc2626; border: 1px solid #fecaca; }

        /* loading */
        .pg-loading {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 60vh; gap: 12px;
          font-family: 'Sora', sans-serif;
          font-size: 14px; color: #94a3b8;
        }
        @keyframes spin-anim { to { transform: rotate(360deg); } }
        .spin { animation: spin-anim 0.8s linear infinite; }

        /* locked field */
        .locked-field {
          display: flex; align-items: center;
          padding: 11px 14px; gap: 8px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px; font-weight: 500;
          color: #94a3b8;
        }
        .locked-field svg { flex-shrink: 0; }
      `}</style>

      <div className="pg-root">
        {/* Page Title */}
        <div className="pg-header">
          <div>
            <h1 className="pg-title">Profil Saya</h1>
            <p className="pg-sub">Kelola informasi akun dan keamanan Anda</p>
          </div>
        </div>

        {/* Hero Card */}
        <div className="hero-card">
          <div className="hero-decor1" />
          <div className="hero-decor2" />
          <div className="hero-inner">
            <div className="hero-avatar">{initials}</div>
            <div>
              <div className="hero-name">{profile?.name}</div>
              <div className="hero-email">{profile?.email}</div>
              <span className="hero-badge">
                <Shield size={10} />
                {profile?.role || "user"}
              </span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="pg-grid">

          {/* ── Informasi Pribadi ── */}
          <SectionCard title="Informasi Pribadi" icon={User}>
            {infoFb && <Feedback type={infoFb.type} msg={infoFb.msg} />}

            {!editMode ? (
              <>
                <button className="btn-edit" onClick={() => setEditMode(true)}>
                  <Edit3 size={12} /> Edit Profil
                </button>

                {[
                  { icon: User,       bg: "#eff6ff", color: "#1d6beb", label: "Nama Lengkap", value: profile?.name     },
                  { icon: Mail,       bg: "#f5f3ff", color: "#7c3aed", label: "Email",        value: profile?.email   },
                  { icon: CreditCard, bg: "#fef3c7", color: "#d97706", label: "NIK",          value: profile?.nik || "-" },
                  { icon: Phone,      bg: "#ecfdf5", color: "#059669", label: "No. Telepon",  value: profile?.no_tlp || "-" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div className="info-row" key={item.label}>
                      <div className="info-icon-box" style={{ background: item.bg }}>
                        <Icon size={15} color={item.color} strokeWidth={2} />
                      </div>
                      <div>
                        <div className="info-label">{item.label}</div>
                        <div className="info-val">{item.value}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <div className="field-wrap">
                  <label className="field-label">Nama Lengkap</label>
                  <input
                    className="text-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap"
                  />
                </div>

                <div className="field-wrap">
                  <label className="field-label">No. Telepon</label>
                  <input
                    className="text-input"
                    value={noTlp}
                    onChange={(e) => setNoTlp(e.target.value)}
                    placeholder="08xx..."
                  />
                </div>

                <div className="field-wrap">
                  <label className="field-label">NIK (tidak dapat diubah)</label>
                  <div className="locked-field">
                    <Lock size={13} />
                    {profile?.nik || "-"}
                  </div>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Email (tidak dapat diubah)</label>
                  <div className="locked-field">
                    <Lock size={13} />
                    {profile?.email}
                  </div>
                </div>

                <div className="edit-actions">
                  <button className="btn-secondary" onClick={cancelEdit}>
                    <X size={14} /> Batal
                  </button>
                  <button className="btn-primary" onClick={handleSaveInfo} disabled={saving}>
                    {saving ? <Loader2 size={14} className="spin" /> : <Save size={14} />}
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </>
            )}
          </SectionCard>

          {/* ── Ubah Password ── */}
          <SectionCard title="Ubah Password" icon={Key}>
            {pwFb && <Feedback type={pwFb.type} msg={pwFb.msg} />}

            <div className="field-wrap">
              <label className="field-label">Password Lama</label>
              <div className="pw-rel">
                <input
                  className="text-input"
                  type={showPw ? "text" : "password"}
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="Password saat ini"
                  style={{ paddingRight: 40 }}
                />
                <button className="pw-toggle" type="button" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="field-wrap">
              <label className="field-label">Password Baru</label>
              <input
                className="text-input"
                type={showPw ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div className="field-wrap">
              <label className="field-label">Konfirmasi Password Baru</label>
              <input
                className="text-input"
                type={showPw ? "text" : "password"}
                value={confPass}
                onChange={(e) => setConfPass(e.target.value)}
                placeholder="Ulangi password baru"
              />
            </div>

            <button
              className="btn-primary full"
              onClick={handleChangePassword}
              disabled={pwSaving}
            >
              {pwSaving ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
              {pwSaving ? "Menyimpan..." : "Ubah Password"}
            </button>
          </SectionCard>

        </div>
      </div>
    </>
  );
}