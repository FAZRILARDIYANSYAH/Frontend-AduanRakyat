"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import {
  Trash2, UserPlus, Users, Pencil, X, ShieldCheck, User,
  Mail, Phone, CreditCard, Lock, Search, Filter, RefreshCw
} from "lucide-react";

const S = {
  page: {
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    minHeight: "100vh",
    background: "#f8faff",
  },
  // ── Page header
  pageTitle: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#1e293b",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: "13px",
    color: "#94a3b8",
    marginTop: "2px",
  },
  // ── Card
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e8f0fe",
    boxShadow: "0 1px 3px rgba(37,99,235,0.06), 0 4px 16px rgba(37,99,235,0.04)",
    overflow: "hidden",
  },
  cardTopBar: {
    height: "3px",
    background: "linear-gradient(90deg, #2563eb, #60a5fa)",
    width: "100%",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
  },
  cardHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  cardIconBox: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
  },
  cardSubtitle: {
    fontSize: "11px",
    color: "#94a3b8",
    margin: "1px 0 0 0",
  },
  // ── Form grid
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
    padding: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
  },
  label: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    fontSize: "13px",
    color: "#334155",
    background: "#f8faff",
    border: "1px solid #dbeafe",
    borderRadius: "10px",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  select: {
    width: "100%",
    padding: "9px 12px",
    fontSize: "13px",
    color: "#334155",
    background: "#f8faff",
    border: "1px solid #dbeafe",
    borderRadius: "10px",
    outline: "none",
    boxSizing: "border-box" as const,
    appearance: "none" as const,
  },
  formFooter: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    borderTop: "1px solid #f1f5f9",
    background: "#fafcff",
  },
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 18px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
  },
  btnCancel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  // ── Table toolbar
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "1px solid #f1f5f9",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  searchWrap: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    paddingLeft: "32px",
    paddingRight: "12px",
    paddingTop: "8px",
    paddingBottom: "8px",
    fontSize: "12px",
    color: "#334155",
    background: "#f8faff",
    border: "1px solid #dbeafe",
    borderRadius: "10px",
    outline: "none",
    width: "180px",
  },
  searchIcon: {
    position: "absolute" as const,
    left: "10px",
    color: "#93c5fd",
    pointerEvents: "none" as const,
  },
  filterSelect: {
    padding: "8px 12px",
    fontSize: "12px",
    color: "#475569",
    background: "#f8faff",
    border: "1px solid #dbeafe",
    borderRadius: "10px",
    outline: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  countBadge: {
    fontSize: "11px",
    fontWeight: 800,
    color: "#2563eb",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    padding: "3px 12px",
  },
  // ── Table
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  th: {
    padding: "10px 16px",
    textAlign: "left" as const,
    fontSize: "10px",
    fontWeight: 800,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    background: "#f8faff",
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f8faff",
    verticalAlign: "middle" as const,
  },
  // ── Role badges
  badgeSuperAdmin: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "10px",
    fontWeight: 700,
    color: "#7c3aed",
    background: "#f5f3ff",
    border: "1px solid #ddd6fe",
    borderRadius: "999px",
    padding: "3px 10px",
  },
  badgeAdmin: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "10px",
    fontWeight: 700,
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    padding: "3px 10px",
  },
  badgeUser: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "10px",
    fontWeight: 700,
    color: "#475569",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    padding: "3px 10px",
  },
  // ── Action buttons
  btnEdit: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#2563eb",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  btnDelete: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#ef4444",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  // ── Avatar palette (inline gradient via style)
  avatarPalette: [
    { from: "#3b82f6", to: "#1d4ed8" },
    { from: "#60a5fa", to: "#2563eb" },
    { from: "#818cf8", to: "#4f46e5" },
    { from: "#38bdf8", to: "#0284c7" },
  ],
  tableFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "#fafcff",
    borderTop: "1px solid #f1f5f9",
  },
};

