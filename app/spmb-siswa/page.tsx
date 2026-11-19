
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

type Pendaftar = {
  id: number;
  user_id: string;
  nomor_pendaftaran: string;
  pilihan_kelas: string;
  status: string;
  tanggal_seleksi: string | null;
  jenis_seleksi: string | null;
  hasil_seleksi: string | null;
  catatan_seleksi: string | null;

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
};

const programKelas = [
  {
    nama: "Kelas Reguler",
    deskripsi:
      "Program kelas Reguler. Rincian biaya mengikuti ketentuan SPMB MTs SIRNAMISKIN Tahun Pelajaran 2026/2027.",
    biayaPendaftaran: 100000,
    rincian: [
      ["Infak Bangunan", 1000000],
      ["Infak Bulanan", 100000],
      ["Buku Penunjang Pembelajaran", 250000],
      ["Pembelian Seragam", 960000],
      ["Biaya Ekstrakurikuler", 175000],
    ],
    total: 2585000,
  },
  {
    nama: "KBP",
    deskripsi:
      "Program KBP. Rincian biaya mengikuti ketentuan SPMB MTs SIRNAMISKIN Tahun Pelajaran 2026/2027.",
    biayaPendaftaran: 100000,
    rincian: [
      ["Infak Bangunan", 1000000],
      ["Infak Bulanan", 200000],
      ["Buku Penunjang Pembelajaran", 250000],
      ["Pembelian Seragam", 960000],
      ["Biaya Ekstrakurikuler", 175000],
    ],
    total: 2685000,
  },
  {
    nama: "Kelas Fullday",
    deskripsi:
      "Program kelas Fullday. Rincian biaya mengikuti ketentuan SPMB MTs SIRNAMISKIN Tahun Pelajaran 2026/2027.",
    biayaPendaftaran: 100000,
    rincian: [
      ["Infak Bangunan", 1000000],
      ["Infak Bulanan", 150000],
      ["Buku Penunjang Pembelajaran", 250000],
      ["Pembelian Seragam", 960000],
      ["Biaya Ekstrakurikuler", 175000],
    ],
    total: 2635000,
  },
  {
    nama: "Kelas Boarding",
    deskripsi:
      "Program kelas Boarding. Rincian biaya mengikuti ketentuan SPMB MTs SIRNAMISKIN Tahun Pelajaran 2026/2027.",
    biayaPendaftaran: 100000,
    rincian: [
      ["Infak Bangunan", 1000000],
      ["Infak Bulanan", 100000],
      ["Buku Penunjang Pembelajaran", 250000],
      ["Pembelian Seragam", 960000],
      ["Biaya Ekstrakurikuler", 175000],
      ["Biaya Prasarana Pesantren", 175000],
      ["Syahriah Pesantren", 1500000],
    ],
    total: 4785000,
  },
] as const;

