
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";

type Pendaftar = {
  id: number;
  nomor_pendaftaran: string | null;
  pilihan_kelas: string | null;
  status: string | null;
  nama_lengkap: string;
  nisn: string | null;
  nik: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  alamat: string | null;
  asal_sekolah: string | null;
  nama_ayah: string | null;
  nama_ibu: string | null;
  no_kk: string | null;
  no_ktp_orang_tua: string | null;
  no_hp: string | null;
  ijazah_url: string | null;
  surat_kelulusan_url: string | null;
  akta_kelahiran_url: string | null;
  kartu_keluarga_url: string | null;
  surat_kelakuan_baik_url: string | null;
  pas_foto_url: string | null;
  ktp_orang_tua_url: string | null;
  created_at: string;
};

type Gelombang = {
  id: number;
  nama_gelombang: string;
  tanggal_mulai_pendaftaran: string;
  tanggal_batas_pendaftaran: string;
  tanggal_seleksi: string;
  aktif: boolean;
};

type PasFoto = {
  path: string;
  label: string;
};

export default function AdminSPMBPage() {
  const router = useRouter();

  const [menu, setMenu] = useState<"pendaftar" | "gelombang">("pendaftar");

  const [pendaftar, setPendaftar] = useState<Pendaftar[]>([]);
  const [gelombang, setGelombang] = useState<Gelombang[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingGelombang, setLoadingGelombang] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedPendaftar, setSelectedPendaftar] =
    useState<Pendaftar | null>(null);

  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [loadingFoto, setLoadingFoto] = useState(false);

  const [pasFotoList, setPasFotoList] = useState<PasFoto[]>([]);
  const [loadingPasFoto, setLoadingPasFoto] = useState(false);

  const totalPendaftar = pendaftar.length;

  const menungguVerifikasi = pendaftar.filter(
    (item) => item.status === "Menunggu Verifikasi"
  ).length;

  const diterima = pendaftar.filter(
    (item) => item.status === "Diterima"
  ).length;

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    setCheckingAuth(false);
    fetchPendaftar();
    fetchGelombang();
  }

  // ==========================================
  // AMBIL DATA PENDAFTAR
  // ==========================================

  async function fetchPendaftar() {
    setLoading(true);

    const { data, error } = await supabase
      .from("pendaftar_spmb")
      .select(`
        id,
        nomor_pendaftaran,
        pilihan_kelas,
        status,
        nama_lengkap,
        nisn,
        nik,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        asal_sekolah,
        nama_ayah,
        nama_ibu,
        no_kk,
        no_ktp_orang_tua,
        no_hp,
        ijazah_url,
        surat_kelulusan_url,
        akta_kelahiran_url,
        kartu_keluarga_url,
        surat_kelakuan_baik_url,
        pas_foto_url,
        ktp_orang_tua_url,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert("Gagal mengambil data pendaftar.");
    } else {
      setPendaftar((data || []) as Pendaftar[]);
    }

    setLoading(false);
  }

  // ==========================================
  // AMBIL DATA GELOMBANG
  // ==========================================

  async function fetchGelombang() {
    setLoadingGelombang(true);

    const { data, error } = await supabase
      .from("gelombang_spmb")
      .select(`
        id,
        nama_gelombang,
        tanggal_mulai_pendaftaran,
        tanggal_batas_pendaftaran,
        tanggal_seleksi,
        aktif
      `)
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      alert("Gagal mengambil data gelombang SPMB.");
    } else {
      setGelombang((data || []) as Gelombang[]);
    }

    setLoadingGelombang(false);
  }

  // ==========================================
  // UBAH STATUS PENDAFTAR
  // ==========================================

  async function ubahStatus(id: number, status: string) {
    const { error } = await supabase
      .from("pendaftar_spmb")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Status gagal diperbarui. Periksa izin database.");
      return;
    }

    alert("Status pendaftar berhasil diperbarui.");

    setSelectedPendaftar((prev) =>
      prev ? { ...prev, status } : null
    );

    fetchPendaftar();
  }

  // ==========================================
  // SIMPAN INFORMASI GELOMBANG
  // ==========================================

  async function simpanGelombang(item: Gelombang) {
    if (
      !item.nama_gelombang.trim() ||
      !item.tanggal_mulai_pendaftaran ||
      !item.tanggal_batas_pendaftaran ||
      !item.tanggal_seleksi
    ) {
      alert("Semua data gelombang harus diisi.");
      return;
    }

    if (
      item.tanggal_batas_pendaftaran <
      item.tanggal_mulai_pendaftaran
    ) {
      alert("Tanggal batas pendaftaran tidak boleh sebelum tanggal mulai.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("gelombang_spmb")
      .update({
        nama_gelombang: item.nama_gelombang,
        tanggal_mulai_pendaftaran: item.tanggal_mulai_pendaftaran,
        tanggal_batas_pendaftaran: item.tanggal_batas_pendaftaran,
        tanggal_seleksi: item.tanggal_seleksi,
      })
      .eq("id", item.id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Gagal menyimpan perubahan gelombang.");
      return;
    }

    alert("Informasi gelombang berhasil disimpan.");
    fetchGelombang();
  }

  // ==========================================
  // AKTIFKAN GELOMBANG
  // ==========================================

  async function aktifkanGelombang(id: number) {
    const konfirmasi = window.confirm(
      "Aktifkan gelombang ini? Gelombang lain akan dinonaktifkan."
    );

    if (!konfirmasi) return;

    setSaving(true);

    const { error: nonaktifError } = await supabase
      .from("gelombang_spmb")
      .update({ aktif: false })
      .neq("id", id);

    if (nonaktifError) {
      console.error(nonaktifError);
      setSaving(false);
      alert("Gagal mengubah status gelombang.");
      return;
    }

    const { error: aktifError } = await supabase
      .from("gelombang_spmb")
      .update({ aktif: true })
      .eq("id", id);

    setSaving(false);

    if (aktifError) {
      console.error(aktifError);
      alert("Gagal mengaktifkan gelombang.");
      return;
    }

    alert("Gelombang berhasil diaktifkan.");
    fetchGelombang();
  }

  function ubahInputGelombang(
    id: number,
    field: keyof Gelombang,
    value: string
  ) {
    setGelombang((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  // ==========================================
  // PAS FOTO
  // ==========================================

  function getPasFotoPaths(value: string | null): string[] {
    if (!value) return [];

    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => {
            if (typeof item === "string") return item.trim();

            if (
              item &&
              typeof item === "object" &&
              typeof item.path === "string"
            ) {
              return item.path.trim();
            }

            return "";
          })
          .filter(Boolean);
      }

      if (typeof parsed === "string" && parsed.trim()) {
        return [parsed.trim()];
      }
    } catch {
      // Format bukan JSON
    }

    if (value.includes(",")) {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }

    return [value.trim()];
  }

  async function loadPasFoto(
    nomorPendaftaran: string | null,
    databaseValue: string | null
  ) {
    setPasFotoList([]);

    if (!nomorPendaftaran) return;

    setLoadingPasFoto(true);

    try {
      const { data, error } = await supabase.storage
        .from("berkas-spmb")
        .list(nomorPendaftaran, {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) throw error;

      const files = data || [];

      const fotoFiles = files.filter((file) =>
        file.name.toLowerCase().includes("pas-foto")
      );

      const hasil: PasFoto[] = [];

      const foto3x4 = fotoFiles.find((file) =>
        file.name.toLowerCase().includes("3x4")
      );

      const foto2x3 = fotoFiles.find((file) =>
        file.name.toLowerCase().includes("2x3")
      );

      if (foto3x4) {
        hasil.push({
          path: `${nomorPendaftaran}/${foto3x4.name}`,
          label: "Pas Foto 3×4",
        });
      }

      if (foto2x3) {
        hasil.push({
          path: `${nomorPendaftaran}/${foto2x3.name}`,
          label: "Pas Foto 2×3",
        });
      }

      if (hasil.length === 0) {
        getPasFotoPaths(databaseValue).forEach((path, index) => {
          hasil.push({
            path,
            label: index === 0 ? "Pas Foto 3×4" : "Pas Foto 2×3",
          });
        });
      }

      setPasFotoList(hasil);
    } catch (error) {
      console.error("Gagal mencari pas foto:", error);
    } finally {
      setLoadingPasFoto(false);
    }
  }

  async function bukaDetail(item: Pendaftar) {
    setSelectedPendaftar(item);
    await loadPasFoto(item.nomor_pendaftaran, item.pas_foto_url);
  }

  // ==========================================
  // BUKA BERKAS
  // ==========================================

  async function bukaBerkas(path: string) {
    if (!path) return;

    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(path);

    setLoadingFoto(true);
    setPreviewFoto(null);

    const { data, error } = await supabase.storage
      .from("berkas-spmb")
      .createSignedUrl(path, 60 * 10);

    if (error || !data?.signedUrl) {
      console.error(error);
      setLoadingFoto(false);
      alert("Berkas tidak dapat dibuka.");
      return;
    }

    if (isImage) {
      setPreviewFoto(data.signedUrl);
      setLoadingFoto(false);
    } else {
      setLoadingFoto(false);
      window.open(data.signedUrl, "_blank");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />
          <p className="text-gray-500">Memeriksa akses admin...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
              SPMB ONLINE
            </p>

            <h1 className="mt-2 text-3xl font-black text-gray-900">
              Admin SPMB
            </h1>

            <p className="mt-2 text-gray-600">
              Kelola pendaftaran calon siswa MTs Sirnamiskin.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
          >
            Keluar
          </button>
        </div>

        {/* MENU */}

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setMenu("pendaftar")}
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              menu === "pendaftar"
                ? "bg-green-700 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Data Pendaftar
          </button>

          <button
            onClick={() => setMenu("gelombang")}
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              menu === "gelombang"
                ? "bg-green-700 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Informasi SPMB
          </button>
        </div>

        {/* MENU DATA PENDAFTAR */}

        {menu === "pendaftar" && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                label="Total Pendaftar"
                value={totalPendaftar}
                color="text-gray-900"
              />

              <StatCard
                label="Menunggu Verifikasi"
                value={menungguVerifikasi}
                color="text-yellow-600"
              />

              <StatCard
                label="Diterima"
                value={diterima}
                color="text-green-600"
              />
            </div>

            {/* TABEL PENDAFTAR */}

            <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm md:p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Data Pendaftar
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Daftar calon siswa yang mendaftar melalui SPMB Online.
                </p>
              </div>

              <div className="mt-6 overflow-x-auto">
                {loading ? (
                  <div className="p-10 text-center text-gray-500">
                    Memuat data pendaftar...
                  </div>
                ) : pendaftar.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
                    Belum ada data pendaftar.
                  </div>
                ) : (
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-4">No</th>
                        <th className="px-4 py-4">Nomor Pendaftaran</th>
                        <th className="px-4 py-4">Nama Lengkap</th>
                        <th className="px-4 py-4">Asal Sekolah</th>
                        <th className="px-4 py-4">Pilihan Kelas</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pendaftar.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-4">{index + 1}</td>

                          <td className="px-4 py-4 font-semibold">
                            {item.nomor_pendaftaran || "-"}
                          </td>

                          <td className="px-4 py-4 font-semibold text-gray-900">
                            {item.nama_lengkap}
                          </td>

                          <td className="px-4 py-4">
                            {item.asal_sekolah || "-"}
                          </td>

                          <td className="px-4 py-4">
                            {item.pilihan_kelas || "-"}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge status={item.status} />
                          </td>

                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => bukaDetail(item)}
                              className="rounded-lg bg-green-100 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-200"
                            >
                              Lihat Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {/* MENU INFORMASI SPMB */}

        {menu === "gelombang" && (
          <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Informasi Pendaftaran SPMB
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Atur jadwal pendaftaran dan seleksi calon siswa.
              </p>
            </div>

            {loadingGelombang ? (
              <div className="p-10 text-center text-gray-500">
                Memuat informasi SPMB...
              </div>
            ) : gelombang.length === 0 ? (
              <div className="rounded-xl border border-dashed p-10 text-center text-gray-500">
                Belum ada data gelombang.
              </div>
            ) : (
              <div className="space-y-5">
                {gelombang.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-200 p-5"
                  >
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {item.nama_gelombang}
                      </h3>

                      {item.aktif ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Gelombang Aktif
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                          Tidak Aktif
                        </span>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Nama Gelombang
                        </label>

                        <input
                          type="text"
                          value={item.nama_gelombang || ""}
                          onChange={(e) =>
                            ubahInputGelombang(
                              item.id,
                              "nama_gelombang",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Tanggal Mulai Pendaftaran
                        </label>

                        <input
                          type="date"
                          value={item.tanggal_mulai_pendaftaran || ""}
                          onChange={(e) =>
                            ubahInputGelombang(
                              item.id,
                              "tanggal_mulai_pendaftaran",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Batas Akhir Pendaftaran
                        </label>

                        <input
                          type="date"
                          value={item.tanggal_batas_pendaftaran || ""}
                          onChange={(e) =>
                            ubahInputGelombang(
                              item.id,
                              "tanggal_batas_pendaftaran",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Tanggal Seleksi
                        </label>

                        <input
                          type="date"
                          value={item.tanggal_seleksi || ""}
                          onChange={(e) =>
                            ubahInputGelombang(
                              item.id,
                              "tanggal_seleksi",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                      <button
                        onClick={() => simpanGelombang(item)}
                        disabled={saving}
                        className="rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Simpan Perubahan
                      </button>

                      {!item.aktif && (
                        <button
                          onClick={() => aktifkanGelombang(item.id)}
                          disabled={saving}
                          className="rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-bold text-green-700 hover:bg-green-100 disabled:opacity-50"
                        >
                          Aktifkan Gelombang
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-800">
              Informasi gelombang yang disimpan di sini dapat digunakan
              untuk ditampilkan pada halaman SPMB calon siswa.
            </p>
          </div>
        )}
      </div>

      {/* MODAL DETAIL PENDAFTAR */}

      {selectedPendaftar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-green-600">
                  Detail Pendaftar
                </p>

                <h2 className="mt-1 text-2xl font-black text-gray-900">
                  {selectedPendaftar.nama_lengkap}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedPendaftar.nomor_pendaftaran || "-"}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedPendaftar(null);
                  setPasFotoList([]);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600 hover:bg-gray-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-8 p-6">
              {/* STATUS */}

              <section className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm font-semibold text-gray-500">
                  Status Pendaftaran
                </p>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    value={
                      selectedPendaftar.status ||
                      "Menunggu Verifikasi"
                    }
                    onChange={(e) =>
                      ubahStatus(selectedPendaftar.id, e.target.value)
                    }
                    className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 outline-none focus:border-green-600"
                  >
                    <option value="Menunggu Verifikasi">
                      Menunggu Verifikasi
                    </option>
                    <option value="Diterima">Diterima</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Pilih status untuk memperbarui hasil verifikasi pendaftar.
                </p>
              </section>

              {/* DATA SISWA */}

              <section>
                <h3 className="mb-4 text-lg font-bold text-green-900">
                  Data Calon Peserta Didik
                </h3>

                <div className="grid gap-4 rounded-2xl border p-5 md:grid-cols-2">
                  <DetailItem label="Nama Lengkap" value={selectedPendaftar.nama_lengkap} />
                  <DetailItem label="NISN" value={selectedPendaftar.nisn} />
                  <DetailItem label="NIK" value={selectedPendaftar.nik} />
                  <DetailItem label="Tempat Lahir" value={selectedPendaftar.tempat_lahir} />
                  <DetailItem label="Tanggal Lahir" value={selectedPendaftar.tanggal_lahir} />
                  <DetailItem label="Jenis Kelamin" value={selectedPendaftar.jenis_kelamin} />
                  <DetailItem label="Asal Sekolah" value={selectedPendaftar.asal_sekolah} />
                  <DetailItem label="Pilihan Program" value={selectedPendaftar.pilihan_kelas} />

                  <div className="md:col-span-2">
                    <DetailItem label="Alamat" value={selectedPendaftar.alamat} />
                  </div>
                </div>
              </section>

              {/* DATA ORANG TUA */}

              <section>
                <h3 className="mb-4 text-lg font-bold text-green-900">
                  Data Orang Tua
                </h3>

                <div className="grid gap-4 rounded-2xl border p-5 md:grid-cols-2">
                  <DetailItem label="Nama Ayah" value={selectedPendaftar.nama_ayah} />
                  <DetailItem label="Nama Ibu" value={selectedPendaftar.nama_ibu} />
                  <DetailItem label="Nomor KK" value={selectedPendaftar.no_kk} />
                  <DetailItem label="No. KTP Orang Tua" value={selectedPendaftar.no_ktp_orang_tua} />
                  <DetailItem label="Nomor HP" value={selectedPendaftar.no_hp} />
                </div>
              </section>

              {/* BERKAS */}

              <section>
                <h3 className="mb-4 text-lg font-bold text-green-900">
                  Berkas Persyaratan
                </h3>

                <div className="space-y-3">
                  <FileButton label="FC Ijazah SD/MI" path={selectedPendaftar.ijazah_url} onOpen={bukaBerkas} />
                  <FileButton label="FC Surat Kelulusan" path={selectedPendaftar.surat_kelulusan_url} onOpen={bukaBerkas} />
                  <FileButton label="Akta Kelahiran" path={selectedPendaftar.akta_kelahiran_url} onOpen={bukaBerkas} />
                  <FileButton label="Kartu Keluarga" path={selectedPendaftar.kartu_keluarga_url} onOpen={bukaBerkas} />
                  <FileButton label="Surat Keterangan Kelakuan Baik" path={selectedPendaftar.surat_kelakuan_baik_url} onOpen={bukaBerkas} />
                  <FileButton label="KTP Orang Tua" path={selectedPendaftar.ktp_orang_tua_url} onOpen={bukaBerkas} />

                  {/* PAS FOTO */}

                  <div className="rounded-xl border p-4">
                    <p className="mb-1 font-semibold text-gray-800">
                      Pas Foto
                    </p>

                    <p className="mb-4 text-xs text-gray-500">
                      Foto diambil dari folder Storage pendaftar.
                    </p>

                    {loadingPasFoto ? (
                      <div className="p-8 text-center text-sm text-gray-500">
                        Mencari pas foto...
                      </div>
                    ) : pasFotoList.length === 0 ? (
                      <div className="rounded-xl bg-gray-50 p-8 text-center text-sm text-gray-400">
                        Pas foto belum ditemukan.
                      </div>
                    ) : (
                      <div className="grid gap-5 sm:grid-cols-2">
                        {pasFotoList.map((foto) => (
                          <PasFotoCard
                            key={foto.path}
                            path={foto.path}
                            label={foto.label}
                            onOpen={bukaBerkas}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="border-t bg-gray-50 px-6 py-4 text-right">
              <button
                onClick={() => {
                  setSelectedPendaftar(null);
                  setPasFotoList([]);
                }}
                className="rounded-xl bg-gray-700 px-5 py-3 font-bold text-white hover:bg-gray-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW FOTO */}

      {(previewFoto || loadingFoto) && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-5"
          onClick={() => {
            setPreviewFoto(null);
            setLoadingFoto(false);
          }}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setPreviewFoto(null);
                setLoadingFoto(false);
              }}
              className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-700 shadow-lg"
            >
              ×
            </button>

            {loadingFoto ? (
              <div className="flex h-96 w-80 items-center justify-center rounded-2xl bg-white">
                <p className="text-gray-500">Memuat foto...</p>
              </div>
            ) : previewFoto ? (
              <img
                src={previewFoto}
                alt="Preview berkas pendaftar"
                className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}

// ==========================================
// KOMPONEN STATISTIK
// ==========================================

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <h2 className={`mt-2 text-3xl font-black ${color}`}>{value}</h2>
    </div>
  );
}

// ==========================================
// KOMPONEN STATUS
// ==========================================

function StatusBadge({ status }: { status: string | null }) {
  const warna =
    status === "Diterima"
      ? "bg-green-100 text-green-700"
      : status === "Ditolak"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${warna}`}>
      {status || "Menunggu Verifikasi"}
    </span>
  );
}

