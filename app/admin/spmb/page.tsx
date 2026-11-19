
"use client";

import { useRouter } from "next/navigation";

export default function AdminSPMBPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-green-600">
            SPMB ONLINE
          </p>

          <h1 className="mt-3 text-4xl font-black text-slate-900 md:text-5xl">
            Beranda SPMB
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Kelola sistem penerimaan murid baru MTs Sirnamiskin.
          </p>
        </div>

        {/* MENU */}
        <div className="grid gap-7 md:grid-cols-2">

          {/* DATA PENDAFTAR */}
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-4xl">
                📋
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Data Pendaftar
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Kelola dan lihat data calon siswa yang mendaftar
                  melalui sistem SPMB Online.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/admin/daftar-siswa")}
                  className="mt-6 font-bold text-green-600 transition hover:text-green-800"
                >
                  Kelola Data Pendaftar →
                </button>
              </div>
            </div>
          </section>

          {/* INFORMASI SPMB */}
          <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-4xl">
                📢
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Informasi SPMB
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Kelola informasi pendaftaran, periode gelombang,
                  batas pendaftaran, dan jadwal seleksi calon siswa.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/admin/spmb/gelombang")}
                  className="mt-6 font-bold text-green-600 transition hover:text-green-800"
                >
                  Kelola Informasi SPMB →
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* KEMBALI */}
        <div className="mt-10">
          <button
            type="button"
            onClick={() => router.push("/admin/website")}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-gray-50"
          >
            ← Kembali ke Kelola Website
          </button>
        </div>

      </div>
    </main>
  );
}