// ─────────────────────────────────────────────
export default function KelolaAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("semua");
  const [form, setForm] = useState({
    name: "", email: "", password: "", nik: "", no_tlp: "", role: "admin",
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/superadmin/users");
      setUsers(res.data);
    } catch (err) { console.log(err); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setEditId(null);
    setForm({ name: "", email: "", password: "", nik: "", no_tlp: "", role: "admin" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/superadmin/users/${editId}`, form);
        alert("User berhasil diupdate!");
      } else {
        await api.post("/superadmin/users", form);
        alert("User berhasil ditambahkan!");
      }
      fetchUsers();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    } finally { setLoading(false); }
  };

  const handleEdit = (user: any) => {
    setEditId(user.id);
    setForm({ name: user.name, email: user.email, password: "", nik: user.nik || "", no_tlp: user.no_tlp, role: user.role });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await api.delete(`/superadmin/users/${id}`);
      fetchUsers();
    } catch (err) { console.log(err); }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.no_tlp?.includes(q);
    const matchRole = filterRole === "semua" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;
  const superAdminCount = users.filter((u) => u.role === "superadmin").length;

  return (
    <div style={S.page}>

      {/* ── PAGE HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 800, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
              Manajemen Akun
            </p>
            <h1 style={S.pageTitle}>
              Kelola <span style={{ color: "#2563eb" }}>Users</span>
            </h1>
            <p style={S.pageSubtitle}>Tambah, edit, dan kelola akun admin maupun user sistem.</p>
          </div>

          {/* Stat pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { label: "Total", value: users.length, dot: "#2563eb" },
              { label: "Super Admin", value: superAdminCount, dot: "#7c3aed" },
              { label: "Admin", value: adminCount, dot: "#38bdf8" },
              { label: "User", value: userCount, dot: "#94a3b8" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fff", border: "1px solid #e8f0fe", borderRadius: "999px", padding: "5px 12px", boxShadow: "0 1px 3px rgba(37,99,235,0.05)" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                <span style={{ fontSize: "11px", color: "#64748b" }}>{s.label}</span>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#1e293b" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── FORM CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        style={S.card}
      >
        <div style={S.cardTopBar} />

        {/* Form card header */}
        <div style={S.cardHeader}>
          <div style={S.cardHeaderLeft}>
            <div style={S.cardIconBox}>
              <UserPlus size={15} color="#fff" />
            </div>
            <div>
              <p style={S.cardTitle}>{editId ? "Edit User" : "Tambah User Baru"}</p>
              <p style={S.cardSubtitle}>{editId ? "Perbarui informasi akun yang dipilih" : "Isi form untuk membuat akun baru"}</p>
            </div>
          </div>
          <AnimatePresence>
            {editId && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={resetForm}
                style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "5px 10px", cursor: "pointer" }}
              >
                <X size={12} /> Batal Edit
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit}>
          <div style={S.formGrid}>
            {/* Nama */}
            <div style={S.formGroup}>
              <label style={S.label}><User size={10} /> Nama Lengkap</label>
              <input style={S.input} type="text" name="name" placeholder="Masukkan nama lengkap" required value={form.name} onChange={handleChange}
                onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            {/* Email */}
            <div style={S.formGroup}>
              <label style={S.label}><Mail size={10} /> Alamat Email</label>
              <input style={S.input} type="email" name="email" placeholder="nama@email.com" required value={form.email} onChange={handleChange}
                onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            {/* Password */}
            <div style={S.formGroup}>
              <label style={S.label}><Lock size={10} /> Password</label>
              <input style={S.input} type="password" name="password" placeholder={editId ? "Kosongkan jika tidak diubah" : "Masukkan password"} required={!editId} value={form.password} onChange={handleChange}
                onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            {/* No HP */}
            <div style={S.formGroup}>
              <label style={S.label}><Phone size={10} /> Nomor HP</label>
              <input style={S.input} type="text" name="no_tlp" placeholder="08xxxxxxxxxx" required value={form.no_tlp} onChange={handleChange}
                onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            {/* Role */}
            <div style={S.formGroup}>
              <label style={S.label}><ShieldCheck size={10} /> Role</label>
              <select style={S.select} name="role" value={form.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            {/* NIK conditional */}
            <AnimatePresence>
              {form.role === "user" && (
                <motion.div
                  key="nik"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={S.formGroup}>
                    <label style={S.label}><CreditCard size={10} /> NIK</label>
                    <input style={S.input} type="text" name="nik" placeholder="Nomor Induk Kependudukan" value={form.nik} onChange={handleChange}
                      onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form footer */}
          <div style={S.formFooter}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading} style={{ ...S.btnPrimary, opacity: loading ? 0.65 : 1 }}>
              {loading ? <RefreshCw size={13} className="animate-spin" /> : <UserPlus size={13} />}
              {loading ? "Menyimpan..." : editId ? "Update User" : "Tambah User"}
            </motion.button>
            {editId && (
              <button type="button" onClick={resetForm} style={S.btnCancel}>
                <X size={12} /> Batal
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* ── TABLE CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        style={S.card}
      >
        {/* Table header */}
        <div style={S.toolbar}>
          <div style={S.cardHeaderLeft}>
            <div style={S.cardIconBox}>
              <Users size={15} color="#fff" />
            </div>
            <div>
              <p style={S.cardTitle}>Daftar User</p>
              <p style={S.cardSubtitle}>Semua akun terdaftar dalam sistem</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Search */}
            <div style={S.searchWrap}>
              <span style={S.searchIcon}><Search size={13} /></span>
              <input
                style={S.searchInput}
                type="text"
                placeholder="Cari user..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Filter role */}
            <select style={S.filterSelect} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="semua">Semua Role</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            {/* Count badge */}
            <span style={S.countBadge}>{filtered.length} akun</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Pengguna", "Kontak", "Role", "Aksi"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Users size={20} color="#bfdbfe" />
                      </div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", margin: 0 }}>Belum ada data user</p>
                      <p style={{ fontSize: "11px", color: "#cbd5e1", margin: 0 }}>Tambahkan user baru menggunakan form di atas</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => {
                  const palette = S.avatarPalette[i % S.avatarPalette.length];
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ background: "#fff" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#f0f6ff")}
                      onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                    >
                      {/* Pengguna */}
                      <td style={S.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0,
                            background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "12px", fontWeight: 800, color: "#fff",
                            boxShadow: "0 2px 6px rgba(37,99,235,0.2)",
                          }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", margin: 0 }}>{user.name}</p>
                            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "1px 0 0 0" }}>{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Kontak */}
                      <td style={S.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#64748b" }}>
                          <Phone size={12} color="#bfdbfe" />
                          {user.no_tlp}
                        </div>
                      </td>

                      {/* Role badge */}
                      <td style={S.td}>
                        {user.role === "superadmin" ? (
                          <span style={S.badgeSuperAdmin}><ShieldCheck size={10} /> Super Admin</span>
                        ) : user.role === "admin" ? (
                          <span style={S.badgeAdmin}><ShieldCheck size={10} /> Admin</span>
                        ) : (
                          <span style={S.badgeUser}><User size={10} /> User</span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td style={S.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={() => handleEdit(user)} style={S.btnEdit}>
                            <Pencil size={11} /> Edit
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} onClick={() => handleDelete(user.id)} style={S.btnDelete}>
                            <Trash2 size={11} /> Hapus
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div style={S.tableFooter}>
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
              Menampilkan <strong style={{ color: "#334155" }}>{filtered.length}</strong> dari <strong style={{ color: "#334155" }}>{users.length}</strong> akun
            </p>
          </div>
        )}
      </motion.div>

    </div>
  );
}