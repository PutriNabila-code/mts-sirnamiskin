"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

export default function LoginAdminPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan kata sandi wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        alert("Email atau kata sandi salah. Silakan coba lagi.");
        return;
      }

      alert("Login berhasil!");

      router.push("/admin");
    } catch (error) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* BACKGROUND FOTO */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/login-bg.jpeg')",
        }}
      />

      {/* BLUR BACKGROUND */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-md" />

      {/* OVERLAY HIJAU */}
      <div className="absolute inset-0 bg-green-950/20" />

      {/* KONTEN LOGIN */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">

        <div className="w-full max-w-md rounded-3xl border border-white/40 bg-white/95 p-8 shadow-2xl">

          {/* LOGO */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-lg ring-4 ring-green-100">
              <img
                src="/logo-sirnamiskin.png"
                alt="Logo MTs Sirnamiskin"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* JUDUL */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-green-900">
              Login Admin
            </h1>

            <p className="mt-2 text-gray-500">
              MTs Sirnamiskin
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Panel Administrator Website
            </p>
          </div>

          {/* FORM LOGIN ADMIN */}
          <form
            onSubmit={handleLogin}
            autoComplete="off"
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block font-semibold text-gray-700"
              >
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                name="admin-email"
                autoComplete="off"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email admin"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-800 outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block font-semibold text-gray-700"
              >
                Kata Sandi
              </label>

              <input
                id="admin-password"
                type="password"
                name="admin-password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-800 outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-700 px-4 py-3.5 font-bold text-white shadow-lg transition hover:bg-green-800 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Memproses..." : "Login Admin"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="mt-7 border-t border-gray-200 pt-5 text-center">
            <p className="text-xs text-gray-400">
              Akses khusus administrator
            </p>

            <p className="mt-1 text-xs text-gray-400">
              © MTs Sirnamiskin
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}