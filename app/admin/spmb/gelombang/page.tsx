"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";

type Gelombang = {
  id: number;
  nama_gelombang: string;
  tanggal_mulai_pendaftaran: string;
  tanggal_batas_pendaftaran: string;
  tanggal_seleksi: string;
  aktif: boolean;
};

const daftarGelombang = [
  "Gelombang 1",
  "Gelombang 2",
  "Gelombang 3",
  "Gelombang 4",
];

function formatTanggal(tanggal: string) {
  if (!tanggal) return "-";

  const [tahun, bulan, hari] = tanggal.split("-");

  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return `${parseInt(hari)} ${namaBulan[parseInt(bulan) - 1]} ${tahun}`;
}

export default function GelombangSPMBPage() {
  const [gelombang, setGelombang] = useState<Gelombang[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    ambilGelombang();
  }, []);

  async function ambilGelombang() {
    setLoading(true);

    const { data, error } = await supabase
      .from("gelombang_spmb")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      setPesan("Gagal mengambil data gelombang.");
      setLoading(false);
      return;
    }

    const hasil: Gelombang[] = daftarGelombang.map((nama) => {
      const dataLama = data?.find(
        (item) => item.nama_gelombang === nama
      );

      if (dataLama) {
        return dataLama;
      }

      return {
        id: 0,
        nama_gelombang: nama,
        tanggal_mulai_pendaftaran: "",
        tanggal_batas_pendaftaran: "",
        tanggal_seleksi: "",
        aktif: false,
      };
    });

    setGelombang(hasil);
    setLoading(false);
  }

  function ubahData(
    index: number,
    field: keyof Gelombang,
    value: string | boolean
  ) {
    setGelombang((dataLama) =>
      dataLama.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  async function simpanGelombang(index: number) {
    const item = gelombang[index];

    if (!item.tanggal_mulai_pendaftaran) {
      alert("Tanggal mulai pendaftaran belum diisi.");
      return;
    }

    if (!item.tanggal_batas_pendaftaran) {
      alert("Batas pendaftaran belum diisi.");
      return;
    }

    if (
      item.tanggal_batas_pendaftaran <
      item.tanggal_mulai_pendaftaran
    ) {
      alert(
        "Batas pendaftaran tidak boleh lebih awal dari tanggal mulai pendaftaran."
      );
      return;
    }

    setSaving(index);
    setPesan("");

    /*
     * Kalau gelombang ini diaktifkan,
     * gelombang lainnya otomatis dinonaktifkan.
     */
    if (item.aktif) {
      const { error: nonaktifError } = await supabase
        .from("gelombang_spmb")
        .update({ aktif: false })
        .neq("id", item.id || -1);

      if (nonaktifError) {
        console.error(nonaktifError);
        alert("Gagal mengatur gelombang aktif.");
        setSaving(null);
        return;
      }
    }

    let error;

    if (item.id === 0) {
      const { error: insertError } = await supabase
        .from("gelombang_spmb")
        .insert({
          nama_gelombang: item.nama_gelombang,
          tanggal_mulai_pendaftaran:
            item.tanggal_mulai_pendaftaran,
          tanggal_batas_pendaftaran:
            item.tanggal_batas_pendaftaran,
          aktif: item.aktif,
        });

      error = insertError;
    } else {
      const { error: updateError } = await supabase
        .from("gelombang_spmb")
        .update({
          tanggal_mulai_pendaftaran:
            item.tanggal_mulai_pendaftaran,
          tanggal_batas_pendaftaran:
            item.tanggal_batas_pendaftaran,
          aktif: item.aktif,
        })
        .eq("id", item.id);

      error = updateError;
    }

    if (error) {
      console.error(error);
      alert("Data gelombang gagal disimpan.");
    } else {
      setPesan(`${item.nama_gelombang} berhasil disimpan.`);
      await ambilGelombang();
    }

    setSaving(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-green-800 font-semibold">
          Memuat data gelombang...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-green-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-green-700 text-white rounded-2xl p-6 mb-6 shadow">
          <h1 className="text-2xl md:text-3xl font-bold">
            Pengaturan Gelombang SPMB
          </h1>

          <p className="mt-2 text-green-100">
            Atur periode pendaftaran dan jadwal seleksi untuk setiap
            gelombang SPMB.
          </p>
        </div>

        {/* INFO */}
        <div className="bg-white border border-green-200 rounded-2xl p-5 mb-6 shadow-sm">
          <h2 className="font-bold text-green-800 text-lg mb-2">
            📌 Ketentuan Jadwal
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Admin cukup mengisi tanggal mulai dan batas pendaftaran.
            Tanggal seleksi akan otomatis ditentukan oleh sistem,
            yaitu <strong>H+1 dari batas pendaftaran</strong>.
          </p>
        </div>

        {pesan && (
          <div className="bg-green-100 border border-green-300 text-green-800 rounded-xl p-4 mb-6">
            ✅ {pesan}
          </div>
        )}

        {/* GELOMBANG */}
        <div className="space-y-6">
          {gelombang.map((item, index) => (
            <div
              key={item.nama_gelombang}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* JUDUL */}
              <div className="bg-green-700 text-white px-5 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {item.nama_gelombang}
                </h2>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.aktif}
                    onChange={(e) =>
                      ubahData(
                        index,
                        "aktif",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4"
                  />

                  Gelombang Aktif
                </label>
              </div>

              <div className="p-5">

                {/* TANGGAL PENDAFTARAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      📅 Mulai Pendaftaran
                    </label>

                    <input
                      type="date"
                      value={item.tanggal_mulai_pendaftaran}
                      onChange={(e) =>
                        ubahData(
                          index,
                          "tanggal_mulai_pendaftaran",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">
                      📅 Batas Pendaftaran
                    </label>

                    <input
                      type="date"
                      value={item.tanggal_batas_pendaftaran}
                      onChange={(e) =>
                        ubahData(
                          index,
                          "tanggal_batas_pendaftaran",
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                </div>

                {/* HASIL OTOMATIS */}
                <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5">
                  <p className="text-sm text-gray-500 mb-1">
                    📝 Jadwal Seleksi
                  </p>

                  <p className="text-xl font-bold text-green-800">
                    {item.tanggal_seleksi
                      ? formatTanggal(item.tanggal_seleksi)
                      : item.tanggal_batas_pendaftaran
                      ? "Otomatis H+1 setelah disimpan"
                      : "Belum ditentukan"}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    Tanggal seleksi otomatis = 1 hari setelah
                    batas pendaftaran.
                  </p>
                </div>

                {/* RINGKASAN */}
                {item.tanggal_mulai_pendaftaran &&
                  item.tanggal_batas_pendaftaran && (
                    <div className="mt-5 border-t pt-5">
                      <p className="text-sm text-gray-500">
                        Periode Pendaftaran
                      </p>

                      <p className="font-bold text-gray-800">
                        {formatTanggal(
                          item.tanggal_mulai_pendaftaran
                        )}{" "}
                        –{" "}
                        {formatTanggal(
                          item.tanggal_batas_pendaftaran
                        )}
                      </p>
                    </div>
                  )}

                {/* BUTTON */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => simpanGelombang(index)}
                    disabled={saving === index}
                    className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-xl transition"
                  >
                    {saving === index
                      ? "Menyimpan..."
                      : "💾 Simpan Gelombang"}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* CATATAN */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <p className="font-semibold text-yellow-800">
            ⚠️ Catatan
          </p>

          <p className="text-sm text-yellow-700 mt-1 leading-relaxed">
            Tanggal pada halaman ini belum diisi karena jadwal
            SPMB tahun ajaran berikutnya perlu mengikuti ketentuan
            resmi dari MTs Sirnamiskin. Setelah tanggal resmi
            diperoleh, admin dapat memasukkannya di halaman ini.
          </p>
        </div>

      </div>
    </main>
  );
}