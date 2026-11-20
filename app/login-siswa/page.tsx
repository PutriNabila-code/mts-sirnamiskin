
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

export default function LoginSiswaPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    color: "#111827",
    WebkitTextFillColor: "#111827",
    colorScheme: "light" as const,
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    router.push("/spmb-siswa");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 px-5 py-10">
      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl bg-white p-7 shadow-2xl sm:p-9">

          {/* LOGO */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-md ring-4 ring-green-100">
              <img
                src="https://edolgydbyjiipurrscrg.supabase.co/storage/v1/object/public/profil/logo-sirnamiskin.png"
                alt="Logo MTs Sirnamiskin"
                className="h-full w-full object-contain p-2"
              />
            </div>
          </div>

          {/* JUDUL */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-600">
              SPMB ONLINE
            </p>

            <h1 className="mt-2 text-2xl font-black text-gray-900">
              Login Calon Siswa
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Silakan login untuk melanjutkan proses pendaftaran
              SPMB MTs Sirnamiskin.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            autoComplete="off"
            className="mt-7 space-y-5"
          >

            {/* EMAIL */}
            <div>
              <label
                htmlFor="siswa-email"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Email
              </label>

              <input
                id="siswa-email"
                type="email"
                name="siswa-email"
                autoComplete="off"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm !text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                style={inputStyle}
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="siswa-password"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Password
              </label>

              <input
                id="siswa-password"
                type="password"
                name="siswa-password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm !text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                style={inputStyle}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Login SPMB →"}
            </button>
          </form>

          {/* DAFTAR */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?
            </p>

            <button
              type="button"
              onClick={() => router.push("/daftar-siswa")}
              className="mt-2 font-bold text-green-700 hover:text-green-800"
            >
              Buat Akun SPMB
            </button>
          </div>

          {/* KEMBALI */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-xs font-semibold text-gray-400 hover:text-green-600"
            >
              ← Kembali ke Beranda
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
