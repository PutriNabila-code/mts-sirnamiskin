"use client";

export default function KelolaWebsitePage() {
  return (
    <main className="min-h-screen bg-green-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => (window.location.href = "/admin")}
            className="text-green-800 font-semibold hover:underline mb-4"
          >
            ← Kembali ke Admin
          </button>

          <h1 className="text-3xl font-bold text-green-900">
            Kelola Website Sekolah
          </h1>

          <p className="text-gray-600 mt-2">
            Kelola informasi dan konten website MTs Sirnamiskin.
          </p>
        </div>

        {/* DROPDOWN */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 mb-8">
          <details className="group">
            <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between font-semibold text-green-900">
              <span>Menu Kelola Website</span>
              <span className="group-open:rotate-180 transition">
                ▼
              </span>
            </summary>

            <div className="border-t border-gray-100">

              <a
                href="/admin/website/profil"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>🏫</span>
                Profil Sekolah
              </a>

              <a
                href="/admin/website/visi-misi"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>🎯</span>
                Visi & Misi
              </a>

              <a
                href="/admin/website/fasilitas"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>🏢</span>
                Fasilitas
              </a>

              <a
                href="/admin/website/program-kelas"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>📚</span>
                Program Kelas
              </a>

              <a
                href="/admin/website/tenaga-pengajar"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>👨‍🏫</span>
                Tenaga Pengajar
              </a>

              {/* PRESTASI SISWA */}
              <a
                href="/admin/website/prestasi"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>🏆</span>
                Prestasi Siswa
              </a>

              <a
                href="/admin/website/ekstrakurikuler"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>⚽</span>
                Ekstrakurikuler
              </a>

              <a
                href="/admin/website/berita"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>📰</span>
                Berita & Kegiatan
              </a>

              <a
                href="/admin/website/kontak"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>📞</span>
                Kontak & Media Sosial
              </a>

              <a
                href="/admin/spmb"
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition"
              >
                <span>📝</span>
                SPMB
              </a>

            </div>
          </details>
        </div>

        {/* CARD MENU */}
        <div className="space-y-4">

          {/* PROFIL */}
          <a
            href="/admin/website/profil"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                🏫
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  Profil Sekolah
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola informasi profil sekolah.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

          {/* VISI MISI */}
          <a
            href="/admin/website/visi-misi"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                🎯
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  Visi & Misi
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola visi dan misi sekolah.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

          {/* FASILITAS */}
          <a
            href="/admin/website/fasilitas"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                🏢
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  Fasilitas
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola data fasilitas sekolah.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

          {/* PROGRAM KELAS */}
          <a
            href="/admin/website/program-kelas"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                📚
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  Program Kelas
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola program kelas sekolah.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

          {/* TENAGA PENGAJAR */}
          <a
            href="/admin/website/tenaga-pengajar"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                👨‍🏫
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  Tenaga Pengajar
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola data tenaga pengajar sekolah.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

          {/* PRESTASI SISWA */}
          <a
            href="/admin/website/prestasi"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                🏆
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  Prestasi Siswa
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola data prestasi siswa sekolah.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

          {/* EKSTRAKURIKULER */}
          <a
            href="/admin/website/ekstrakurikuler"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                ⚽
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  Ekstrakurikuler
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola kegiatan ekstrakurikuler.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

          {/* BERITA */}
          <a
            href="/admin/website/berita"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                📰
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  Berita & Kegiatan
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola berita dan kegiatan sekolah.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

          {/* KONTAK */}
          <a
            href="/admin/website/kontak"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                📞
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  Kontak & Media Sosial
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola kontak dan media sosial sekolah.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

          {/* SPMB */}
          <a
            href="/admin/spmb"
            className="group bg-green-800 rounded-2xl border border-green-700 p-5 flex items-center justify-between shadow-md hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-green-950 flex items-center justify-center text-2xl shadow-sm">
                📝
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">
                  SPMB
                </h3>

                <p className="text-green-100 text-sm mt-1">
                  Kelola sistem SPMB sekolah.
                </p>
              </div>
            </div>

            <span className="text-yellow-300 text-xl group-hover:translate-x-1 transition">
              →
            </span>
          </a>

        </div>
      </div>
    </main>
  );
}