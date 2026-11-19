
"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const konfirmasi = window.confirm(
      "Apakah kamu yakin ingin keluar dari akun administrator?"
    );

    if (!konfirmasi) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Gagal logout: " + error.message);
      return;
    }

    router.replace("/login-admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 flex items-center justify-center p-5">

      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="text-center mb-10 text-white">

          <div className="flex justify-center mb-4">
            <img
              src="/logo-sirnamiskin.png"
              alt="Logo MTs Sirnamiskin"
              className="w-24 h-24 object-contain"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
            MTs SIRNAMISKIN
          </h1>

          <p className="text-green-100 mt-2 font-medium">
            Panel Administrator
          </p>

          <p className="text-green-100/80 mt-2 text-sm">
            Bismillah, kelola kebutuhan sekolah dengan mudah.
          </p>

        </div>

        {/* PILIH MODUL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* WEBSITE */}
          <a
            href="/admin/website"
            className="group bg-[#fffdf5] rounded-3xl p-7 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-yellow-200/50"
          >
            <div className="flex items-center justify-between mb-7">
              <div className="w-16 h-16 rounded-2xl bg-green-800 flex items-center justify-center text-3xl shadow-md">
                🏫
              </div>

              <span className="text-green-800 text-2xl group-hover:translate-x-1 transition">
                →
              </span>
            </div>

            <h2 className="text-2xl font-bold text-green-950">
              Kelola Website
            </h2>

            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              Profil, informasi, galeri, dan konten sekolah.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <div className="h-1 w-10 bg-yellow-500 rounded-full group-hover:w-16 transition-all"></div>
              <span className="text-xs text-yellow-600">
                Website Sekolah
              </span>
            </div>
          </a>

          {/* SPMB */}
          <a
            href="/admin/spmb"
            className="group bg-[#fffdf5] rounded-3xl p-7 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-yellow-200/50"
          >
            <div className="flex items-center justify-between mb-7">
              <div className="w-16 h-16 rounded-2xl bg-green-800 flex items-center justify-center text-3xl shadow-md">
                🎓
              </div>

              <span className="text-green-800 text-2xl group-hover:translate-x-1 transition">
                →
              </span>
            </div>

            <h2 className="text-2xl font-bold text-green-950">
              Kelola SPMB
            </h2>

            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
              Pendaftaran, data calon siswa, dan verifikasi.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <div className="h-1 w-10 bg-yellow-500 rounded-full group-hover:w-16 transition-all"></div>
              <span className="text-xs text-yellow-600">
                Sistem SPMB
              </span>
            </div>
          </a>

        </div>

        {/* FOOTER */}
        <div className="text-center mt-10">

          <p className="text-green-100/70 text-xs">
            ۞ MTs Sirnamiskin Bandung ۞
          </p>

          <button
            onClick={handleLogout}
            className="mt-4 text-red-200 hover:text-white text-sm transition font-medium"
          >
            Logout
          </button>

        </div>

      </div>

    </main>
  );
}
