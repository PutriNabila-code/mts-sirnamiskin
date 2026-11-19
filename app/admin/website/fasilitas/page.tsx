"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

type Fasilitas = {
  id: number;
  nama_fasilitas: string;
  deskripsi: string | null;
};

export default function FasilitasAdminPage() {
  const router = useRouter();

  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [loading, setLoading] = useState(true);

  const [namaFasilitas, setNamaFasilitas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  // Ambil data fasilitas dari Supabase
  const fetchFasilitas = async () => {
    const { data, error } = await supabase
      .from("fasilitas")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      alert("Gagal mengambil data fasilitas: " + error.message);
      return;
    }

    setFasilitas(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFasilitas();
  }, []);

  // Simpan / update fasilitas
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaFasilitas.trim()) {
      alert("Nama fasilitas harus diisi.");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("fasilitas")
        .update({
          nama_fasilitas: namaFasilitas,
          deskripsi: deskripsi,
        })
        .eq("id", editingId);

      if (error) {
        alert("Gagal mengubah fasilitas: " + error.message);
        return;
      }

      alert("Fasilitas berhasil diubah.");
    } else {
      const { error } = await supabase
        .from("fasilitas")
        .insert({
          nama_fasilitas: namaFasilitas,
          deskripsi: deskripsi,
        });

      if (error) {
        alert("Gagal menambahkan fasilitas: " + error.message);
        return;
      }

      alert("Fasilitas berhasil ditambahkan.");
    }

    setNamaFasilitas("");
    setDeskripsi("");
    setEditingId(null);

    fetchFasilitas();
  };

  // Edit fasilitas
  const handleEdit = (item: Fasilitas) => {
    setEditingId(item.id);
    setNamaFasilitas(item.nama_fasilitas);
    setDeskripsi(item.deskripsi || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Hapus fasilitas
  const handleDelete = async (id: number) => {
    const yakin = confirm("Yakin ingin menghapus fasilitas ini?");

    if (!yakin) return;

    const { error } = await supabase
      .from("fasilitas")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Gagal menghapus fasilitas: " + error.message);
      return;
    }

    alert("Fasilitas berhasil dihapus.");

    fetchFasilitas();
  };

  // Batalkan edit
  const handleCancel = () => {
    setEditingId(null);
    setNamaFasilitas("");
    setDeskripsi("");
  };

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

          <button
            onClick={() => router.push("/admin/website")}
            className="px-4 py-2 rounded-xl bg-green-800 hover:bg-green-700 transition text-sm font-medium"
          >
            ← Kembali
          </button>

        </div>
      </header>


      {/* CONTENT */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-10">

        {/* TITLE */}
        <div className="mb-8">

          <p className="text-sm text-yellow-700 font-semibold tracking-wider mb-2">
            WEBSITE SEKOLAH
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-green-950">
            Fasilitas Sekolah
          </h2>

          <p className="text-green-900/60 mt-2">
            Kelola fasilitas dan sarana yang tersedia di MTs Sirnamiskin.
          </p>

        </div>


        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-6 md:p-8 mb-8">

          <h3 className="text-xl font-bold text-green-950 mb-6">
            {editingId ? "Edit Fasilitas" : "Tambah Fasilitas"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAMA */}
            <div>
              <label className="block text-sm font-semibold text-green-950 mb-2">
                Nama Fasilitas
              </label>

              <input
                type="text"
                value={namaFasilitas}
                onChange={(e) => setNamaFasilitas(e.target.value)}
                placeholder="Contoh: Laboratorium Komputer"
                className="w-full border border-green-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
              />
            </div>


            {/* DESKRIPSI */}
            <div>
              <label className="block text-sm font-semibold text-green-950 mb-2">
                Deskripsi
              </label>

              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Masukkan deskripsi fasilitas..."
                rows={4}
                className="w-full border border-green-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-600 text-gray-800 resize-none"
              />
            </div>


            {/* BUTTON */}
            <div className="flex gap-3">

              <button
                type="submit"
                className="bg-green-800 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                {editingId ? "Simpan Perubahan" : "Tambah Fasilitas"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition"
                >
                  Batal
                </button>
              )}

            </div>

          </form>

        </div>


        {/* DAFTAR FASILITAS */}
        <div>

          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-green-950">
              Daftar Fasilitas
            </h3>

            <span className="text-sm text-green-800 bg-green-100 px-3 py-1 rounded-full">
              {fasilitas.length} Fasilitas
            </span>
          </div>


          {loading ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
              Memuat data fasilitas...
            </div>
          ) : fasilitas.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
              Belum ada data fasilitas.
            </div>
          ) : (
            <div className="space-y-4">

              {fasilitas.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-green-800 rounded-2xl border border-green-700 p-5 shadow-md"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 shrink-0 rounded-xl bg-green-950 flex items-center justify-center text-xl">
                        🏢
                      </div>

                      <div>
                        <p className="text-xs text-yellow-300 mb-1">
                          Fasilitas {index + 1}
                        </p>

                        <h4 className="font-bold text-white text-lg">
                          {item.nama_fasilitas}
                        </h4>

                        <p className="text-green-100 text-sm mt-1 leading-relaxed">
                          {item.deskripsi || "Belum ada deskripsi."}
                        </p>
                      </div>

                    </div>


                    {/* ACTION */}
                    <div className="flex gap-2 shrink-0">

                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-green-950 px-3 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 hover:bg-red-400 text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        Hapus
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>


        {/* FOOTER */}
        <div className="text-center mt-10 pb-5">

          <p className="text-green-900/50 text-xs">
            ۞ MTs Sirnamiskin Bandung ۞
          </p>

        </div>

      </section>

    </main>
  );
}