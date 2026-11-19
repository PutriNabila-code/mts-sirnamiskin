"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

type Ekstrakurikuler = {
  id: number;
  nama_ekstrakurikuler: string;
  deskripsi: string;
};

export default function EkstrakurikulerPage() {
  const router = useRouter();

  const [data, setData] = useState<Ekstrakurikuler[]>([]);
  const [loading, setLoading] = useState(true);

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  const ambilData = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("ekstrakurikuler")
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

  const simpanData = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim() || !deskripsi.trim()) {
      alert("Nama ekstrakurikuler dan deskripsi wajib diisi.");
      return;
    }

    if (editId !== null) {
      const { error } = await supabase
        .from("ekstrakurikuler")
        .update({
          nama_ekstrakurikuler: nama,
          deskripsi: deskripsi,
        })
        .eq("id", editId);

      if (error) {
        alert("Gagal mengubah data: " + error.message);
        return;
      }

      alert("Data berhasil diubah.");
    } else {
      const { error } = await supabase
        .from("ekstrakurikuler")
        .insert([
          {
            nama_ekstrakurikuler: nama,
            deskripsi: deskripsi,
          },
        ]);

      if (error) {
        alert("Gagal menambahkan data: " + error.message);
        return;
      }

      alert("Data berhasil ditambahkan.");
    }

    setNama("");
    setDeskripsi("");
    setEditId(null);

    ambilData();
  };

  const editData = (item: Ekstrakurikuler) => {
    setEditId(item.id);
    setNama(item.nama_ekstrakurikuler);
    setDeskripsi(item.deskripsi);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hapusData = async (id: number) => {
    const yakin = confirm("Yakin ingin menghapus data ini?");

    if (!yakin) return;

    const { error } = await supabase
      .from("ekstrakurikuler")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Gagal menghapus data: " + error.message);
      return;
    }

    alert("Data berhasil dihapus.");

    ambilData();
  };

  const batalEdit = () => {
    setEditId(null);
    setNama("");
    setDeskripsi("");
  };

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Kelola Ekstrakurikuler
            </h1>

            <p className="mt-1 text-gray-600">
              Kelola data kegiatan ekstrakurikuler sekolah.
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
              ? "Edit Ekstrakurikuler"
              : "Tambah Ekstrakurikuler"}
          </h2>

          <form onSubmit={simpanData} className="space-y-4">

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Nama Ekstrakurikuler
              </label>

              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Paskibra"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Deskripsi
              </label>

              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Masukkan deskripsi ekstrakurikuler..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div className="flex gap-3">

              <button
                type="submit"
                className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
              >
                {editId !== null ? "Simpan Perubahan" : "Tambah Data"}
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
            Data Ekstrakurikuler
          </h2>

          {loading ? (
            <p className="text-gray-500">Memuat data...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500">
              Belum ada data ekstrakurikuler.
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>
                  <tr className="bg-green-100">
                    <th className="border p-3 text-left">No</th>
                    <th className="border p-3 text-left">
                      Nama Ekstrakurikuler
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
                    <tr key={item.id} className="hover:bg-gray-50">

                      <td className="border p-3">
                        {index + 1}
                      </td>

                      <td className="border p-3 font-semibold">
                        {item.nama_ekstrakurikuler}
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