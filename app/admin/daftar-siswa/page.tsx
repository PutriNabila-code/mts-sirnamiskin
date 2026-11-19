"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

type Pendaftar = {
  id: number;
  nomor_pendaftaran: string | null;
  nama_lengkap: string;
  nisn: string | null;
  asal_sekolah: string | null;
  pilihan_kelas: string | null;
  no_hp: string | null;
  status: string | null;
  created_at: string | null;
};

export default function DaftarSiswaPage() {
  const router = useRouter();

  const [data, setData] = useState<Pendaftar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    const { data: pendaftar, error } = await supabase
      .from("pendaftar_spmb")
      .select(`
        id,
        nomor_pendaftaran,
        nama_lengkap,
        nisn,
        asal_sekolah,
        pilihan_kelas,
        no_hp,
        status,
        created_at
      `)
      .order("nama_lengkap", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data:", error);
      setError(error.message);
      setData([]);
    } else {
      setData(pendaftar || []);
    }

    setLoading(false);
  }

  function bukaDetail(id: number) {
    const url = `/admin/daftar-siswa/${id}`;

    console.log("Membuka detail:", url);

    router.push(url);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
              SPMB ONLINE
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
              Data Pendaftar
            </h1>

            <p className="mt-2 text-slate-600">
              Kelola dan lihat data calon siswa yang telah mendaftar.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/spmb")}
            className="w-fit rounded-xl border border-gray-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:bg-gray-100"
          >
            ← Kembali ke SPMB
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-bold">
              Gagal mengambil data pendaftar
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        )}

        {/* CARD */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

          {/* HEADER CARD */}
          <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Daftar Calon Siswa
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Total pendaftar:{" "}
                <span className="font-bold text-green-600">
                  {data.length}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              className="w-fit rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
            >
              ↻ Refresh
            </button>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl">
                ⏳
              </div>

              <p className="mt-3 font-semibold text-slate-600">
                Memuat data pendaftar...
              </p>
            </div>
          ) : data.length === 0 ? (
            /* DATA KOSONG */
            <div className="px-6 py-16 text-center">
              <div className="text-5xl">
                📋
              </div>

              <h3 className="mt-4 text-xl font-black text-slate-800">
                Belum ada data pendaftar
              </h3>

              <p className="mt-2 text-slate-500">
                Data siswa yang mendaftar melalui SPMB akan muncul di sini.
              </p>
            </div>
          ) : (
            /* TABLE */
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-black text-slate-700">
                      No
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-black text-slate-700">
                      No. Pendaftaran
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-black text-slate-700">
                      Nama Lengkap
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-black text-slate-700">
                      NISN
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-black text-slate-700">
                      Asal Sekolah
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-black text-slate-700">
                      Pilihan Kelas
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-black text-slate-700">
                      No. HP
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-black text-slate-700">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-center text-sm font-black text-slate-700">
                      Aksi
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 transition hover:bg-green-50"
                    >

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {index + 1}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-green-700">
                        {item.nomor_pendaftaran || "-"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-slate-800">
                        {item.nama_lengkap}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {item.nisn || "-"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {item.asal_sekolah || "-"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {item.pilihan_kelas || "-"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {item.no_hp || "-"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === "Diterima"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Ditolak"
                              ? "bg-red-100 text-red-700"
                              : item.status === "Diverifikasi"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status || "Menunggu Verifikasi"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => bukaDetail(item.id)}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                        >
                          Lihat Detail
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}