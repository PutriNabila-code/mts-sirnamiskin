"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

type BeritaKegiatan = {
  id: number;
  judul: string;
  tanggal: string | null;
  kategori: string | null;
  deskripsi: string | null;
  foto_url: string | null;
  tampilkan_judul: boolean;
};

export default function BeritaKegiatanPage() {
  const router = useRouter();

  const [berita, setBerita] = useState<BeritaKegiatan[]>([]);

  // ID data yang sedang diedit
  const [editId, setEditId] = useState<number | null>(null);

  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [kategori, setKategori] = useState("Kegiatan");
  const [deskripsi, setDeskripsi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const [tampilkanJudul, setTampilkanJudul] = useState(true);

  const [loading, setLoading] = useState(false);

  // =========================
  // AMBIL DATA BERITA & KEGIATAN
  // =========================
  const fetchBerita = async () => {
    const { data, error } = await supabase
      .from("galeri")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert(
        "Gagal mengambil data berita & kegiatan: " +
          error.message
      );
      return;
    }

    setBerita(data || []);
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  // =========================
  // MULAI EDIT
  // =========================
  const handleEdit = (item: BeritaKegiatan) => {
    setEditId(item.id);

    setJudul(item.judul);
    setTanggal(item.tanggal || "");
    setKategori(item.kategori || "Kegiatan");
    setDeskripsi(item.deskripsi || "");
    setTampilkanJudul(item.tampilkan_judul);

    // Foto baru dikosongkan.
    // Kalau tidak memilih foto baru,
    // foto lama akan tetap digunakan.
    setFoto(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // BATAL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditId(null);
    setJudul("");
    setTanggal("");
    setKategori("Kegiatan");
    setDeskripsi("");
    setFoto(null);
    setTampilkanJudul(true);

    const inputFile = document.getElementById(
      "foto"
    ) as HTMLInputElement;

    if (inputFile) {
      inputFile.value = "";
    }
  };

  // =========================
  // TAMBAH BERITA & KEGIATAN
  // =========================
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!judul || !foto) {
      alert("Judul dan foto wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      // Nama file dibuat unik
      const namaFile = `${Date.now()}-${foto.name.replace(
        /\s/g,
        "-"
      )}`;

      // =========================
      // UPLOAD FOTO
      // =========================
      const { error: uploadError } =
        await supabase.storage
          .from("galeri")
          .upload(namaFile, foto);

      if (uploadError) {
        throw uploadError;
      }

      // =========================
      // AMBIL URL FOTO
      // =========================
      const { data: urlData } =
        supabase.storage
          .from("galeri")
          .getPublicUrl(namaFile);

      const fotoUrl = urlData.publicUrl;

      // =========================
      // SIMPAN KE DATABASE
      // =========================
      const { error: insertError } =
        await supabase
          .from("galeri")
          .insert([
            {
              judul,
              tanggal: tanggal || null,
              kategori,
              deskripsi: deskripsi || null,
              foto_url: fotoUrl,
              tampilkan_judul: tampilkanJudul,
            },
          ]);

      if (insertError) {
        throw insertError;
      }

      alert(
        "Berita & kegiatan berhasil ditambahkan!"
      );

      // =========================
      // KOSONGKAN FORM
      // =========================
      setJudul("");
      setTanggal("");
      setKategori("Kegiatan");
      setDeskripsi("");
      setFoto(null);
      setTampilkanJudul(true);

      const inputFile =
        document.getElementById(
          "foto"
        ) as HTMLInputElement;

      if (inputFile) {
        inputFile.value = "";
      }

      fetchBerita();
    } catch (error: any) {
      alert(
        "Gagal menambahkan berita & kegiatan: " +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE BERITA & KEGIATAN
  // =========================
  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!editId || !judul) {
      alert("Judul wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      // Cari data lama
      const itemLama = berita.find(
        (item) => item.id === editId
      );

      if (!itemLama) {
        throw new Error(
          "Data berita tidak ditemukan."
        );
      }

      // Secara default gunakan foto lama
      let fotoUrl = itemLama.foto_url;

      // =========================
      // JIKA MEMILIH FOTO BARU
      // =========================
      if (foto) {
        const namaFileBaru = `${Date.now()}-${foto.name.replace(
          /\s/g,
          "-"
        )}`;

        const { error: uploadError } =
          await supabase.storage
            .from("galeri")
            .upload(namaFileBaru, foto);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } =
          supabase.storage
            .from("galeri")
            .getPublicUrl(namaFileBaru);

        fotoUrl = urlData.publicUrl;
      }

      // =========================
      // UPDATE DATA DI DATABASE
      // =========================
      const { error: updateError } =
        await supabase
          .from("galeri")
          .update({
            judul,
            tanggal: tanggal || null,
            kategori,
            deskripsi: deskripsi || null,
            foto_url: fotoUrl,
            tampilkan_judul: tampilkanJudul,
          })
          .eq("id", editId);

      if (updateError) {
        throw updateError;
      }

      // =========================
      // HAPUS FOTO LAMA
      // JIKA FOTO DIGANTI
      // =========================
      if (foto && itemLama.foto_url) {
        try {
          const url = new URL(
            itemLama.foto_url
          );

          const namaFileLama = decodeURIComponent(
            url.pathname.split("/").pop() || ""
          );

          if (namaFileLama) {
            await supabase.storage
              .from("galeri")
              .remove([namaFileLama]);
          }
        } catch (storageError) {
          console.log(
            "Foto lama tidak berhasil dihapus:",
            storageError
          );
        }
      }

      alert(
        "Berita & kegiatan berhasil diperbarui!"
      );

      // =========================
      // KEMBALI KE MODE TAMBAH
      // =========================
      handleCancelEdit();

      fetchBerita();
    } catch (error: any) {
      alert(
        "Gagal memperbarui berita & kegiatan: " +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HAPUS BERITA & KEGIATAN
  // =========================
  const handleDelete = async (
    item: BeritaKegiatan
  ) => {
    if (
      !confirm(
        "Yakin ingin menghapus berita & kegiatan ini?"
      )
    ) {
      return;
    }

    try {
      // =========================
      // AMBIL NAMA FILE DARI URL
      // =========================
      let namaFile = "";

      if (item.foto_url) {
        const url = new URL(item.foto_url);

        namaFile = decodeURIComponent(
          url.pathname.split("/").pop() || ""
        );
      }

      // =========================
      // HAPUS FOTO DARI STORAGE
      // =========================
      if (namaFile) {
        const { error: storageError } =
          await supabase.storage
            .from("galeri")
            .remove([namaFile]);

        if (storageError) {
          console.log(
            "Foto gagal dihapus dari storage:",
            storageError
          );
        }
      }

      // =========================
      // HAPUS DATA DARI DATABASE
      // =========================
      const { error: deleteError } =
        await supabase
          .from("galeri")
          .delete()
          .eq("id", item.id);

      if (deleteError) {
        throw deleteError;
      }

      // =========================
      // HILANGKAN DARI TAMPILAN
      // =========================
      setBerita((prev) =>
        prev.filter(
          (data) => data.id !== item.id
        )
      );

      alert(
        "Berita & kegiatan berhasil dihapus!"
      );
    } catch (error: any) {
      alert(
        "Gagal menghapus berita & kegiatan: " +
          error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Berita & Kegiatan
            </h1>

            <p className="mt-1 text-gray-600">
              Kelola berita, kegiatan, dan dokumentasi
              MTs Sirnamiskin
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/admin/website")
            }
            className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            ← Kembali
          </button>
        </div>

        {/* =========================
            FORM TAMBAH / EDIT
        ========================= */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">

          <h2 className="mb-4 text-xl font-bold text-green-800">
            {editId
              ? "Edit Berita & Kegiatan"
              : "Tambah Berita & Kegiatan"}
          </h2>

          <form
            onSubmit={
              editId
                ? handleUpdate
                : handleSubmit
            }
            className="space-y-4"
          >

            {/* FOTO */}
            <div>
              <label className="mb-1 block font-semibold">
                Foto Kegiatan
              </label>

              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFoto(
                    e.target.files?.[0] || null
                  )
                }
                className="w-full rounded-lg border p-2"
              />

              <p className="mt-1 text-sm text-gray-500">
                {editId
                  ? "Kosongkan jika ingin tetap menggunakan foto lama."
                  : "Upload foto kegiatan tanpa perlu menambahkan tulisan ke dalam foto."}
              </p>
            </div>

            {/* JUDUL */}
            <div>
              <label className="mb-1 block font-semibold">
                Judul Berita / Kegiatan
              </label>

              <input
                type="text"
                value={judul}
                onChange={(e) =>
                  setJudul(e.target.value)
                }
                placeholder="Contoh: Peringatan Maulid Nabi Muhammad SAW"
                className="w-full rounded-lg border p-3"
              />

              <p className="mt-1 text-sm text-gray-500">
                Judul akan otomatis ditampilkan
                di tengah foto.
              </p>
            </div>

            {/* TAMPILKAN JUDUL */}
            <div className="rounded-lg border border-green-100 bg-green-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={tampilkanJudul}
                  onChange={(e) =>
                    setTampilkanJudul(
                      e.target.checked
                    )
                  }
                  className="mt-1 h-5 w-5 accent-green-600"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    Tampilkan judul di foto
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Centang jika judul ingin muncul
                    otomatis di tengah foto.
                  </p>
                </div>
              </label>
            </div>

            {/* TANGGAL */}
            <div>
              <label className="mb-1 block font-semibold">
                Tanggal
              </label>

              <input
                type="date"
                value={tanggal}
                onChange={(e) =>
                  setTanggal(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* KATEGORI */}
            <div>
              <label className="mb-1 block font-semibold">
                Kategori
              </label>

              <select
                value={kategori}
                onChange={(e) =>
                  setKategori(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="Berita">
                  Berita
                </option>

                <option value="Kegiatan">
                  Kegiatan
                </option>
              </select>
            </div>

            {/* DESKRIPSI */}
            <div>
              <label className="mb-1 block font-semibold">
                Isi Berita / Deskripsi Kegiatan
              </label>

              <textarea
                value={deskripsi}
                onChange={(e) =>
                  setDeskripsi(e.target.value)
                }
                placeholder="Tuliskan informasi atau deskripsi mengenai kegiatan..."
                rows={5}
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* TOMBOL */}
            <div className="flex gap-3">

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading
                  ? editId
                    ? "Menyimpan..."
                    : "Mengupload..."
                  : editId
                    ? "Simpan Perubahan"
                    : "Tambah Berita & Kegiatan"}
              </button>

              {/* TOMBOL BATAL SAAT EDIT */}
              {editId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600 disabled:bg-gray-400"
                >
                  Batal
                </button>
              )}

            </div>

          </form>
        </div>

        {/* =========================
            DAFTAR BERITA
        ========================= */}
        <div className="rounded-xl bg-white p-6 shadow-md">

          <h2 className="mb-4 text-xl font-bold text-green-800">
            Daftar Berita & Kegiatan
          </h2>

          {berita.length === 0 ? (

            <p className="text-gray-500">
              Belum ada berita atau kegiatan.
            </p>

          ) : (

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

              {berita.map((item) => (

                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >

                  {/* =========================
                      FOTO + JUDUL DI TENGAH
                  ========================= */}
                  {item.foto_url && (
                    <div className="relative h-64 w-full overflow-hidden bg-gray-100">

                      <img
                        src={item.foto_url}
                        alt={item.judul}
                        className="h-full w-full object-cover"
                      />

                      {/* OVERLAY JUDUL */}
                      {item.tampilkan_judul && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-4">

                          <div className="rounded-xl bg-black/55 px-5 py-3 text-center shadow-lg backdrop-blur-[2px]">

                            <h3 className="text-lg font-bold text-white md:text-xl">
                              {item.judul}
                            </h3>

                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* =========================
                      INFORMASI
                  ========================= */}
                  <div className="p-4">

                    {item.kategori && (
                      <span className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                        {item.kategori}
                      </span>
                    )}

                    {item.tanggal && (
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(
                          item.tanggal
                        ).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}

                    {item.deskripsi && (
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {item.deskripsi}
                      </p>
                    )}

                    {/* =========================
                        TOMBOL EDIT & HAPUS
                    ========================= */}
                    <div className="mt-4 flex gap-2">

                      <button
                        onClick={() =>
                          handleEdit(item)
                        }
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item)
                        }
                        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
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
      </div>
    </div>
  );
}