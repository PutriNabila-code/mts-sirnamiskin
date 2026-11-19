"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

export default function ProfilSekolahPage() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);

  const [namaSekolah, setNamaSekolah] = useState("");
  const [npsn, setNpsn] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");

  const [pendahuluan, setPendahuluan] = useState("");
  const [sejarahSingkat, setSejarahSingkat] = useState("");
  const [kurikulumStatus, setKurikulumStatus] = useState("");
  const [mataPelajaran, setMataPelajaran] = useState("");

  const [deskripsi, setDeskripsi] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function getProfil() {
      const { data, error } = await supabase
        .from("profil_sekolah")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Gagal mengambil data:", error);
        alert("Gagal mengambil data profil sekolah.");
      }

      if (data) {
        setNamaSekolah(data.nama_sekolah || "");
        setNpsn(data.npsn || "");
        setAlamat(data.alamat || "");
        setTelepon(data.telepon || "");
        setEmail(data.email || "");

        setPendahuluan(data.pendahuluan || "");
        setSejarahSingkat(data.sejarah_singkat || "");
        setKurikulumStatus(data.kurikulum_status || "");
        setMataPelajaran(data.mata_pelajaran || "");

        setDeskripsi(data.deskripsi || "");
      }

      setLoading(false);
    }

    getProfil();
  }, []);

  async function handleSave() {
    setSaving(true);

    const { error } = await supabase
      .from("profil_sekolah")
      .upsert({
        id: 1,
        nama_sekolah: namaSekolah,
        npsn: npsn,
        alamat: alamat,
        telepon: telepon,
        email: email,

        pendahuluan: pendahuluan,
        sejarah_singkat: sejarahSingkat,
        kurikulum_status: kurikulumStatus,
        mata_pelajaran: mataPelajaran,

        deskripsi: deskripsi,
      });

    setSaving(false);

    if (error) {
      console.error("Gagal menyimpan:", error);
      alert("Gagal menyimpan perubahan: " + error.message);
      return;
    }

    alert("Profil sekolah berhasil disimpan!");

    router.push("/admin/website");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">

      {/* HEADER */}
      <header className="bg-green-950 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">

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
                  className="flex items-center gap-3 px-5 py-3 text-sm text-green-900 bg-green-50 font-semibold"
                >
                  🏫
                  <span>Profil Sekolah</span>
                </a>

                <a
                  href="/admin/website/visi-misi"
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 transition"
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

      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-10">

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
              🏫
            </div>

            <span className="text-yellow-700 text-sm font-bold tracking-wider">
              PROFIL SEKOLAH
            </span>

          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-green-950">
            Kelola Profil Sekolah
          </h2>

          <p className="text-green-900/60 mt-2">
            Kelola informasi utama mengenai MTs Sirnamiskin.
          </p>

        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">

          <div className="bg-green-800 px-6 md:px-8 py-5">
            <h3 className="text-lg font-bold text-white">
              Informasi Sekolah
            </h3>

            <p className="text-green-100 text-sm mt-1">
              Perbarui informasi yang akan ditampilkan pada website sekolah.
            </p>
          </div>

          <div className="p-6 md:p-8">

            {loading ? (
              <p className="text-center text-green-800 py-10">
                Memuat data sekolah...
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* NAMA SEKOLAH */}
                <div>
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Nama Sekolah
                  </label>

                  <input
                    type="text"
                    value={namaSekolah}
                    onChange={(e) => setNamaSekolah(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                  />
                </div>

                {/* NPSN */}
                <div>
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    NPSN
                  </label>

                  <input
                    type="text"
                    value={npsn}
                    onChange={(e) => setNpsn(e.target.value)}
                    placeholder="Masukkan NPSN"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                  />
                </div>

                {/* ALAMAT */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Alamat Sekolah
                  </label>

                  <textarea
                    rows={3}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Masukkan alamat lengkap sekolah"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition resize-none"
                  />
                </div>

                {/* TELEPON */}
                <div>
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Nomor Telepon
                  </label>

                  <input
                    type="text"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="Masukkan nomor telepon"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Email Sekolah
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email sekolah"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition"
                  />
                </div>

                {/* PENDAHULUAN */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Pendahuluan
                  </label>

                  <textarea
                    rows={8}
                    value={pendahuluan}
                    onChange={(e) => setPendahuluan(e.target.value)}
                    placeholder="Masukkan pendahuluan sekolah"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition resize-none"
                  />
                </div>

                {/* SEJARAH SINGKAT */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Sejarah Singkat
                  </label>

                  <textarea
                    rows={8}
                    value={sejarahSingkat}
                    onChange={(e) => setSejarahSingkat(e.target.value)}
                    placeholder="Masukkan sejarah singkat MTs Sirnamiskin"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition resize-none"
                  />
                </div>

                {/* KURIKULUM & STATUS */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Kurikulum & Status
                  </label>

                  <textarea
                    rows={6}
                    value={kurikulumStatus}
                    onChange={(e) => setKurikulumStatus(e.target.value)}
                    placeholder="Masukkan informasi kurikulum dan status madrasah"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition resize-none"
                  />
                </div>

                {/* MATA PELAJARAN */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Mata Pelajaran
                  </label>

                  <textarea
                    rows={8}
                    value={mataPelajaran}
                    onChange={(e) => setMataPelajaran(e.target.value)}
                    placeholder="Masukkan daftar mata pelajaran"
                    className="w-full px-4 py-3 rounded-xl border border-green-200 bg-green-50/40 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition resize-none"
                  />
                </div>

                {/* DESKRIPSI */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-green-950 mb-2">
                    Deskripsi Sekolah
                  </label>

                  <textarea
                    rows={6}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Masukkan deskripsi atau profil sekolah"
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