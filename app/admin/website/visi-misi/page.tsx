"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

export default function VisiMisiPage() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // AMBIL DATA VISI & MISI
  // =========================
  useEffect(() => {
    async function getVisiMisi() {
      const { data, error } = await supabase
        .from("visi_misi")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Gagal mengambil data:", error);
        alert("Gagal mengambil data visi dan misi.");
      }

      if (data) {
        setVisi(data.visi || "");
        setMisi(data.misi || "");
      }

      setLoading(false);
    }

    getVisiMisi();
  }, []);

  // =========================
  // SIMPAN DATA
  // =========================
  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("visi_misi")
      .upsert({
        id: 1,
        visi: visi,
        misi: misi,
      });

    setSaving(false);

    if (error) {
      console.error("Gagal menyimpan:", error);
      alert("Gagal menyimpan perubahan: " + error.message);
      return;
    }

    alert("Visi dan misi berhasil disimpan!");

    router.push("/admin/website");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">

      {/* =========================
          HEADER
      ========================= */}
      <header className="bg-green-950 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-4">
            <img
              src="/logo-sirnamiskin.png"
              alt="Logo MTs Sirnamiskin"
              className="w-12 h-12 object-contain"
            />

            <div>
              <h1 className="font-bold text-lg md:text-xl tracking-wide">
                MTs SIRNAMISKIN
              </h1>

              <p className="text-green-200 text-xs">
                Administrator Website
              </p>
            </div>
          </div>

          {/* MENU */}
          <div className="relative">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 hover:bg-green-700 border border-green-600 transition text-sm font-medium"
            >
              <span className="text-lg">☰</span>
              <span>Menu</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden z-50">

                <a
                  href="/admin/website"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition"
                >
                  ←
                  <span>Kelola Website</span>
                </a>

                <div className="border-t border-gray-100" />

                <a
                  href="/admin/website/profil"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition"
                >
                  🏫
                  <span>Profil Sekolah</span>
                </a>

                <a
                  href="/admin/website/visi-misi"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-green-900 bg-green-50 font-semibold"
                >
                  🎯
                  <span>Visi & Misi</span>
                </a>

                <a
                  href="/admin/website/fasilitas"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition"
                >
                  🏢
                  <span>Fasilitas</span>
                </a>

                <a
                  href="/admin/website/ekstrakurikuler"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition"
                >
                  ⚽
                  <span>Ekstrakurikuler</span>
                </a>

                <a
                  href="/admin/website/galeri"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition"
                >
                  🖼️
                  <span>Galeri Sekolah</span>
                </a>

                <a
                  href="/admin/website/program-kelas"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition"
                >
                  📚
                  <span>Program Kelas</span>
                </a>

                <a
                  href="/admin/website/kontak"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition"
                >
                  📱
                  <span>Kontak & Media Sosial</span>
                </a>

              </div>
            )}

          </div>
        </div>
      </header>

      {/* =========================
          CONTENT
      ========================= */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-10">

        {/* KEMBALI */}
        <a
          href="/admin/website"
          className="inline-flex items-center gap-2 text-green-800 hover:text-green-600 text-sm font-semibold transition mb-6"
        >
          ← Kembali ke Kelola Website
        </a>

        {/* TITLE */}
        <div className="mb-8">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-11 h-11 rounded-xl bg-green-800 flex items-center justify-center text-xl shadow-md">
              🎯
            </div>

            <span className="text-yellow-700 text-sm font-bold tracking-wider">
              VISI & MISI
            </span>

          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-green-950">
            Kelola Visi & Misi
          </h2>

          <p className="text-green-900/60 mt-2">
            Kelola visi dan misi MTs Sirnamiskin yang akan ditampilkan pada website.
          </p>

        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">

          {/* CARD HEADER */}
          <div className="bg-green-800 px-6 md:px-8 py-5">

            <h3 className="text-lg font-bold text-white">
              Informasi Visi & Misi
            </h3>

            <p className="text-green-100 text-sm mt-1">
              Perbarui visi dan misi sekolah.
            </p>

          </div>

          {/* FORM */}
          <div className="p-6 md:p-8">

            {loading ? (

              <p className="text-center text-green-800 py-10">
                Memuat data visi dan misi...
              </p>

            ) : (

              <div className="space-y-6">

                {/* VISI */}
                <div>

                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Visi Sekolah
                  </label>

                  <textarea
                    rows={5}
                    value={visi}
                    onChange={(e) => setVisi(e.target.value)}
                    placeholder="Masukkan visi sekolah"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition resize-none"
                  />

                </div>

                {/* MISI */}
                <div>

                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Misi Sekolah
                  </label>

                  <textarea
                    rows={10}
                    value={misi}
                    onChange={(e) => setMisi(e.target.value)}
                    placeholder="Masukkan misi sekolah"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition resize-none"
                  />

                </div>

              </div>

            )}

            {/* BUTTON */}
            <div className="flex justify-end mt-8 pt-6 border-t border-green-100">

              <button
                type="button"
                onClick={handleSave}
                disabled={loading || saving}
                className="px-7 py-3 rounded-xl bg-green-800 text-white font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>

            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-8 pb-5">

          <p className="text-green-900/50 text-xs">
            ۞ MTs Sirnamiskin Bandung ۞
          </p>

        </div>

      </section>

    </main>
  );
}