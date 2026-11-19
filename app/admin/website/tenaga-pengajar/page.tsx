"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";

type TenagaPengajar = {
  id: number;
  nama: string;
};

export default function TenagaPengajarAdminPage() {
  const [guru, setGuru] = useState<TenagaPengajar[]>([]);
  const [nama, setNama] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const ambilDataGuru = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("tenaga_pengajar")
      .select("id, nama")
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data guru:", error);
      alert("Gagal mengambil data tenaga pengajar.");
    } else {
      setGuru(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    ambilDataGuru();
  }, []);

  const simpanGuru = async () => {
    if (!nama.trim()) {
      alert("Nama tenaga pengajar belum diisi.");
      return;
    }

    setSaving(true);

    if (editId !== null) {
      const { error } = await supabase
        .from("tenaga_pengajar")
        .update({
          nama: nama.trim(),
        })
        .eq("id", editId);

      if (error) {
        console.error("Gagal mengubah data:", error);
        alert("Gagal mengubah data tenaga pengajar.");
      } else {
        alert("Data tenaga pengajar berhasil diubah.");
        setNama("");
        setEditId(null);
        await ambilDataGuru();
      }
    } else {
      const { error } = await supabase
        .from("tenaga_pengajar")
        .insert({
          nama: nama.trim(),
        });

      if (error) {
        console.error("Gagal menambahkan data:", error);
        alert("Gagal menambahkan tenaga pengajar.");
      } else {
        alert("Tenaga pengajar berhasil ditambahkan.");
        setNama("");
        await ambilDataGuru();
      }
    }

    setSaving(false);
  };

  const editGuru = (guru: TenagaPengajar) => {
    setEditId(guru.id);
    setNama(guru.nama);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hapusGuru = async (id: number) => {
    const yakin = confirm(
      "Apakah kamu yakin ingin menghapus tenaga pengajar ini?"
    );

    if (!yakin) return;

    const { error } = await supabase
      .from("tenaga_pengajar")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus tenaga pengajar.");
    } else {
      alert("Data tenaga pengajar berhasil dihapus.");
      await ambilDataGuru();
    }
  };

  const batalEdit = () => {
    setEditId(null);
    setNama("");
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

          <a
            href="/admin/website"
            className="px-4 py-2 rounded-xl bg-green-800 hover:bg-green-700 transition text-sm font-medium"
          >
            ← Kembali
          </a>

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
            Tenaga Pengajar
          </h2>

          <p className="text-green-900/60 mt-2 max-w-2xl">
            Kelola data tenaga pengajar yang ditampilkan pada website
            MTs Sirnamiskin.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6 mb-8">

          <h3 className="text-lg font-bold text-green-950 mb-4">
            {editId !== null
              ? "Edit Tenaga Pengajar"
              : "Tambah Tenaga Pengajar"}
          </h3>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama tenaga pengajar"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <button
              onClick={simpanGuru}
              disabled={saving}
              className="rounded-xl bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving
                ? "Menyimpan..."
                : editId !== null
                ? "Simpan Perubahan"
                : "Tambah"}
            </button>

            {editId !== null && (
              <button
                onClick={batalEdit}
                className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300 transition"
              >
                Batal
              </button>
            )}

          </div>
        </div>

        {/* JUMLAH */}
        <div className="mb-5">
          <span className="inline-flex rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">
            {guru.length} Tenaga Pengajar
          </span>
        </div>

        {/* DATA GURU */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Memuat data tenaga pengajar...
            </div>
          ) : guru.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Belum ada data tenaga pengajar.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {guru.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-green-50 transition"
                >

                  <div className="flex items-center gap-4 min-w-0">

                    <div className="w-10 h-10 shrink-0 rounded-full bg-green-800 text-white flex items-center justify-center text-sm font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p className="font-semibold text-gray-800 truncate">
                      {item.nama}
                    </p>

                  </div>

                  <div className="flex items-center gap-2 shrink-0">

                    <button
                      onClick={() => editGuru(item)}
                      className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition text-sm font-semibold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => hapusGuru(item.id)}
                      className="px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition text-sm font-semibold"
                    >
                      Hapus
                    </button>

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