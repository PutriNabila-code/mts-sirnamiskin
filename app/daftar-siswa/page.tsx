"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

export default function DaftarSiswaPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDaftar(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== konfirmasiPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nama_lengkap: nama,
          role: "siswa",
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Akun gagal dibuat.");
      setLoading(false);
      return;
    }

    // Kalau akun langsung mendapatkan session,
    // langsung masuk ke halaman SPMB
    if (data.session) {
      router.replace("/spmb-siswa");
      return;
    }

    // Kalau Supabase meminta verifikasi email
    setError(
      "Akun berhasil dibuat, tetapi email perlu diverifikasi terlebih dahulu. Silakan cek email kamu."
    );

    setLoading(false);
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
              Buat Akun SPMB
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Buat akun terlebih dahulu sebelum mengisi formulir
              pendaftaran.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleDaftar} className="mt-7 space-y-5">

            {/* NAMA */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Nama Lengkap
              </label>

              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama lengkap calon siswa"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: nama@gmail.com"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* KONFIRMASI */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Konfirmasi Password
              </label>

              <input
                type="password"
                value={konfirmasiPassword}
                onChange={(e) => setKonfirmasiPassword(e.target.value)}
                placeholder="Ulangi password"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Membuat Akun..." : "Daftar Akun →"}
            </button>
          </form>

          {/* LOGIN */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?
            </p>

            <button
              type="button"
              onClick={() => router.push("/login-siswa")}
              className="mt-2 font-bold text-green-700 hover:text-green-800"
            >
              Login Siswa
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