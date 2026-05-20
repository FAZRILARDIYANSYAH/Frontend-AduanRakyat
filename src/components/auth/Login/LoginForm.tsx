"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "@/context/authContext";

export default function LoginForm() {
  const { login } =
    useAuth();

  const [formData,
    setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [errors,
    setErrors] =
    useState({
      email: "",
      password: "",
    });

  const [loading,
    setLoading] =
    useState(false);

  // HANDLE INPUT
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]:
        "",
    });
  };

  // HANDLE LOGIN
  const handleLogin =
    async (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();

      const newErrors = {
        email: "",
        password: "",
      };

      // VALIDASI EMAIL
      if (
        !formData.email
      ) {
        newErrors.email =
          "Email wajib diisi";
      }

      // VALIDASI PASSWORD
      if (
        !formData.password
      ) {
        newErrors.password =
          "Password wajib diisi";
      }

      setErrors(
        newErrors
      );

      if (
        newErrors.email ||
        newErrors.password
      ) {
        return;
      }

      try {
        setLoading(true);

        // LOGIN
        await login(
          formData.email,
          formData.password
        );

        // SUCCESS TOAST
        toast.success(
          "Login berhasil!"
        );

      } catch (
        error: any
      ) {
        // ERROR TOAST
        toast.error(
          error.message ||
          "Login gagal"
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
          Selamat Datang
        </h1>

        <p className="text-slate-500 mt-2">
          Masuk ke akun
          AduanRakyat
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={
          handleLogin
        }
        className="space-y-5"
      >

        {/* EMAIL */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Email
          </label>

          <div
            className={`mt-2 flex items-center rounded-xl px-4 h-12 border transition-all ${
              errors.email
                ? "border-red-500"
                : "border-slate-200 focus-within:border-indigo-500"
            }`}
          >
            <Mail className="w-5 h-5 text-slate-400" />

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              placeholder="Masukkan email"
              className="w-full h-full outline-none px-3 text-sm bg-transparent"
            />
          </div>

          {errors.email && (
            <p className="text-red-500 text-xs mt-2 ml-1">
              {
                errors.email
              }
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Password
          </label>

          <div
            className={`mt-2 flex items-center rounded-xl px-4 h-12 border transition-all ${
              errors.password
                ? "border-red-500"
                : "border-slate-200 focus-within:border-indigo-500"
            }`}
          >
            <Lock className="w-5 h-5 text-slate-400" />

            <input
              type="password"
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="Masukkan password"
              className="w-full h-full outline-none px-3 text-sm bg-transparent"
            />
          </div>

          {errors.password && (
            <p className="text-red-500 text-xs mt-2 ml-1">
              {
                errors.password
              }
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={
            loading
          }
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 transition rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            "Loading..."
          ) : (
            <>
              Masuk
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* LINK */}
      <p className="text-sm text-center text-slate-500 mt-6">
        Belum punya
        akun?{" "}
        <Link
          href="/auth/register"
          className="text-indigo-600 font-semibold hover:underline"
        >
          Daftar
        </Link>
      </p>
    </div>
  );
}