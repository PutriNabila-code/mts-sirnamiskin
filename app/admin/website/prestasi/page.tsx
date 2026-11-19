"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";

type Prestasi = {
  id: number;
  judul: string;
};

type Lulusan = {
  id: number;
  nama_sekolah: string;
  jumlah: number;
};

export default function PrestasiPage() {
  const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
  const [judul, setJudul] = useState("");
  const [editPrestasiId, setEditPrestasiId] = useState<number | null>(null);
  const [loadingPrestasi, setLoadingPrestasi] = useState(false);

  const [lulusan, setLulusan] = useState<Lulusan[]>([]);
  const [namaSekolah, setNamaSekolah] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [editLulusanId, setEditLulusanId] = useState<number | null>(null);
  const [loadingLulusan, setLoadingLulusan] = useState(false);

  const fetchPrestasi = async () => {
    const { data, error } = await supabase
      .from("prestasi_siswa")
      .select("id, judul")
      .order("id", { ascending: true });

    if (error) {
      console.error("ERROR PRESTASI:", error);
      return;
    }

    setPrestasi(data || []);
  };

  const fetchLulusan = async () => {
    const { data, error } = await supabase
      .from("lulusan_sekolah")
      .select("id, nama_sekolah, jumlah")
      .order("id", { ascending: true });

    if (error) {
      console.error("ERROR LULUSAN:", error);
      return;
    }

    setLulusan(data || []);
  };

  useEffect(() => {
    fetchPrestasi();
    fetchLulusan();
  }, []);

  const simpanPrestasi = async () => {
    if (!judul.trim()) {
      alert("Judul prestasi belum diisi.");
      return;
    }

    setLoadingPrestasi(true);

    if (editPrestasiId !== null) {
      const { error } = await supabase
        .from("prestasi_siswa")
        .update({ judul: judul.trim() })
        .eq("id", editPrestasiId);

      if (error) {
        console.error(error);
        alert("Gagal mengubah prestasi.");
      } else {
        alert("Prestasi berhasil diubah.");
        setJudul("");
        setEditPrestasiId(null);
        fetchPrestasi();
      }
    } else {
      const { error } = await supabase
        .from("prestasi_siswa")
        .insert({ judul: judul.trim() });

      if (error) {
        console.error(error);
        alert("Gagal menambahkan prestasi.");
      } else {
        alert("Prestasi berhasil ditambahkan.");
        setJudul("");
        fetchPrestasi();
      }
    }

    setLoadingPrestasi(false);
  };

  const editPrestasi = (item: Prestasi) => {
    setEditPrestasiId(item.id);
    setJudul(item.judul);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hapusPrestasi = async (id: number) => {
    const yakin = confirm("Yakin ingin menghapus prestasi ini?");

    if (!yakin) return;

    const { error } = await supabase
      .from("prestasi_siswa")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Gagal menghapus prestasi.");
      return;
    }

    alert("Prestasi berhasil dihapus.");
    fetchPrestasi();
  };

  const batalEditPrestasi = () => {
    setEditPrestasiId(null);
    setJudul("");
  };

  const simpanLulusan = async () => {
    if (!namaSekolah.trim()) {
      alert("Nama sekolah belum diisi.");
      return;
    }

    if (!jumlah || Number(jumlah) <= 0) {
      alert("Jumlah lulusan belum diisi dengan benar.");
      return;
    }

    setLoadingLulusan(true);

    if (editLulusanId !== null) {
      const { error } = await supabase
        .from("lulusan_sekolah")
        .update({
          nama_sekolah: namaSekolah.trim(),
          jumlah: Number(jumlah),
        })
        .eq("id", editLulusanId);

      if (error) {
        console.error(error);
        alert("Gagal mengubah data lulusan.");
      } else {
        alert("Data lulusan berhasil diubah.");
        setNamaSekolah("");
        setJumlah("");
        setEditLulusanId(null);
        fetchLulusan();
      }
    } else {
      const { error } = await supabase
        .from("lulusan_sekolah")
        .insert({
          nama_sekolah: namaSekolah.trim(),
          jumlah: Number(jumlah),
        });

      if (error) {
        console.error(error);
        alert("Gagal menambahkan data lulusan.");
      } else {
        alert("Data lulusan berhasil ditambahkan.");
        setNamaSekolah("");
        setJumlah("");
        fetchLulusan();
      }
    }

    setLoadingLulusan(false);
  };

  const editLulusan = (item: Lulusan) => {
    setEditLulusanId(item.id);
    setNamaSekolah(item.nama_sekolah);
    setJumlah(String(item.jumlah));

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const hapusLulusan = async (id: number) => {
    const yakin = confirm("Yakin ingin menghapus data lulusan ini?");

    if (!yakin) return;

    const { error } = await supabase
      .from("lulusan_sekolah")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Gagal menghapus data lulusan.");
      return;
    }

    alert("Data lulusan berhasil dihapus.");
    fetchLulusan();
  };

  const batalEditLulusan = () => {
    setEditLulusanId(null);
    setNamaSekolah("");
    setJumlah("");
  };

  const totalLulusan = lulusan.reduce(
    (total, item) => total + Number(item.jumlah),
    0
  );

  return (
    <main className="min-h-screen bg-green-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => (window.location.href = "/admin/website")}
            className="text-green-800 font-semibold hover:underline mb-4"
          >
            ← Kembali ke Kelola Website
          </button>

          <h1 className="text-3xl font-bold text-green-900">
            Prestasi Siswa
          </h1>

          <p className="text-gray-600 mt-2">
            Kelola data prestasi siswa MTs Sirnamiskin.
          </p>
        </div>

        {/* TAMBAH PRESTASI */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">
            {editPrestasiId !== null
              ? "Edit Prestasi"
              : "Tambah Prestasi"}
          </h2>

          <textarea
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Masukkan prestasi siswa..."
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700 resize-none"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={simpanPrestasi}
              disabled={loadingPrestasi}
              className="bg-green-800 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loadingPrestasi
                ? "Menyimpan..."
                : editPrestasiId !== null
                ? "Simpan Perubahan"
                : "Tambah Prestasi"}
            </button>

            {editPrestasiId !== null && (
              <button
                onClick={batalEditPrestasi}
                className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* DAFTAR PRESTASI */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6 mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-green-900">
                Daftar Prestasi
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {prestasi.length} data prestasi
              </p>
            </div>
          </div>

          {prestasi.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Data prestasi belum tersedia.
            </div>
          ) : (
            <div className="space-y-3">
              {prestasi.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 border border-green-100 rounded-xl p-4 hover:bg-green-50 transition"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-green-800 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">
                      {item.judul}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => editPrestasi(item)}
                      className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-800 font-semibold hover:bg-yellow-200 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => hapusPrestasi(item.id)}
                      className="px-3 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LULUSAN */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-900">
            Lulusan Diterima di Sekolah Negeri
          </h2>

          <p className="text-gray-600 mt-2">
            Data lulusan MTs Sirnamiskin yang diterima di sekolah negeri.
          </p>
        </div>

        {/* TAMBAH LULUSAN */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-green-900 mb-4">
            {editLulusanId !== null
              ? "Edit Data Lulusan"
              : "Tambah Data Lulusan"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Sekolah
              </label>

              <input
                type="text"
                value={namaSekolah}
                onChange={(e) => setNamaSekolah(e.target.value)}
                placeholder="Contoh: SMAN 4"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jumlah Lulusan
              </label>

              <input
                type="number"
                min="1"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="Contoh: 10"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>

          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={simpanLulusan}
              disabled={loadingLulusan}
              className="bg-green-800 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loadingLulusan
                ? "Menyimpan..."
                : editLulusanId !== null
                ? "Simpan Perubahan"
                : "Tambah Lulusan"}
            </button>

            {editLulusanId !== null && (
              <button
                onClick={batalEditLulusan}
                className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* DAFTAR LULUSAN */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-bold text-green-900">
                Daftar Sekolah Negeri
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Total {totalLulusan.toLocaleString("id-ID")} lulusan
              </p>
            </div>
          </div>

          {lulusan.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Data lulusan belum tersedia.
            </div>
          ) : (
            <div className="space-y-3">

              {lulusan.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border border-green-100 rounded-xl p-4 hover:bg-green-50 transition"
                >
                  <div className="w-10 h-10 shrink-0 rounded-full bg-green-800 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {item.nama_sekolah}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {Number(item.jumlah).toLocaleString("id-ID")} orang
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">

                    <button
                      onClick={() => editLulusan(item)}
                      className="px-3 py-2 rounded-lg bg-yellow-100 text-yellow-800 font-semibold hover:bg-yellow-200 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => hapusLulusan(item.id)}
                      className="px-3 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
                    >
                      Hapus
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}