function formatRupiah(angka: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

function formatTanggal(tanggal: string | null | undefined) {
  if (!tanggal) return "Belum ditentukan";

  const date = new Date(`${tanggal.slice(0, 10)}T00:00:00`);

  if (isNaN(date.getTime())) return tanggal;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function SPMBSiswaPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [namaAkun, setNamaAkun] = useState("Siswa");
  const [showForm, setShowForm] = useState(false);

  const [sudahDaftar, setSudahDaftar] = useState(false);
  const [dataPendaftar, setDataPendaftar] =
    useState<Pendaftar | null>(null);

  const [berkasUrls, setBerkasUrls] = useState({
    ijazah: "",
    surat_kelulusan: "",
    akta: "",
    kartu_keluarga: "",
    surat_kelakuan_baik: "",
    ktp_orang_tua: "",
    pas_foto_3x4: "",
    pas_foto_2x3: "",
  });

  const [form, setForm] = useState({
    pilihan_kelas: "",
    nama_lengkap: "",
    nisn: "",
    nik: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    asal_sekolah: "",
    nama_ayah: "",
    nama_ibu: "",
    no_kk: "",
    no_ktp_orang_tua: "",
    no_hp: "",
  });

  const [files, setFiles] = useState({
    ijazah: null as File | null,
    surat_kelulusan: null as File | null,
    akta: null as File | null,
    kk: null as File | null,
    surat_kelakuan_baik: null as File | null,
    ktp_orang_tua: null as File | null,
    pas_foto_3x4: null as File | null,
    pas_foto_2x3: null as File | null,
  });

  // =====================================================
  // AMBIL LINK BERKAS
  // =====================================================

  async function ambilBerkas(data: Pendaftar) {
    try {
      const hasil = {
        ijazah: "",
        surat_kelulusan: "",
        akta: "",
        kartu_keluarga: "",
        surat_kelakuan_baik: "",
        ktp_orang_tua: "",
        pas_foto_3x4: "",
        pas_foto_2x3: "",
      };

      const buatSignedUrl = async (path: string | null) => {
        if (!path) return "";

        const { data: urlData, error } = await supabase.storage
          .from("berkas-spmb")
          .createSignedUrl(path, 3600);

        if (error) {
          console.error("Gagal membuat link berkas:", error.message);
          return "";
        }

        return urlData?.signedUrl || "";
      };

      hasil.ijazah = await buatSignedUrl(data.ijazah_url);

      hasil.surat_kelulusan = await buatSignedUrl(
        data.surat_kelulusan_url
      );

      hasil.akta = await buatSignedUrl(data.akta_kelahiran_url);

      hasil.kartu_keluarga = await buatSignedUrl(
        data.kartu_keluarga_url
      );

      hasil.surat_kelakuan_baik = await buatSignedUrl(
        data.surat_kelakuan_baik_url
      );

      hasil.ktp_orang_tua = await buatSignedUrl(
        data.ktp_orang_tua_url
      );

      if (data.pas_foto_url) {
        try {
          const foto = JSON.parse(data.pas_foto_url);

          if (Array.isArray(foto)) {
            hasil.pas_foto_3x4 = await buatSignedUrl(
              foto[0] || null
            );

            hasil.pas_foto_2x3 = await buatSignedUrl(
              foto[1] || null
            );
          }
        } catch (error) {
          console.error("Gagal membaca pas_foto_url:", error);
        }
      }

      setBerkasUrls(hasil);
    } catch (error) {
      console.error("Gagal mengambil berkas:", error);
    }
  }

  // =====================================================
  // AMBIL DATA PENDAFTAR
  // =====================================================

  async function ambilDataPendaftar(userId: string) {
    const { data, error } = await supabase
      .from("pendaftar_spmb")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil data pendaftar:", error.message);
      return;
    }

    if (data) {
      setDataPendaftar(data);
      setNamaAkun(data.nama_lengkap || "Siswa");
      setSudahDaftar(true);

      await ambilBerkas(data);
    } else {
      setDataPendaftar(null);
      setNamaAkun("Siswa");
      setSudahDaftar(false);
    }
  }

  // =====================================================
  // CEK LOGIN + DATA PENDAFTAR
  // =====================================================

  useEffect(() => {
    let aktif = true;

    async function cekLoginDanData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login-siswa");
        return;
      }

      if (!aktif) return;

      setNamaAkun(
        session.user.user_metadata?.nama_lengkap ||
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          "Siswa"
      );

      await ambilDataPendaftar(session.user.id);

      if (aktif) {
        setChecking(false);
      }
    }

    cekLoginDanData();

    async function saatTabAktif() {
      if (document.visibilityState !== "visible") return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      await ambilDataPendaftar(session.user.id);
    }

    document.addEventListener("visibilitychange", saatTabAktif);

    return () => {
      aktif = false;
      document.removeEventListener("visibilitychange", saatTabAktif);
    };
  }, [router]);

  // =====================================================
  // LOGOUT
  // =====================================================

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login-siswa");
  }

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =====================================================
  // HANDLE FILE
  // =====================================================

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof files
  ) {
    const file = e.target.files?.[0] || null;

    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  }

  // =====================================================
  // UPLOAD FILE
  // =====================================================

  async function uploadFile(
    file: File,
    folder: string,
    namaFile: string
  ) {
    const extension = file.name.split(".").pop();

    const filePath = `${folder}/${namaFile}.${extension}`;

    const { error } = await supabase.storage
      .from("berkas-spmb")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      throw new Error(`Gagal upload ${namaFile}: ${error.message}`);
    }

    return filePath;
  }

  // =====================================================
  // SUBMIT PENDAFTARAN
  // =====================================================

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login-siswa");
        return;
      }

      const { data: existingData } = await supabase
        .from("pendaftar_spmb")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (existingData) {
        throw new Error(
          "Akun ini sudah memiliki data pendaftaran SPMB."
        );
      }

      const fileEntries = Object.entries(files);

      for (const [key, file] of fileEntries) {
        if (!file) {
          throw new Error(
            `File ${key.replaceAll("_", " ")} wajib diupload.`
          );
        }
      }

      const { count: jumlahPendaftar, error: countError } =
        await supabase
          .from("pendaftar_spmb")
          .select("id", {
            count: "exact",
            head: true,
          });

      if (countError) {
        throw new Error(
          `Gagal membuat nomor pendaftaran: ${countError.message}`
        );
      }

      const nomorUrut = (jumlahPendaftar ?? 0) + 1;

      const nomorPendaftaran = `SPMB-${new Date().getFullYear()}-${String(
        nomorUrut
      ).padStart(4, "0")}`;

      const folder = nomorPendaftaran;

      const ijazahPath = await uploadFile(
        files.ijazah!,
        folder,
        "ijazah"
      );

      const suratKelulusanPath = await uploadFile(
        files.surat_kelulusan!,
        folder,
        "surat-kelulusan"
      );

      const aktaPath = await uploadFile(
        files.akta!,
        folder,
        "akta-kelahiran"
      );

      const kkPath = await uploadFile(
        files.kk!,
        folder,
        "kartu-keluarga"
      );

      const suratKelakuanPath = await uploadFile(
        files.surat_kelakuan_baik!,
        folder,
        "surat-kelakuan-baik"
      );

      const ktpOrangTuaPath = await uploadFile(
        files.ktp_orang_tua!,
        folder,
        "ktp-orang-tua"
      );

      const pasFoto3x4Path = await uploadFile(
        files.pas_foto_3x4!,
        folder,
        "pas-foto-3x4"
      );

      const pasFoto2x3Path = await uploadFile(
        files.pas_foto_2x3!,
        folder,
        "pas-foto-2x3"
      );

      const { error: insertError } = await supabase
        .from("pendaftar_spmb")
        .insert({
          user_id: session.user.id,
          nomor_pendaftaran: nomorPendaftaran,
          pilihan_kelas: form.pilihan_kelas,
          status: "Menunggu Verifikasi",
          nama_lengkap: form.nama_lengkap,
          nisn: form.nisn,
          nik: form.nik,
          tempat_lahir: form.tempat_lahir,
          tanggal_lahir: form.tanggal_lahir,
          jenis_kelamin: form.jenis_kelamin,
          alamat: form.alamat,
          asal_sekolah: form.asal_sekolah,
          nama_ayah: form.nama_ayah,
          nama_ibu: form.nama_ibu,
          no_kk: form.no_kk,
          no_ktp_orang_tua: form.no_ktp_orang_tua,
          no_hp: form.no_hp,
          ijazah_url: ijazahPath,
          surat_kelulusan_url: suratKelulusanPath,
          akta_kelahiran_url: aktaPath,
          kartu_keluarga_url: kkPath,
          surat_kelakuan_baik_url: suratKelakuanPath,
          ktp_orang_tua_url: ktpOrangTuaPath,
          pas_foto_url: JSON.stringify([
            pasFoto3x4Path,
            pasFoto2x3Path,
          ]),
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      const { data: newData } = await supabase
        .from("pendaftar_spmb")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (newData) {
        setDataPendaftar(newData);
        setSudahDaftar(true);
        setNamaAkun(newData.nama_lengkap || "Siswa");

        await ambilBerkas(newData);
      }

      setSuccess(nomorPendaftaran);

      setForm({
        pilihan_kelas: "",
        nama_lengkap: "",
        nisn: "",
        nik: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        alamat: "",
        asal_sekolah: "",
        nama_ayah: "",
        nama_ibu: "",
        no_kk: "",
        no_ktp_orang_tua: "",
        no_hp: "",
      });

      setFiles({
        ijazah: null,
        surat_kelulusan: null,
        akta: null,
        kk: null,
        surat_kelakuan_baik: null,
        ktp_orang_tua: null,
        pas_foto_3x4: null,
        pas_foto_2x3: null,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim pendaftaran."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // WARNA STATUS PENDAFTARAN
  // =====================================================

  function statusStyle(status: string) {
    const statusLower = status.toLowerCase();

    if (
      statusLower === "diterima" ||
      statusLower.includes("lulus")
    ) {
      return {
        box: "bg-green-50 border-green-200",
        text: "text-green-700",
        icon: "✓",
      };
    }

    if (
      statusLower === "ditolak" ||
      statusLower.includes("tidak lulus")
    ) {
      return {
        box: "bg-red-50 border-red-200",
        text: "text-red-700",
        icon: "!",
      };
    }

    if (
      statusLower === "diverifikasi" ||
      statusLower === "terverifikasi"
    ) {
      return {
        box: "bg-blue-50 border-blue-200",
        text: "text-blue-700",
        icon: "✓",
      };
    }

    if (statusLower.includes("perbaikan")) {
      return {
        box: "bg-orange-50 border-orange-200",
        text: "text-orange-700",
        icon: "!",
      };
    }

    return {
      box: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-700",
      icon: "⏳",
    };
  }

  // =====================================================
  // DESKRIPSI STATUS PENDAFTARAN
  // =====================================================

  function deskripsiStatus(status: string) {
    const statusLower = status.toLowerCase();

    if (statusLower === "menunggu verifikasi") {
      return "Data pendaftaran kamu sudah tersimpan. Silakan menunggu proses pemeriksaan dan verifikasi dari pihak sekolah.";
    }

    if (
      statusLower === "diverifikasi" ||
      statusLower === "terverifikasi"
    ) {
      return "Data pendaftaran kamu sudah diperiksa dan diverifikasi oleh pihak sekolah. Silakan menunggu informasi seleksi berikutnya.";
    }

    if (statusLower.includes("perbaikan")) {
      return "Ada data atau berkas yang perlu diperbaiki. Silakan perhatikan catatan dari pihak sekolah atau hubungi panitia SPMB.";
    }

    if (statusLower === "diterima") {
      return "Selamat! Pendaftaran kamu telah dinyatakan diterima oleh MTs SIRNAMISKIN.";
    }

    if (statusLower === "ditolak") {
      return "Pendaftaran kamu belum dapat diterima. Silakan menghubungi pihak sekolah untuk mendapatkan informasi lebih lanjut.";
    }

    return "Status pendaftaran kamu sedang diproses oleh pihak sekolah.";
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-green-800 font-semibold">
          Memeriksa akun siswa...
        </p>
      </main>
    );
  }

  // =====================================================
  // HALAMAN
  // =====================================================

  return (
    <>
      {/* POPUP BERHASIL */}

      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl font-bold text-green-700">
                ✓
              </span>
            </div>

            <h2 className="text-2xl font-bold text-green-800">
              Pendaftaran Berhasil!
            </h2>

            <p className="mt-3 text-gray-600">
              Nomor pendaftaran kamu:
            </p>

            <div className="mt-4 rounded-2xl bg-green-50 border border-green-200 px-5 py-4">
              <p className="text-2xl font-bold text-green-800">
                {success}
              </p>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Simpan nomor pendaftaran ini untuk keperluan selanjutnya.
            </p>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="mt-6 w-full rounded-xl bg-green-800 py-3 font-bold text-white hover:bg-green-900 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* POPUP ERROR */}

      {error && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <span className="text-4xl font-bold text-red-600">
                !
              </span>
            </div>

            <h2 className="text-2xl font-bold text-red-700">
              Pendaftaran Gagal
            </h2>

            <p className="mt-4 text-gray-600">{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="mt-6 w-full rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-green-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}

          <div className="bg-gradient-to-r from-green-950 via-green-800 to-emerald-600 text-white rounded-3xl p-8 mb-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-green-100 mb-2">
                  SPMB Online
                </p>

                <h1 className="text-3xl md:text-4xl font-bold">
                  MTs SIRNAMISKIN
                </h1>

                <p className="mt-3 text-green-100">
                  Sistem Penerimaan Murid Baru
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-white/15 border border-white/20 px-5 py-3 font-semibold hover:bg-white/25 transition"
              >
                Keluar
              </button>
            </div>

            <div className="mt-5 bg-white/10 rounded-xl px-4 py-3">
              <span className="text-sm text-green-100">
                Akun siswa
              </span>

              <p className="font-semibold">{namaAkun}</p>
            </div>
          </div>

          {/* DASHBOARD SISWA YANG SUDAH MENDAFTAR */}

          {sudahDaftar && dataPendaftar ? (
            <section className="space-y-6">

              {/* SAPAAN DAN STATUS PENDAFTARAN */}

              <section className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                <p className="text-sm font-semibold text-green-600">
                  Dashboard Calon Murid
                </p>

                <h2 className="mt-1 text-2xl md:text-3xl font-bold text-green-900">
                  Halo, {dataPendaftar.nama_lengkap}!
                </h2>

                <p className="mt-2 text-gray-600">
                  Berikut informasi pendaftaran SPMB kamu di MTs SIRNAMISKIN.
                </p>

                <div
                  className={`mt-6 rounded-2xl border p-5 ${
                    statusStyle(dataPendaftar.status).box
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold ${
                        statusStyle(dataPendaftar.status).text
                      }`}
                    >
                      {statusStyle(dataPendaftar.status).icon}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        Status Pendaftaran
                      </p>

                      <p
                        className={`mt-1 text-xl font-bold ${
                          statusStyle(dataPendaftar.status).text
                        }`}
                      >
                        {dataPendaftar.status}
                      </p>

                      <p className="mt-2 text-sm text-gray-600">
                        {deskripsiStatus(dataPendaftar.status)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
                    <p className="text-sm text-gray-500">
                      Nomor Pendaftaran
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-800 break-all">
                      {dataPendaftar.nomor_pendaftaran}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
                    <p className="text-sm text-gray-500">
                      Program Kelas
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-800">
                      {dataPendaftar.pilihan_kelas}
                    </p>
                  </div>
                </div>
              </section>

              {/* HASIL SELEKSI */}

              <section className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 text-xl">
                    <span>i</span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-blue-600">
                      Informasi Seleksi
                    </p>

                    <h3 className="text-xl font-bold text-gray-900">
                      Hasil Seleksi
                    </h3>
                  </div>
                </div>

                {dataPendaftar.hasil_seleksi ? (
                  <div
                    className={`mt-5 rounded-2xl border p-5 ${
                      dataPendaftar.hasil_seleksi
                        .toLowerCase()
                        .includes("diterima")
                        ? "border-green-200 bg-green-50"
                        : dataPendaftar.hasil_seleksi
                            .toLowerCase()
                            .includes("ditolak")
                          ? "border-red-200 bg-red-50"
                          : "border-blue-200 bg-blue-50"
                    }`}
                  >
                    <p className="text-sm text-gray-500">
                      Hasil Seleksi Kamu
                    </p>

                    <p
                      className={`mt-1 text-2xl font-bold ${
                        dataPendaftar.hasil_seleksi
                          .toLowerCase()
                          .includes("diterima")
                          ? "text-green-700"
                          : dataPendaftar.hasil_seleksi
                              .toLowerCase()
                              .includes("ditolak")
                            ? "text-red-700"
                            : "text-blue-700"
                      }`}
                    >
                      {dataPendaftar.hasil_seleksi}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Hasil seleksi telah diperbarui oleh pihak sekolah.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                    <p className="font-bold text-yellow-800">
                      Hasil Seleksi Belum Diumumkan
                    </p>

                    <p className="mt-2 text-sm text-yellow-800">
                      Saat ini belum ada hasil seleksi yang diumumkan oleh pihak sekolah. Silakan pantau dashboard ini secara berkala untuk mendapatkan informasi terbaru.
                    </p>
                  </div>
                )}

                <div className="mt-5 grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">
                      Tanggal Seleksi
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {formatTanggal(dataPendaftar.tanggal_seleksi)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">
                      Jenis Seleksi
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {dataPendaftar.jenis_seleksi || "Belum ditentukan"}
                    </p>
                  </div>
                </div>

                {dataPendaftar.catatan_seleksi && (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Catatan dari Sekolah
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {dataPendaftar.catatan_seleksi}
                    </p>
                  </div>
                )}
              </section>

              {/* DATA PENDAFTARAN */}

              <section className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-green-900">
                    Detail Data Pendaftaran
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Klik bagian di bawah untuk melihat detail data kamu.
                  </p>
                </div>

                <DataSection title="1. Data Pendaftaran">
                  <DataItem
                    label="Nomor Pendaftaran"
                    value={dataPendaftar.nomor_pendaftaran}
                  />

                  <DataItem
                    label="Program Kelas"
                    value={dataPendaftar.pilihan_kelas}
                  />

                  <DataItem
                    label="Tanggal Pendaftaran"
                    value={formatTanggal(dataPendaftar.created_at)}
                  />

                  <DataItem
                    label="Status Pendaftaran"
                    value={dataPendaftar.status}
                  />
                </DataSection>

                <DataSection title="2. Data Diri Siswa">
                  <DataItem
                    label="Nama Lengkap"
                    value={dataPendaftar.nama_lengkap}
                  />

                  <DataItem
                    label="NISN"
                    value={dataPendaftar.nisn}
                  />

                  <DataItem
                    label="NIK"
                    value={dataPendaftar.nik}
                  />

                  <DataItem
                    label="Tempat Lahir"
                    value={dataPendaftar.tempat_lahir}
                  />

                  <DataItem
                    label="Tanggal Lahir"
                    value={formatTanggal(dataPendaftar.tanggal_lahir)}
                  />

                  <DataItem
                    label="Jenis Kelamin"
                    value={dataPendaftar.jenis_kelamin}
                  />

                  <DataItem
                    label="Asal Sekolah"
                    value={dataPendaftar.asal_sekolah}
                  />

                  <DataItem
                    label="Nomor HP"
                    value={dataPendaftar.no_hp}
                  />

                  <DataItem
                    label="Alamat"
                    value={dataPendaftar.alamat}
                  />
                </DataSection>

                <DataSection title="3. Data Orang Tua">
                  <DataItem
                    label="Nama Ayah"
                    value={dataPendaftar.nama_ayah}
                  />

                  <DataItem
                    label="Nama Ibu"
                    value={dataPendaftar.nama_ibu}
                  />

                  <DataItem
                    label="Nomor KK"
                    value={dataPendaftar.no_kk}
                  />

                  <DataItem
                    label="Nomor KTP Orang Tua"
                    value={dataPendaftar.no_ktp_orang_tua}
                  />
                </DataSection>

                <DataSection title="4. Berkas Pendaftaran">
                  <BerkasItem
                    label="Ijazah"
                    url={berkasUrls.ijazah}
                  />

                  <BerkasItem
                    label="Surat Kelulusan"
                    url={berkasUrls.surat_kelulusan}
                  />

                  <BerkasItem
                    label="Akta Kelahiran"
                    url={berkasUrls.akta}
                  />

                  <BerkasItem
                    label="Kartu Keluarga (KK)"
                    url={berkasUrls.kartu_keluarga}
                  />

                  <BerkasItem
                    label="Surat Kelakuan Baik"
                    url={berkasUrls.surat_kelakuan_baik}
                  />

                  <BerkasItem
                    label="KTP Orang Tua"
                    url={berkasUrls.ktp_orang_tua}
                  />

                  <BerkasItem
                    label="Pas Foto 3x4"
                    url={berkasUrls.pas_foto_3x4}
                  />

                  <BerkasItem
                    label="Pas Foto 2x3"
                    url={berkasUrls.pas_foto_2x3}
                  />
                </DataSection>
              </section>
            </section>

          ) : !showForm ? (

            /* INFORMASI PROGRAM + BIAYA */

            <section className="space-y-6">
              <section className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                <p className="text-sm text-green-600 font-semibold">
                  Sebelum Mengisi Formulir
                </p>

                <h2 className="mt-1 text-2xl md:text-3xl font-bold text-green-900">
                  Program Kelas & Rincian Biaya
                </h2>

                <p className="mt-3 text-gray-600">
                  Silakan pahami program kelas serta rincian biaya SPMB MTs SIRNAMISKIN Tahun Pelajaran 2026/2027 sebelum mengisi formulir pendaftaran.
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-6">
                {programKelas.map((program) => (
                  <section
                    key={program.nama}
                    className="bg-white rounded-3xl shadow-lg border border-green-100 p-6"
                  >
                    <h3 className="text-xl font-bold text-green-900">
                      {program.nama}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {program.deskripsi}
                    </p>

                    <div className="mt-5 rounded-2xl bg-green-50 border border-green-100 p-4">
                      <p className="text-sm text-gray-500">
                        Biaya Pendaftaran
                      </p>

                      <p className="mt-1 text-lg font-bold text-green-800">
                        {formatRupiah(program.biayaPendaftaran)}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      {program.rincian.map(([label, nominal]) => (
                        <div
                          key={label}
                          className="flex items-start justify-between gap-4 text-sm"
                        >
                          <span className="text-gray-600">
                            {label}
                          </span>

                          <span className="font-semibold text-gray-800 text-right">
                            {formatRupiah(nominal)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between gap-4">
                      <span className="font-bold text-gray-700">
                        Jumlah
                      </span>

                      <span className="text-xl font-bold text-green-800">
                        {formatRupiah(program.total)}
                      </span>
                    </div>
                  </section>
                ))}
              </div>

              <section className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold text-green-900">
                  Pembelian Seragam
                </h2>

                <div className="mt-4 rounded-2xl bg-green-50 border border-green-100 p-5">
                  <p className="text-sm text-gray-500">
                    Biaya Pembelian Seragam
                  </p>

                  <p className="mt-1 text-2xl font-bold text-green-800">
                    Rp960.000
                  </p>
                </div>

                <p className="mt-5 font-semibold text-gray-700">
                  Seragam yang tercantum dalam dokumen:
                </p>

                <div className="mt-3 grid sm:grid-cols-2 gap-3">
                  {[
                    "Seragam Harian",
                    "Seragam Batik",
                    "Seragam Olahraga",
                    "Seragam Taqwa",
                    "Seragam Pramuka",
                  ].map((seragam) => (
                    <div
                      key={seragam}
                      className="rounded-xl border border-gray-200 px-4 py-3 text-gray-700"
                    >
                      {seragam}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                <p className="font-semibold text-yellow-900">
                  Informasi Pembayaran
                </p>

                <p className="mt-2 text-yellow-800">
                  Untuk urusan biaya pendaftaran silakan datang langsung ke sekolah.
                </p>
              </section>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full rounded-2xl bg-green-800 hover:bg-green-900 text-white font-bold py-4 shadow-lg transition"
              >
                Mulai Isi Formulir SPMB
              </button>
            </section>

          ) : (

            /* FORM PENDAFTARAN */

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-green-200 bg-white px-5 py-3 font-semibold text-green-800 hover:bg-green-50 transition"
              >
                ← Kembali ke Informasi Program & Biaya
              </button>

              {/* DATA PENDAFTARAN */}

              <section className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-green-900 mb-5">
                  1. Data Pendaftaran
                </h2>

                <label className="block mb-2 font-semibold text-gray-700">
                  Program Kelas
                </label>

                <select
                  name="pilihan_kelas"
                  value={form.pilihan_kelas}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Pilih Program Kelas</option>
                  <option value="Kelas Reguler">Kelas Reguler</option>
                  <option value="KBP">KBP</option>
                  <option value="Kelas Fullday">Kelas Fullday</option>
                  <option value="Kelas Boarding">Kelas Boarding</option>
                </select>
              </section>

              {/* DATA DIRI */}

              <section className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-green-900 mb-5">
                  2. Data Diri Siswa
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="Nama Lengkap"
                    name="nama_lengkap"
                    value={form.nama_lengkap}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="NISN"
                    name="nisn"
                    value={form.nisn}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="NIK"
                    name="nik"
                    value={form.nik}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Tempat Lahir"
                    name="tempat_lahir"
                    value={form.tempat_lahir}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Tanggal Lahir"
                    name="tanggal_lahir"
                    type="date"
                    value={form.tanggal_lahir}
                    onChange={handleChange}
                    required
                  />

                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Jenis Kelamin
                    </label>

                    <select
                      name="jenis_kelamin"
                      value={form.jenis_kelamin}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <Input
                    label="Asal Sekolah"
                    name="asal_sekolah"
                    value={form.asal_sekolah}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Nomor HP"
                    name="no_hp"
                    value={form.no_hp}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mt-5">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Alamat
                  </label>

                  <textarea
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </section>

              {/* DATA ORANG TUA */}

              <section className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-green-900 mb-5">
                  3. Data Orang Tua
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="Nama Ayah"
                    name="nama_ayah"
                    value={form.nama_ayah}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Nama Ibu"
                    name="nama_ibu"
                    value={form.nama_ibu}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Nomor KK"
                    name="no_kk"
                    value={form.no_kk}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Nomor KTP Orang Tua"
                    name="no_ktp_orang_tua"
                    value={form.no_ktp_orang_tua}
                    onChange={handleChange}
                    required
                  />
                </div>
              </section>

              {/* BERKAS */}

              <section className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold text-green-900 mb-2">
                  4. Upload Berkas
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                  Semua berkas wajib diupload.
                </p>

                <div className="grid md:grid-cols-2 gap-5">
                  <FileInput
                    label="Ijazah"
                    onChange={(e) => handleFileChange(e, "ijazah")}
                  />

                  <FileInput
                    label="Surat Kelulusan"
                    onChange={(e) =>
                      handleFileChange(e, "surat_kelulusan")
                    }
                  />

                  <FileInput
                    label="Akta Kelahiran"
                    onChange={(e) => handleFileChange(e, "akta")}
                  />

                  <FileInput
                    label="Kartu Keluarga (KK)"
                    onChange={(e) => handleFileChange(e, "kk")}
                  />

                  <FileInput
                    label="Surat Kelakuan Baik"
                    onChange={(e) =>
                      handleFileChange(e, "surat_kelakuan_baik")
                    }
                  />

                  <FileInput
                    label="KTP Orang Tua"
                    onChange={(e) =>
                      handleFileChange(e, "ktp_orang_tua")
                    }
                  />

                  <FileInput
                    label="Pas Foto 3x4"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(e, "pas_foto_3x4")
                    }
                  />

                  <FileInput
                    label="Pas Foto 2x3"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(e, "pas_foto_2x3")
                    }
                  />
                </div>
              </section>

              {/* TOMBOL */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg transition"
              >
                {loading
                  ? "Mengirim Pendaftaran..."
                  : "Kirim Pendaftaran"}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

// =====================================================
// DATA SECTION - BISA DIBUKA DAN DITUTUP
// =====================================================

function DataSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-3 bg-green-50 px-5 py-5 font-bold text-green-900 hover:bg-green-100 transition">
        <span>{title}</span>

        <span className="text-xl transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>

      <div className="grid md:grid-cols-2 gap-x-6">
        {children}
      </div>
    </details>
  );
}

// =====================================================
// DATA ITEM
// =====================================================

function DataItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="px-5 py-4 border-b border-gray-100">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 font-semibold text-gray-800 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

// =====================================================
// BERKAS ITEM
// =====================================================

function BerkasItem({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  return (
    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500">Berkas</p>

        <p className="mt-1 font-semibold text-gray-800">
          {label}
        </p>
      </div>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
        >
          👁️ Lihat Berkas
        </a>
      ) : (
        <span className="shrink-0 rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-500">
          Tidak tersedia
        </span>
      )}
    </div>
  );
}

// =====================================================
// INPUT
// =====================================================

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
}

// =====================================================
// FILE INPUT
// =====================================================

function FileInput({
  label,
  accept,
  onChange,
}: {
  label: string;
  accept?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-gray-700">
        {label}
      </label>

      <input
        type="file"
        accept={accept}
        onChange={onChange}
        required
        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
      />
    </div>
  );
}
