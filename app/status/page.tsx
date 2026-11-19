"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

type Gelombang = {
  id: number;
  nama_gelombang: string;
  tanggal_mulai_pendaftaran: string;
  tanggal_batas_pendaftaran: string;
  tanggal_seleksi: string;
};

type Pendaftar = {
  id: number;
  user_id: string;
  nomor_pendaftaran: string;
  pilihan_kelas: string;
  status: string;
  nama_lengkap: string;
  hasil_seleksi: string | null;
  catatan_seleksi: string | null;
  created_at: string;
  gelombang_id: number | null;
  gelombang: Gelombang | null;
};

export default function StatusSPMBPage() {
  const router = useRouter();

  const [data, setData] = useState<Pendaftar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ambilData();
  }, []);

  async function ambilData() {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/login");
      return;
    }

    const { data: pendaftar, error: pendaftarError } = await supabase
      .from("pendaftar_spmb")
      .select(
        `
        id,
        user_id,
        nomor_pendaftaran,
        pilihan_kelas,
        status,
        nama_lengkap,
        hasil_seleksi,
        catatan_seleksi,
        created_at,
        gelombang_id,
        gelombang_spmb (
          id,
          nama_gelombang,
          tanggal_mulai_pendaftaran,
          tanggal_batas_pendaftaran,
          tanggal_seleksi
        )
        `
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (pendaftarError) {
      console.error("ERROR PENDAFTAR:", pendaftarError);

      setError(
        "Gagal mengambil data pendaftaran: " +
          pendaftarError.message
      );

      setLoading(false);
      return;
    }

    if (!pendaftar) {
      setError(
        "Data pendaftaran SPMB belum ditemukan. Silakan melakukan pendaftaran terlebih dahulu."
      );

      setLoading(false);
      return;
    }

    console.log("DATA PENDAFTAR:", pendaftar);

    const gelombangData = Array.isArray(pendaftar.gelombang_spmb)
      ? pendaftar.gelombang_spmb[0] || null
      : pendaftar.gelombang_spmb || null;

    const dataFinal: Pendaftar = {
      id: pendaftar.id,
      user_id: pendaftar.user_id,
      nomor_pendaftaran: pendaftar.nomor_pendaftaran,
      pilihan_kelas: pendaftar.pilihan_kelas,
      status: pendaftar.status,
      nama_lengkap: pendaftar.nama_lengkap,
      hasil_seleksi: pendaftar.hasil_seleksi,
      catatan_seleksi: pendaftar.catatan_seleksi,
      created_at: pendaftar.created_at,
      gelombang_id: pendaftar.gelombang_id,
      gelombang: gelombangData,
    };

    setData(dataFinal);
    setLoading(false);
  }

  function warnaStatus(status: string) {
    if (status === "Diverifikasi") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    if (status === "Diterima") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "Ditolak") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  function warnaHasil(hasil: string | null) {
    if (hasil === "Lulus") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (hasil === "Tidak Lulus") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    if (hasil === "Menunggu Hasil Seleksi") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  function formatTanggal(tanggal: string) {
    if (!tanggal) return "-";

    return new Date(tanggal + "T00:00:00").toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  function teksStatusPendaftaran(status: string) {
    if (status === "Diterima") {
      return "Selamat! Pendaftaran kamu telah dinyatakan diterima oleh MTs SIRNAMISKIN.";
    }

    if (status === "Ditolak") {
      return "Pendaftaran kamu belum dapat diterima oleh MTs SIRNAMISKIN.";
    }

    if (status === "Diverifikasi") {
      return "Data pendaftaran kamu telah diverifikasi oleh pihak sekolah.";
    }

    return "Data pendaftaran kamu sedang diperiksa oleh pihak sekolah.";
  }

  function teksHasilSeleksi(hasil: string | null) {
    if (hasil === "Belum Mengikuti") {
      return "Silakan datang ke MTs SIRNAMISKIN untuk mengikuti proses seleksi sesuai jadwal yang telah ditentukan.";
    }

    if (hasil === "Menunggu Hasil Seleksi") {
      return "Kamu telah mengikuti proses seleksi. Hasil seleksi sedang diproses oleh pihak MTs SIRNAMISKIN.";
    }

    if (hasil === "Lulus") {
      return "Selamat! Kamu dinyatakan lulus dalam proses seleksi SPMB MTs SIRNAMISKIN.";
    }

    if (hasil === "Tidak Lulus") {
      return "Terima kasih telah mengikuti proses seleksi SPMB MTs SIRNAMISKIN.";
    }

    return "Hasil seleksi belum tersedia.";
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 text-sm font-bold text-green-600 transition hover:text-green-700"
          >
            ← Kembali
          </button>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-600">
            SISTEM SPMB
          </p>

          <h1 className="mt-2 text-3xl font-black text-gray-900">
            Status Pendaftaran
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Pantau status pendaftaran dan hasil seleksi kamu melalui
            halaman ini.
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-gray-500">
              Memuat status pendaftaran...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <p className="font-bold text-red-700">
              Data belum tersedia
            </p>

            <p className="mt-2 text-sm leading-relaxed text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-5 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
            >
              Kembali
            </button>
          </div>
        )}

        {/* DATA */}
        {!loading && !error && data && (
          <>
            {/* IDENTITAS */}
            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Nama Calon Siswa
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-900">
                {data.nama_lengkap}
              </h2>

              <p className="mt-2 text-sm font-bold text-green-700">
                No. Pendaftaran: {data.nomor_pendaftaran}
              </p>
            </section>

            {/* STATUS PENDAFTARAN */}
            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="text-xl font-black text-gray-900">
                📋 Status Pendaftaran
              </h2>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-black text-gray-900">
                      Status Pendaftaran: {data.status}
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {teksStatusPendaftaran(data.status)}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-4 py-2 text-xs font-bold ${warnaStatus(
                      data.status
                    )}`}
                  >
                    {data.status}
                  </span>
                </div>
              </div>
            </section>

            {/* JADWAL SELEKSI */}
            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="text-xl font-black text-gray-900">
                📅 Jadwal Seleksi
              </h2>

              {data.gelombang ? (
                <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-7">

                  <p className="text-sm font-bold text-green-600">
                    {data.gelombang.nama_gelombang}
                  </p>

                  <p className="mt-3 text-sm font-bold text-gray-500">
                    Periode Pendaftaran
                  </p>

                  <p className="mt-1 text-lg font-black text-gray-900">
                    {formatTanggal(
                      data.gelombang.tanggal_mulai_pendaftaran
                    )}{" "}
                    –{" "}
                    {formatTanggal(
                      data.gelombang.tanggal_batas_pendaftaran
                    )}
                  </p>

                  <div className="mt-5">
                    <p className="text-sm font-bold text-gray-500">
                      Tanggal Seleksi
                    </p>

                    <p className="mt-1 text-2xl font-black text-gray-900">
                      {formatTanggal(
                        data.gelombang.tanggal_seleksi
                      )}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-bold text-gray-500">
                      Lokasi Seleksi
                    </p>

                    <p className="mt-1 text-lg font-black text-green-700">
                      MTs SIRNAMISKIN
                    </p>
                  </div>

                  <div className="mt-6 rounded-xl bg-white p-4">
                    <p className="text-sm leading-relaxed text-gray-600">
                      Calon siswa diharapkan datang langsung ke sekolah
                      untuk mengikuti proses seleksi sesuai jadwal yang
                      telah ditentukan.
                    </p>
                  </div>

                  <p className="mt-3 text-xs italic text-gray-400">
                    * Tanggal seleksi ditentukan otomatis satu hari
                    setelah batas pendaftaran.
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-yellow-100 bg-yellow-50 p-6">
                  <p className="font-bold text-yellow-800">
                    Jadwal seleksi belum ditentukan.
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-yellow-700">
                    Silakan menunggu pihak sekolah menetapkan gelombang
                    pendaftaran dan jadwal seleksi kamu.
                  </p>
                </div>
              )}
            </section>

            {/* HASIL SELEKSI */}
            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="text-xl font-black text-gray-900">
                🎯 Hasil Seleksi
              </h2>

              <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-black text-gray-900">
                      Hasil Seleksi:{" "}
                      {data.hasil_seleksi || "Belum Ada Hasil"}
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      {teksHasilSeleksi(data.hasil_seleksi)}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-4 py-2 text-xs font-bold ${warnaHasil(
                      data.hasil_seleksi
                    )}`}
                  >
                    {data.hasil_seleksi || "Belum Ada Hasil"}
                  </span>
                </div>
              </div>

              {data.catatan_seleksi && (
                <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Catatan dari Sekolah
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {data.catatan_seleksi}
                  </p>
                </div>
              )}
            </section>

            {/* INFORMASI PENDAFTARAN */}
            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="mb-5 text-xl font-black text-gray-900">
                📌 Informasi Pendaftaran
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Nomor Pendaftaran
                  </p>

                  <p className="mt-1 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800">
                    {data.nomor_pendaftaran}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Pilihan Kelas
                  </p>

                  <p className="mt-1 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800">
                    {data.pilihan_kelas || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Tanggal Pendaftaran
                  </p>

                  <p className="mt-1 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800">
                    {formatTanggal(data.created_at)}
                  </p>
                </div>
              </div>
            </section>

            {/* CATATAN AKHIR */}
            <div className="rounded-3xl border border-green-100 bg-green-50 p-6 text-center">
              <p className="text-sm font-bold text-green-800">
                Pantau terus halaman ini untuk mendapatkan informasi
                terbaru mengenai proses SPMB kamu.
              </p>

              <p className="mt-2 text-xs leading-relaxed text-green-700">
                Hasil seleksi akan diperbarui oleh pihak sekolah
                setelah proses pemeriksaan selesai.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}