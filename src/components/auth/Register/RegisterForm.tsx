"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Phone,
  CreditCard,
  ArrowRight,
} from "lucide-react";

import { registerUser } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  // FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nik: "",
    no_tlp: "",
  });

  // ERROR STATE
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    nik: "",
    no_tlp: "",
  });

  const [loading, setLoading] =
    useState(false);

  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // HAPUS ERROR
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // HANDLE REGISTER
  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    let newErrors = {
      name: "",
      email: "",
      password: "",
      nik: "",
      no_tlp: "",
    };

    // VALIDASI
    if (!formData.name) {
      newErrors.name =
        "Nama wajib diisi";
    }

    if (!formData.email) {
      newErrors.email =
        "Email wajib diisi";
    }

    if (!formData.password) {
      newErrors.password =
        "Password wajib diisi";
    }

    if (!formData.nik) {
      newErrors.nik =
        "NIK wajib diisi";
    }

    if (!formData.no_tlp) {
      newErrors.no_tlp =
        "Nomor telepon wajib diisi";
    }

    setErrors(newErrors);

    // STOP JIKA ADA ERROR
    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.password ||
      newErrors.nik ||
      newErrors.no_tlp
    ) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await registerUser(formData);

      alert(response.message);
      // REDIRECT HOMEPAGE USER
      router.push("/homepage");

    } catch (error: any) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Register gagal"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">

      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Buat Akun
        </h1>

        <p className="text-slate-500 mt-2">
          Daftar untuk mulai membuat laporan
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >

        {/* NAMA */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Nama Lengkap
          </label>

          <div
            className={`mt-2 flex items-center rounded-xl px-4 h-12 border
            ${
              errors.name
                ? "border-red-500"
                : "border-slate-200"
            }`}
          >
            <User className="w-5 h-5 text-slate-400" />

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="w-full h-full outline-none px-3 text-sm bg-transparent"
            />
          </div>

          {errors.name && (
            <p className="text-red-500 text-xs mt-2">
              {errors.name}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Email
          </label>

          <div
            className={`mt-2 flex items-center rounded-xl px-4 h-12 border
            ${
              errors.email
                ? "border-red-500"
                : "border-slate-200"
            }`}
          >
            <Mail className="w-5 h-5 text-slate-400" />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className="w-full h-full outline-none px-3 text-sm bg-transparent"
            />
          </div>

          {errors.email && (
            <p className="text-red-500 text-xs mt-2">
              {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Password
          </label>

          <div
            className={`mt-2 flex items-center rounded-xl px-4 h-12 border
            ${
              errors.password
                ? "border-red-500"
                : "border-slate-200"
            }`}
          >
            <Lock className="w-5 h-5 text-slate-400" />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className="w-full h-full outline-none px-3 text-sm bg-transparent"
            />
          </div>

          {errors.password && (
            <p className="text-red-500 text-xs mt-2">
              {errors.password}
            </p>
          )}
        </div>

        {/* NIK */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            NIK
          </label>

          <div
            className={`mt-2 flex items-center rounded-xl px-4 h-12 border
            ${
              errors.nik
                ? "border-red-500"
                : "border-slate-200"
            }`}
          >
            <CreditCard className="w-5 h-5 text-slate-400" />

            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder="Masukkan NIK"
              className="w-full h-full outline-none px-3 text-sm bg-transparent"
            />
          </div>

          {errors.nik && (
            <p className="text-red-500 text-xs mt-2">
              {errors.nik}
            </p>
          )}
        </div>

        {/* NO TELP */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Nomor Telepon
          </label>

          <div
            className={`mt-2 flex items-center rounded-xl px-4 h-12 border
            ${
              errors.no_tlp
                ? "border-red-500"
                : "border-slate-200"
            }`}
          >
            <Phone className="w-5 h-5 text-slate-400" />

            <input
              type="text"
              name="no_tlp"
              value={formData.no_tlp}
              onChange={handleChange}
              placeholder="Masukkan nomor telepon"
              className="w-full h-full outline-none px-3 text-sm bg-transparent"
            />
          </div>

          {errors.no_tlp && (
            <p className="text-red-500 text-xs mt-2">
              {errors.no_tlp}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              Daftar
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* LINK LOGIN */}
      <p className="text-sm text-center text-slate-500 mt-6">
        Sudah punya akun?{" "}
        <Link
          href="/auth/login"
          className="text-indigo-600 font-semibold hover:underline"
        >
          Masuk
        </Link>
      </p>
    </div>
  );
}