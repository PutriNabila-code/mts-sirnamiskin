"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

type ProgramKelas = {
  id: number;
  kategori: string;
  nama_program: string;
  deskripsi: string;
};

export default function ProgramKelasPage() {
  const router = useRouter();

  const [data, setData] = useState<ProgramKelas[]>([]);
  const [loading, setLoading] = useState(true);

  const [kategori, setKategori] = useState("Kelas Pilihan");
  const [namaProgram, setNamaProgram] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  // =========================
  // AMBIL DATA
  // =========================
  const ambilData = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("program_kelas")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      alert("Gagal mengambil data: " + error.message);
    } else {
      setData(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    ambilData();
  }, []);

  // =========================
  // SIMPAN DATA
  // =========================
  const simpanData = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaProgram.trim() || !deskripsi.trim()) {
      alert("Nama program dan deskripsi wajib diisi.");
      return;
    }

    // EDIT
    if (editId !== null) {
      const { error } = await supabase
        .from("program_kelas")
        .update({
          kategori: kategori,
          nama_program: namaProgram,
          deskripsi: deskripsi,
        })
        .eq("id", editId);

      if (error) {
        alert("Gagal mengubah data: " + error.message);
        return;
      }

      alert("Data berhasil diubah.");
    }

    // TAMBAH
    else {
      const { error } = await supabase
        .from("program_kelas")
        .insert([
          {
            kategori: kategori,
            nama_program: namaProgram,
            deskripsi: deskripsi,
          },
        ]);

      if (error) {
        alert("Gagal menambahkan data: " + error.message);
        return;
      }

      alert("Data berhasil ditambahkan.");
    }

    setKategori("Kelas Pilihan");
    setNamaProgram("");
    setDeskripsi("");
    setEditId(null);

    ambilData();
  };

  // =========================
  // EDIT DATA
  // =========================
  const editData = (item: ProgramKelas) => {
    setEditId(item.id);
    setKategori(item.kategori);
    setNamaProgram(item.nama_program);
    setDeskripsi(item.deskripsi);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // HAPUS DATA
  // =========================
  const hapusData = async (id: number) => {
    const yakin = confirm("Yakin ingin menghapus data ini?");

    if (!yakin) return;

    const { error } = await supabase
      .from("program_kelas")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Gagal menghapus data: " + error.message);
      return;
    }

    alert("Data berhasil dihapus.");

    ambilData();
  };

  // =========================
  // BATAL EDIT
  // =========================
  const batalEdit = () => {
    setEditId(null);
    setKategori("Kelas Pilihan");
    setNamaProgram("");
    setDeskripsi("");
  };

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Kelola Program Kelas
            </h1>

            <p className="mt-1 text-gray-600">
              Kelola data program kelas yang tersedia di MTs Sirnamiskin.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/website")}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
          >
            ← Kembali
          </button>
        </div>

        {/* FORM */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            {editId !== null
              ? "Edit Program Kelas"
              : "Tambah Program Kelas"}
          </h2>

          <form onSubmit={simpanData} className="space-y-4">

            {/* KATEGORI */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Kategori
              </label>

              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              >
                <option value="Kelas Pilihan">
                  Kelas Pilihan
                </option>

                <option value="Kelas Excellent">
                  Kelas Excellent (Kelas 8)
                </option>
              </select>
            </div>

            {/* NAMA PROGRAM */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Nama Program Kelas
              </label>

              <input
                type="text"
                value={namaProgram}
                onChange={(e) => setNamaProgram(e.target.value)}
                placeholder="Contoh: Kelas Coding"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            {/* DESKRIPSI */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Deskripsi
              </label>

              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Masukkan deskripsi program kelas..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            {/* BUTTON */}
            <div className="flex gap-3">

              <button
                type="submit"
                className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
              >
                {editId !== null
                  ? "Simpan Perubahan"
                  : "Tambah Data"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  onClick={batalEdit}
                  className="rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Batal
                </button>
              )}

            </div>
          </form>
        </div>

        {/* DATA */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Data Program Kelas
          </h2>

          {loading ? (
            <p className="text-gray-500">
              Memuat data...
            </p>
          ) : data.length === 0 ? (
            <p className="text-gray-500">
              Belum ada data program kelas.
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>
                  <tr className="bg-green-100">

                    <th className="border p-3 text-left">
                      No
                    </th>

                    <th className="border p-3 text-left">
                      Kategori
                    </th>

                    <th className="border p-3 text-left">
                      Nama Program
                    </th>

                    <th className="border p-3 text-left">
                      Deskripsi
                    </th>

                    <th className="border p-3 text-center">
                      Aksi
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {data.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="border p-3">
                        {index + 1}
                      </td>

                      <td className="border p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            item.kategori === "Kelas Excellent"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.kategori}
                        </span>
                      </td>

                      <td className="border p-3 font-semibold">
                        {item.nama_program}
                      </td>

                      <td className="border p-3">
                        {item.deskripsi}
                      </td>

                      <td className="border p-3">
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => editData(item)}
                            className="rounded-lg bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => hapusData(item.id)}
                            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                          >
                            Hapus
                          </button>

                        </div>
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