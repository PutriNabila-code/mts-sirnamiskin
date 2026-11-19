"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

type Gelombang = {
  id: number;
  nama_gelombang: string;
  tanggal_mulai_pendaftaran: string;
  tanggal_batas_pendaftaran: string;
  tanggal_seleksi: string;
  aktif: boolean;
};

type Pendaftar = {
  id: number;
  user_id: string;
  nomor_pendaftaran: string;
  pilihan_kelas: string;
  status: string;
  nama_lengkap: string;
  nisn: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  alamat: string;
  asal_sekolah: string;
  nama_ayah: string;
  nama_ibu: string;
  no_kk: string;
  no_ktp_orang_tua: string;
  no_hp: string;
  created_at: string;

  ijazah_url: string | null;
  surat_kelulusan_url: string | null;
  akta_kelahiran_url: string | null;
  kartu_keluarga_url: string | null;
  surat_kelakuan_baik_url: string | null;
  ktp_orang_tua_url: string | null;
  pas_foto_url: string | null;

  gelombang_id: number | null;
  tanggal_seleksi: string | null;
  jenis_seleksi: string | null;
  hasil_seleksi: string | null;
  catatan_seleksi: string | null;
};

type Dokumen = {
  nama: string;
  url: string | null;
};

export default function DetailPendaftarPage() {
  const router = useRouter();
  const params = useParams();

  const [data, setData] = useState<Pendaftar | null>(null);
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);
  const [gelombang, setGelombang] = useState<Gelombang[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingGelombang, setLoadingGelombang] = useState(true);

  const [savingStatus, setSavingStatus] = useState(false);
  const [savingSeleksi, setSavingSeleksi] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusBaru, setStatusBaru] = useState("");

  const [gelombangId, setGelombangId] = useState("");
  const [hasilSeleksi, setHasilSeleksi] = useState("");
  const [catatanSeleksi, setCatatanSeleksi] = useState("");

  useEffect(() => {
    ambilData();
    ambilGelombang();
  }, []);

  // =====================================================
  // AMBIL DATA GELOMBANG
  // =====================================================

  async function ambilGelombang() {
    setLoadingGelombang(true);

    const { data, error } = await supabase
      .from("gelombang_spmb")
      .select(
        `
        id,
        nama_gelombang,
        tanggal_mulai_pendaftaran,
        tanggal_batas_pendaftaran,
        tanggal_seleksi,
        aktif
        `
      )
      .order("id", {
        ascending: true,
      });

    if (error) {
      console.error("Gagal mengambil gelombang:", error);

      setError(
        "Gagal mengambil data gelombang: " +
          error.message
      );

      setLoadingGelombang(false);
      return;
    }

    setGelombang(data || []);
    setLoadingGelombang(false);
  }

  // =====================================================
  // AMBIL DATA PENDAFTAR
  // =====================================================

  async function ambilData() {
    setLoading(true);
    setError("");

    const id = Number(params.id);

    if (!id || isNaN(id)) {
      setError("ID pendaftar tidak ditemukan.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("pendaftar_spmb")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Gagal mengambil data:", error);

      setError(
        "Gagal mengambil data pendaftar: " +
          error.message
      );

      setLoading(false);
      return;
    }

    if (!data) {
      setError("Data pendaftar tidak ditemukan.");
      setLoading(false);
      return;
    }

    setData(data);

    setStatusBaru(
      data.status || "Menunggu Verifikasi"
    );

    setGelombangId(
      data.gelombang_id
        ? String(data.gelombang_id)
        : ""
    );

    setHasilSeleksi(
      data.hasil_seleksi || ""
    );

    setCatatanSeleksi(
      data.catatan_seleksi || ""
    );

    // =====================================================
    // DOKUMEN
    // =====================================================

    const daftarDokumen: Dokumen[] = [];

    const fileFields = [
      {
        nama: "Ijazah",
        path: data.ijazah_url,
      },
      {
        nama: "Surat Kelulusan",
        path: data.surat_kelulusan_url,
      },
      {
        nama: "Akta Kelahiran",
        path: data.akta_kelahiran_url,
      },
      {
        nama: "Kartu Keluarga",
        path: data.kartu_keluarga_url,
      },
      {
        nama: "Surat Kelakuan Baik",
        path: data.surat_kelakuan_baik_url,
      },
      {
        nama: "KTP Orang Tua",
        path: data.ktp_orang_tua_url,
      },
    ];

    for (const file of fileFields) {
      if (file.path) {
        const { data: signedData } =
          await supabase.storage
            .from("berkas-spmb")
            .createSignedUrl(
              file.path,
              3600
            );

        daftarDokumen.push({
          nama: file.nama,
          url:
            signedData?.signedUrl ||
            null,
        });
      } else {
        daftarDokumen.push({
          nama: file.nama,
          url: null,
        });
      }
    }

    // =====================================================
    // PAS FOTO
    // =====================================================

    if (data.pas_foto_url) {
      try {
        const foto = JSON.parse(
          data.pas_foto_url
        );

        if (Array.isArray(foto)) {
          for (
            let i = 0;
            i < foto.length;
            i++
          ) {
            if (foto[i]) {
              const {
                data: signedData,
              } = await supabase.storage
                .from("berkas-spmb")
                .createSignedUrl(
                  foto[i],
                  3600
                );

              daftarDokumen.push({
                nama:
                  i === 0
                    ? "Pas Foto 3x4"
                    : "Pas Foto 2x3",
                url:
                  signedData?.signedUrl ||
                  null,
              });
            }
          }
        }
      } catch (e) {
        console.error(
          "Gagal membaca foto:",
          e
        );
      }
    }

    setDokumen(daftarDokumen);
    setLoading(false);
  }

  // =====================================================
  // SIMPAN STATUS PENDAFTARAN
  // =====================================================

  async function simpanStatus() {
    if (!data) return;

    setSavingStatus(true);
    setError("");
    setSuccess("");

    const id = Number(data.id);

    const { error } = await supabase
      .from("pendaftar_spmb")
      .update({
        status: statusBaru,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Gagal mengubah status:",
        error
      );

      setError(
        "Gagal mengubah status: " +
          error.message
      );

      setSavingStatus(false);
      return;
    }

    setData({
      ...data,
      status: statusBaru,
    });

    setSuccess(
      `Status berhasil disimpan menjadi "${statusBaru}".`
    );

    setSavingStatus(false);
  }

  // =====================================================
  // SIMPAN DATA SELEKSI
  // =====================================================

  async function simpanSeleksi() {
    if (!data) return;

    setError("");
    setSuccess("");

    if (!gelombangId) {
      setError(
        "Silakan pilih gelombang pendaftaran terlebih dahulu."
      );
      return;
    }

    const gelombangTerpilih =
      gelombang.find(
        (item) =>
          String(item.id) ===
          String(gelombangId)
      );

    if (!gelombangTerpilih) {
      setError(
        "Data gelombang yang dipilih tidak ditemukan."
      );
      return;
    }

    setSavingSeleksi(true);

    const id = Number(data.id);

    const dataYangDisimpan = {
      gelombang_id:
        Number(gelombangTerpilih.id),

      tanggal_seleksi:
        gelombangTerpilih.tanggal_seleksi,

      hasil_seleksi:
        hasilSeleksi || null,

      catatan_seleksi:
        catatanSeleksi.trim() || null,
    };

    console.log(
      "Data seleksi yang disimpan:",
      dataYangDisimpan
    );

    // =====================================================
    // UPDATE DATABASE
    // =====================================================

    const { error } = await supabase
      .from("pendaftar_spmb")
      .update(dataYangDisimpan)
      .eq("id", id);

    if (error) {
      console.error(
        "ERROR SIMPAN SELEKSI:",
        error
      );

      setError(
        "Gagal menyimpan data seleksi: " +
          error.message
      );

      setSavingSeleksi(false);
      return;
    }

    // =====================================================
    // UPDATE DATA DI HALAMAN
    // =====================================================

    setData({
      ...data,

      gelombang_id:
        gelombangTerpilih.id,

      tanggal_seleksi:
        gelombangTerpilih.tanggal_seleksi,

      hasil_seleksi:
        hasilSeleksi || null,

      catatan_seleksi:
        catatanSeleksi.trim() || null,
    });

    setSuccess(
      "✅ Gelombang dan hasil seleksi berhasil disimpan."
    );

    setSavingSeleksi(false);
  }

  // =====================================================
  // FORMAT TANGGAL
  // =====================================================

  function formatTanggal(
    tanggal: string | null
  ) {
    if (!tanggal) return "-";

    return new Date(
      tanggal + "T00:00:00"
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // =====================================================
  // WARNA STATUS
  // =====================================================

  function warnaStatus(
    status: string
  ) {
    if (status === "Diterima") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Ditolak") {
      return "bg-red-100 text-red-700";
    }

    if (
      status === "Diverifikasi"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  // =====================================================
  // WARNA HASIL SELEKSI
  // =====================================================

  function warnaHasilSeleksi(
    hasil: string | null
  ) {
    if (hasil === "Lulus") {
      return "bg-green-100 text-green-700";
    }

    if (
      hasil === "Tidak Lulus"
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      hasil ===
      "Menunggu Hasil Seleksi"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  }

  const gelombangTerpilih =
    gelombang.find(
      (item) =>
        String(item.id) ===
        String(gelombangId)
    );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            KEMBALI
        ===================================================== */}

        <button
          type="button"
          onClick={() => {
            router.push(
              "/admin/daftar-siswa"
            );
            router.refresh();
          }}
          className="mb-6 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
        >
          ← Kembali ke Data Pendaftar
        </button>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Memuat data pendaftar...
            </p>
          </div>
        ) : error && !data ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600">
            <b>
              Gagal mengambil data:
            </b>

            <br />

            {error}
          </div>
        ) : data ? (
          <>

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
                DETAIL PENDAFTAR
              </p>

              <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-black text-gray-900">
                    {data.nama_lengkap}
                  </h1>

                  <p className="mt-2 font-semibold text-green-700">
                    {data.nomor_pendaftaran}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${warnaStatus(
                    data.status
                  )}`}
                >
                  {data.status}
                </span>
              </div>
            </div>

            {/* =====================================================
                STATUS PENDAFTARAN
            ===================================================== */}

            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="mb-2 text-xl font-black text-gray-900">
                🔄 Status Pendaftaran
              </h2>

              <p className="mb-5 text-sm text-gray-500">
                Ubah status pendaftaran calon siswa sesuai
                hasil pemeriksaan data dan berkas.
              </p>

              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="w-full md:max-w-md">
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Status
                  </label>

                  <select
                    value={statusBaru}
                    onChange={(e) =>
                      setStatusBaru(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="Menunggu Verifikasi">
                      Menunggu Verifikasi
                    </option>

                    <option value="Diverifikasi">
                      Diverifikasi
                    </option>

                    <option value="Diterima">
                      Diterima
                    </option>

                    <option value="Ditolak">
                      Ditolak
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={
                    simpanStatus
                  }
                  disabled={
                    savingStatus
                  }
                  className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {savingStatus
                    ? "Menyimpan..."
                    : "Simpan Status"}
                </button>
              </div>
            </section>

            {/* =====================================================
                JADWAL & HASIL SELEKSI
            ===================================================== */}

            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">

              <div className="mb-5">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-600">
                  SELEKSI
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-900">
                  📝 Jadwal & Hasil Seleksi
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Pilih gelombang pendaftaran calon siswa.
                  Jadwal seleksi akan mengikuti pengaturan
                  gelombang yang telah dibuat oleh admin.
                </p>
              </div>

              {/* =====================================================
                  PILIH GELOMBANG
              ===================================================== */}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Gelombang Pendaftaran
                </label>

                {loadingGelombang ? (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    Memuat gelombang...
                  </div>
                ) : (
                  <select
                    value={gelombangId}
                    onChange={(e) =>
                      setGelombangId(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">
                      Pilih gelombang
                    </option>

                    {gelombang.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {
                            item.nama_gelombang
                          }

                          {item.aktif
                            ? " — Aktif"
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                )}
              </div>

              {/* =====================================================
                  INFORMASI GELOMBANG
              ===================================================== */}

              {gelombangTerpilih ? (
                <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 p-5">

                  <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-green-600">
                      Gelombang Pendaftaran
                    </p>

                    <h3 className="mt-1 text-xl font-black text-gray-900">
                      {
                        gelombangTerpilih.nama_gelombang
                      }
                    </h3>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">

                    <div>
                      <p className="text-xs font-bold text-gray-400">
                        Mulai Pendaftaran
                      </p>

                      <p className="mt-1 font-bold text-gray-800">
                        {formatTanggal(
                          gelombangTerpilih.tanggal_mulai_pendaftaran
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-400">
                        Batas Pendaftaran
                      </p>

                      <p className="mt-1 font-bold text-gray-800">
                        {formatTanggal(
                          gelombangTerpilih.tanggal_batas_pendaftaran
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-gray-400">
                        Tanggal Seleksi
                      </p>

                      <p className="mt-1 font-black text-green-700">
                        {formatTanggal(
                          gelombangTerpilih.tanggal_seleksi
                        )}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 rounded-xl bg-white p-4">
                    <p className="text-sm leading-relaxed text-gray-600">
                      Calon siswa diharapkan datang langsung
                      ke MTs SIRNAMISKIN untuk mengikuti proses
                      seleksi sesuai tanggal yang telah
                      ditentukan.
                    </p>
                  </div>

                  <p className="mt-3 text-xs italic text-gray-400">
                    * Tanggal seleksi ditentukan otomatis oleh
                    sistem, yaitu H+1 dari batas pendaftaran.
                  </p>
                </div>
              ) : (
                <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                  <p className="font-bold text-yellow-800">
                    ⚠️ Gelombang belum dipilih
                  </p>

                  <p className="mt-1 text-sm text-yellow-700">
                    Silakan pilih Gelombang 1, 2, 3, atau 4
                    untuk menampilkan jadwal seleksi.
                  </p>
                </div>
              )}

              {/* =====================================================
                  HASIL SELEKSI
              ===================================================== */}

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Hasil Seleksi
                  </label>

                  <select
                    value={hasilSeleksi}
                    onChange={(e) =>
                      setHasilSeleksi(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">
                      Pilih hasil seleksi
                    </option>

                    <option value="Belum Mengikuti">
                      Belum Mengikuti
                    </option>

                    <option value="Menunggu Hasil Seleksi">
                      Menunggu Hasil Seleksi
                    </option>

                    <option value="Lulus">
                      Lulus
                    </option>

                    <option value="Tidak Lulus">
                      Tidak Lulus
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Status Hasil
                  </label>

                  <div className="flex h-[46px] items-center">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${warnaHasilSeleksi(
                        hasilSeleksi
                      )}`}
                    >
                      {hasilSeleksi ||
                        "Belum Ada Hasil"}
                    </span>
                  </div>
                </div>

                {/* CATATAN */}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Catatan Seleksi
                  </label>

                  <textarea
                    value={
                      catatanSeleksi
                    }
                    onChange={(e) =>
                      setCatatanSeleksi(
                        e.target.value
                      )
                    }
                    rows={4}
                    placeholder="Tuliskan catatan atau keterangan hasil seleksi..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none placeholder:font-normal placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              {/* =====================================================
                  SIMPAN
              ===================================================== */}

              <div className="mt-6">

                <button
                  type="button"
                  onClick={
                    simpanSeleksi
                  }
                  disabled={
                    savingSeleksi ||
                    loadingGelombang
                  }
                  className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {savingSeleksi
                    ? "Menyimpan..."
                    : "Simpan Data Seleksi"}
                </button>

                {/* PESAN LANGSUNG DI SINI */}

                {success && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}
              </div>
            </section>

            {/* =====================================================
                DATA PENDAFTARAN
            ===================================================== */}

            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="mb-5 text-xl font-black text-gray-900">
                📋 Data Pendaftaran
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <Item
                  label="Nomor Pendaftaran"
                  value={
                    data.nomor_pendaftaran
                  }
                />

                <Item
                  label="Pilihan Kelas"
                  value={
                    data.pilihan_kelas
                  }
                />

                <Item
                  label="Status"
                  value={data.status}
                />

                <Item
                  label="Tanggal Pendaftaran"
                  value={formatTanggal(
                    data.created_at
                  )}
                />

              </div>
            </section>

            {/* =====================================================
                DATA CALON SISWA
            ===================================================== */}

            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="mb-5 text-xl font-black text-gray-900">
                👤 Data Calon Siswa
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <Item
                  label="Nama Lengkap"
                  value={
                    data.nama_lengkap
                  }
                />

                <Item
                  label="NISN"
                  value={data.nisn}
                />

                <Item
                  label="NIK"
                  value={data.nik}
                />

                <Item
                  label="Tempat Lahir"
                  value={
                    data.tempat_lahir
                  }
                />

                <Item
                  label="Tanggal Lahir"
                  value={formatTanggal(
                    data.tanggal_lahir
                  )}
                />

                <Item
                  label="Jenis Kelamin"
                  value={
                    data.jenis_kelamin
                  }
                />

                <Item
                  label="Asal Sekolah"
                  value={
                    data.asal_sekolah
                  }
                />

                <Item
                  label="No. HP"
                  value={data.no_hp}
                />

              </div>

              <div className="mt-5">
                <Item
                  label="Alamat"
                  value={data.alamat}
                />
              </div>
            </section>

            {/* =====================================================
                DATA ORANG TUA
            ===================================================== */}

            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="mb-5 text-xl font-black text-gray-900">
                👨‍👩‍👧 Data Orang Tua
              </h2>

              <div className="grid gap-5 md:grid-cols-2">

                <Item
                  label="Nama Ayah"
                  value={
                    data.nama_ayah
                  }
                />

                <Item
                  label="Nama Ibu"
                  value={
                    data.nama_ibu
                  }
                />

                <Item
                  label="No. KK"
                  value={data.no_kk}
                />

                <Item
                  label="No. KTP Orang Tua"
                  value={
                    data.no_ktp_orang_tua
                  }
                />

              </div>
            </section>

            {/* =====================================================
                DOKUMEN
            ===================================================== */}

            <section className="mb-6 rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="mb-5 text-xl font-black text-gray-900">
                📎 Dokumen Persyaratan
              </h2>

              <div className="grid gap-4 md:grid-cols-2">

                {dokumen.map(
                  (item) => (
                    <div
                      key={item.nama}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >

                      <div>
                        <p className="font-bold text-gray-800">
                          {item.nama}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.url
                            ? "Dokumen tersedia"
                            : "Belum tersedia"}
                        </p>
                      </div>

                      {item.url ? (
                        <a
                          href={
                            item.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="rounded-xl bg-gray-200 px-4 py-2 text-xs font-bold text-gray-400">
                          Tidak Ada
                        </span>
                      )}

                    </div>
                  )
                )}

              </div>
            </section>

          </>
        ) : null}
      </div>
    </main>
  );
}

// =====================================================
// COMPONENT ITEM
// =====================================================

function Item({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | null
    | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}