// ==========================================
// DETAIL ITEM
// ==========================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 font-medium text-gray-800">{value || "-"}</p>
    </div>
  );
}

// ==========================================
// TOMBOL BERKAS
// ==========================================

function FileButton({
  label,
  path,
  onOpen,
}: {
  label: string;
  path: string | null;
  onOpen: (path: string) => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center">
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">
          {path ? "Berkas tersedia" : "Berkas belum tersedia"}
        </p>
      </div>

      {path ? (
        <button
          onClick={() => onOpen(path)}
          className="rounded-lg bg-green-100 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-200"
        >
          Lihat Berkas
        </button>
      ) : (
        <span className="text-sm text-gray-400">Belum ada</span>
      )}
    </div>
  );
}

// ==========================================
// KARTU PAS FOTO
// ==========================================

function PasFotoCard({
  path,
  label,
  onOpen,
}: {
  path: string;
  label: string;
  onOpen: (path: string) => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let aktif = true;

    async function loadFoto() {
      const { data, error } = await supabase.storage
        .from("berkas-spmb")
        .createSignedUrl(path, 60 * 10);

      if (!aktif) return;

      if (error) {
        console.error(`Gagal membuat preview ${label}:`, error);
        setLoading(false);
        return;
      }

      setUrl(data?.signedUrl || null);
      setLoading(false);
    }

    loadFoto();

    return () => {
      aktif = false;
    };
  }, [path, label]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
      <div className="border-b bg-white px-4 py-3">
        <p className="text-sm font-bold text-gray-800">{label}</p>
      </div>

      <div className="flex h-64 items-center justify-center bg-gray-100 p-4">
        {loading ? (
          <div className="text-sm text-gray-400">Memuat {label}...</div>
        ) : url ? (
          <button
            type="button"
            onClick={() => onOpen(path)}
            className="h-full w-full"
            title={`Lihat ${label}`}
          >
            <img
              src={url}
              alt={label}
              className="h-full w-full object-contain"
            />
          </button>
        ) : (
          <div className="text-sm text-red-400">
            Foto tidak dapat dimuat
          </div>
        )}
      </div>

      <div className="border-t bg-white p-3">
        <button
          type="button"
          onClick={() => onOpen(path)}
          className="w-full rounded-lg bg-green-100 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-200"
        >
          Lihat {label}
        </button>
      </div>
    </div>
  );
}
