"use client";

import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase";

type Ekstrakurikuler = {
  id: number;
  nama_ekstrakurikuler: string;
  deskripsi: string;
};

type Galeri = {
  id: number;
  judul: string;
  tanggal: string | null;
  kategori: string | null;
  deskripsi: string | null;
  foto_url: string | null;
};

type Fasilitas = {
  id: number;
  nama_fasilitas: string;
  deskripsi: string | null;
};

type ProgramKelas = {
  id: number;
  nama_program: string;
  deskripsi: string | null;
};

type TenagaPengajar = {
  id: number;
  nama: string;
};

type Prestasi = {
  id: number;
  judul: string;
};

type Lulusan = {
  id: number;
  nama_sekolah: string;
  jumlah: number;
};

type Kontak = {
  nama_sekolah: string | null;
  alamat: string | null;
  no_hp: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  tiktok: string | null;
};

type DetailType =
  | "profil"
  | "visi"
  | "program"
  | "fasilitas"
  | "prestasi"
  | "guru"
  | "ekskul"
  | "galeri"
  | null;

const fasilitasIcon: Record<string, string> = {
  "Masjid": "🕌",
  "Laboratorium IPA": "🔬",
  "Laboratorium Komputer": "💻",
  "Perpustakaan": "📚",
  "Lapangan Olahraga": "⚽",
  "Gedung Aula": "🏛️",
  "Asrama Putra dan Putri": "🏠",
  "Ruang Praktek Otomotif": "🔧",
  "Sanggar Seni": "🎨",
  "UKS": "🩺",
  "Broadcast Room": "🎥",
  "Toilet Putra - Putri": "🚻",
};

const ekskulIcon: Record<string, string> = {
  Paskibra: "🎖️",
  Pramuka: "🏕️",
  Futsal: "⚽",
  Hadroh: "🥁",
  Qori: "📖",
  Olahraga: "🏃",
  Kesenian: "🎨",
  "Saka Bhayangkara": "🛡️",
  UKS: "🩺",
  "Tae Kwon Do": "🥋",
  "Bulu Tangkis": "🏸",
  "Marching Band": "🎺",
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState<DetailType>(null);

  const [namaSekolah, setNamaSekolah] = useState("MTs SIRNAMISKIN");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [pendahuluan, setPendahuluan] = useState("");
  const [sejarahSingkat, setSejarahSingkat] = useState("");
  const [kurikulumStatus, setKurikulumStatus] = useState("");
  const [mataPelajaran, setMataPelajaran] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");

  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [programKelas, setProgramKelas] = useState<ProgramKelas[]>([]);
  const [tenagaPengajar, setTenagaPengajar] = useState<TenagaPengajar[]>([]);
  const [prestasi, setPrestasi] = useState<Prestasi[]>([]);
  const [lulusan, setLulusan] = useState<Lulusan[]>([]);
  const [ekstrakurikuler, setEkstrakurikuler] = useState<Ekstrakurikuler[]>([]);
  const [galeri, setGaleri] = useState<Galeri[]>([]);

  const [kontak, setKontak] = useState<Kontak>({
    nama_sekolah: null,
    alamat: null,
    no_hp: null,
    email: null,
    instagram: null,
    facebook: null,
    youtube: null,
    tiktok: null,
  });

  useEffect(() => {
    async function getData() {
      const [
        profilRes,
        visiRes,
        fasilitasRes,
        programRes,
        guruRes,
        prestasiRes,
        lulusanRes,
        ekskulRes,
        galeriRes,
        kontakRes,
      ] = await Promise.all([
        supabase
          .from("profil_sekolah")
          .select(
            "nama_sekolah,alamat,telepon,email,deskripsi,pendahuluan,sejarah_singkat,kurikulum_status,mata_pelajaran"
          )
          .eq("id", 1)
          .maybeSingle(),
        supabase
          .from("visi_misi")
          .select("visi,misi")
          .eq("id", 1)
          .maybeSingle(),
        supabase
          .from("fasilitas")
          .select("id,nama_fasilitas,deskripsi")
          .order("id"),
        supabase
          .from("program_kelas")
          .select("id,nama_program,deskripsi")
          .order("id"),
        supabase
          .from("tenaga_pengajar")
          .select("id,nama")
          .order("id"),
        supabase
          .from("prestasi_siswa")
          .select("id,judul")
          .order("id"),
        supabase
          .from("lulusan_sekolah")
          .select("id,nama_sekolah,jumlah")
          .order("id"),
        supabase
          .from("ekstrakurikuler")
          .select("id,nama_ekstrakurikuler,deskripsi")
          .order("id"),
        supabase
          .from("galeri")
          .select("id,judul,tanggal,kategori,deskripsi,foto_url")
          .order("id", { ascending: false }),
        supabase
          .from("kontak-messages")
          .select(
            "id,nama_sekolah,alamat,no_hp,email,instagram,facebook,youtube,tiktok"
          )
          .order("id", { ascending: false })
          .limit(1),
      ]);

      if (profilRes.error) console.error(profilRes.error);

      if (profilRes.data) {
        const p = profilRes.data;
        setNamaSekolah(p.nama_sekolah || "MTs SIRNAMISKIN");
        setAlamat(p.alamat || "");
        setTelepon(p.telepon || "");
        setEmail(p.email || "");
        setDeskripsi(p.deskripsi || "");
        setPendahuluan(p.pendahuluan || "");
        setSejarahSingkat(p.sejarah_singkat || "");
        setKurikulumStatus(p.kurikulum_status || "");
        setMataPelajaran(p.mata_pelajaran || "");
      }

      if (visiRes.data) {
        setVisi(visiRes.data.visi || "");
        setMisi(visiRes.data.misi || "");
      }

      if (fasilitasRes.data) setFasilitas(fasilitasRes.data);
      if (programRes.data) setProgramKelas(programRes.data);
      if (guruRes.data) setTenagaPengajar(guruRes.data);
      if (prestasiRes.data) setPrestasi(prestasiRes.data);
      if (lulusanRes.data) setLulusan(lulusanRes.data);
      if (ekskulRes.data) setEkstrakurikuler(ekskulRes.data);
      if (galeriRes.data) setGaleri(galeriRes.data);

      if (kontakRes.data?.[0]) {
        const k = kontakRes.data[0];
        setKontak({
          nama_sekolah: k.nama_sekolah || "",
          alamat: k.alamat || "",
          no_hp: k.no_hp || "",
          email: k.email || "",
          instagram: k.instagram || "",
          facebook: k.facebook || "",
          youtube: k.youtube || "",
          tiktok: k.tiktok || "",
        });
      }
    }

    getData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = detailOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [detailOpen]);

  function socialUrl(value: string | null, platform: string) {
    if (!value) return "#";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;

    const v = value.replace(/^@/, "");

    if (platform === "instagram") return `https://instagram.com/${v}`;
    if (platform === "facebook") return `https://facebook.com/${v}`;
    if (platform === "youtube") return `https://youtube.com/@${v}`;

    return `https://tiktok.com/@${v}`;
  }

  const totalLulusan = lulusan.reduce((a, b) => a + Number(b.jumlah), 0);
  const photos = galeri.filter((x) => x.foto_url);
  const heroImage = photos[0]?.foto_url || null;

  const nav = [
    ["Profil", "#profil"],
    ["Visi & Misi", "#visi-misi"],
    ["Fasilitas", "#fasilitas"],
    ["Program", "#program"],
    ["Guru", "#tenaga-pengajar"],
    ["Prestasi", "#prestasi"],
    ["Lulusan", "#lulusan"],
    ["Ekskul", "#ekstrakurikuler"],
    ["Berita", "#berita-kegiatan"],
    ["Kontak", "#kontak"],
  ];

  const detailTitle =
    detailOpen === "profil"
      ? "Profil & Informasi Sekolah"
      : detailOpen === "visi"
      ? "Visi & Misi"
      : detailOpen === "program"
      ? "Program Kelas"
      : detailOpen === "fasilitas"
      ? "Fasilitas Sekolah"
      : detailOpen === "prestasi"
      ? "Prestasi Siswa"
      : detailOpen === "guru"
      ? "Tenaga Pengajar"
      : detailOpen === "ekskul"
      ? "Ekstrakurikuler"
      : detailOpen === "galeri"
      ? "Berita & Kegiatan"
      : "";

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR */}
      <nav className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
              <img
                src="https://edolgydbyjiipurrscrg.supabase.co/storage/v1/object/public/profil/logo-sirnamiskin.png"
                alt="Logo MTs Sirnamiskin"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div className="text-white">
              <p className="text-base font-bold leading-tight">{namaSekolah}</p>
              <p className="text-[11px] text-white/75">Bandung</p>
            </div>
          </a>

          <div className="hidden items-center gap-5 text-xs font-medium text-white lg:flex">
            <a href="#" className="border-b-2 border-green-300 pb-1">
              Beranda
            </a>

            {nav.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="transition hover:text-green-300"
              >
                {label}
              </a>
            ))}

            <a
              href="/login-siswa"
              className="rounded-full bg-green-600 px-5 py-2.5 font-semibold shadow-lg transition hover:bg-green-500"
            >
              SPMB Online →
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl text-white backdrop-blur lg:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="mx-4 rounded-2xl bg-white p-4 shadow-2xl lg:hidden">
            <div className="flex flex-col gap-1 text-sm font-medium">
              <a
                href="#"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-2.5 hover:bg-green-50"
              >
                Beranda
              </a>

              {nav.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-2.5 hover:bg-green-50"
                >
                  {label}
                </a>
              ))}

              <a
                href="/login-siswa"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-green-600 px-5 py-3 text-center font-semibold text-white"
              >
                SPMB Online →
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-[650px] overflow-hidden bg-green-950">
        <img
          src="/foto-beranda.jpg"
          alt="MTs Sirnamiskin"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/70 to-green-950/20" />

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-6 pb-24 pt-36 md:px-10">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-green-200">
              Selamat Datang di
            </p>

            <h1 className="text-5xl font-extrabold leading-[1.05] md:text-7xl">
              {namaSekolah}
              <span className="mt-2 block text-green-300">Bandung</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/85 md:text-lg">
              Membentuk generasi berilmu, berakhlak, dan berprestasi untuk
              menghadapi masa depan.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/login-siswa"
              className="rounded-full bg-green-500 px-7 py-3.5 text-center font-bold shadow-xl transition hover:-translate-y-1 hover:bg-green-400"
            >
              SPMB ONLINE →
            </a>

              <a
                href="#profil"
                className="rounded-full border border-white/70 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-white hover:text-green-900"
              >
                KENALI KAMI
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROFIL */}
      <section id="profil" className="px-6 pb-20 pt-36 md:pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-green-100 shadow-xl">
            <img
              src="/foto-beranda.jpg"
              alt="MTs Sirnamiskin"
              className="h-[390px] w-full object-cover"
            />

            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-5 py-4 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wider text-green-600">

              </p>
              <p className="mt-1 font-bold">
            
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
              Tentang Kami
            </p>

            <h2 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Mengenal {namaSekolah}
            </h2>

            <p className="mt-5 line-clamp-4 leading-7 text-gray-600">
              {deskripsi ||
                "MTs Sirnamiskin merupakan lembaga pendidikan yang mengembangkan potensi peserta didik melalui pendidikan akademik, pembentukan karakter, serta pembinaan keagamaan."}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ["📖", "Pendahuluan", pendahuluan],
                ["🏫", "Sejarah Singkat", sejarahSingkat],
                ["🎓", "Kurikulum & Status", kurikulumStatus],
                ["📚", "Mata Pelajaran", mataPelajaran],
              ].map(([icon, title, text]) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => setDetailOpen("profil")}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:bg-white hover:shadow-md"
                >
                  <div className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                      {icon}
                    </span>

                    <div className="min-w-0">
                      <p className="font-bold">{title}</p>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                        {text || "Informasi belum tersedia."}
                      </p>

                      <p className="mt-2 text-xs font-bold text-green-700">
                        Selengkapnya →
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

     {/* VISI & MISI */}
<section id="visi-misi" className="bg-green-50 px-6 py-20">
  <div className="mx-auto max-w-7xl">
    <div className="mb-10 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-green-600">
        Visi & Misi
      </p>

      <h2 className="mt-2 text-3xl font-black text-gray-900 md:text-4xl">
        Arah dan tujuan madrasah
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
        Landasan yang menjadi pedoman MTs Sirnamiskin dalam menjalankan
        pendidikan dan membentuk generasi yang unggul.
      </p>
    </div>

    <div className="grid gap-5 md:grid-cols-2">
      {/* CARD VISI */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-xl">
            🎯
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-600">
              Visi
            </p>

            <h3 className="text-xl font-bold text-gray-900">
              Visi Sekolah
            </h3>
          </div>
        </div>

        <p className="mt-6 line-clamp-5 whitespace-pre-line leading-7 text-gray-600">
          {visi || "Data visi belum tersedia."}
        </p>

        <button
          type="button"
          onClick={() => setDetailOpen("visi")}
          className="mt-5 rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700 transition hover:bg-green-100"
        >
          Selengkapnya →
        </button>
      </div>

      {/* CARD MISI */}
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-xl">
            📋
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-600">
              Misi
            </p>

            <h3 className="text-xl font-bold text-gray-900">
              Misi Sekolah
            </h3>
          </div>
        </div>

        <p className="mt-6 line-clamp-5 whitespace-pre-line leading-7 text-gray-600">
          {misi || "Data misi belum tersedia."}
        </p>

        <button
          type="button"
          onClick={() => setDetailOpen("visi")}
          className="mt-5 rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700 transition hover:bg-green-100"
        >
          Selengkapnya →
        </button>
      </div>
    </div>
  </div>
</section>

{/* PROGRAM */}
<section id="program" className="bg-white px-6 py-20">
  <div className="mx-auto max-w-7xl">

    {/* JUDUL */}
    <div className="mb-10 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
        Program Pendidikan
      </p>

      <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
        Pilihan Kelas {namaSekolah}
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
        Beragam pilihan kelas untuk mendukung potensi, minat, dan kebutuhan
        peserta didik.
      </p>
    </div>

    {/* KELAS PILIHAN */}
    <div className="mb-12">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-8 w-2 rounded-full bg-green-600"></div>

        <h3 className="text-2xl font-extrabold text-gray-900">
          Kelas Pilihan
        </h3>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            nama: "KBP / Bina Prestasi",
            icon: "🏆",
            deskripsi:
              "Program pembinaan untuk mendukung peserta didik dalam mengembangkan potensi dan prestasi.",
          },
          {
            nama: "Fullday",
            icon: "🌟",
            deskripsi:
              "Program pembelajaran dengan kegiatan pendidikan yang lebih optimal dalam satu hari.",
          },
          {
            nama: "Reguler",
            icon: "📚",
            deskripsi:
              "Program pembelajaran reguler yang mengembangkan kemampuan akademik dan karakter peserta didik.",
          },
          {
            nama: "Boarding Class",
            icon: "🏠",
            deskripsi:
              "Program kelas dengan konsep pesantren yang memadukan pendidikan umum dan pembinaan keagamaan.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-xl">
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-green-600">
                  KELAS PILIHAN
                </p>

                <h4 className="mt-1 font-bold leading-5 text-gray-900">
                  {item.nama}
                </h4>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {item.deskripsi}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* KELAS EXCELLENT */}
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-8 w-2 rounded-full bg-emerald-600"></div>

        <h3 className="text-2xl font-extrabold text-gray-900">
          Kelas Excellent (Kelas 8)
        </h3>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            nama: "Bilingual",
            icon: "🌍",
            deskripsi:
              "Program pengembangan kemampuan bahasa dalam mendukung pembelajaran bilingual.",
          },
          {
            nama: "Coding",
            icon: "💻",
            deskripsi:
              "Pembelajaran teknologi dan pemrograman untuk mengembangkan kemampuan digital peserta didik.",
          },
          {
            nama: "Dirosah",
            icon: "📖",
            deskripsi:
              "Program pendalaman ilmu keislaman dan pembinaan keagamaan peserta didik.",
          },
          {
            nama: "Otomotif",
            icon: "🔧",
            deskripsi:
              "Pembelajaran dasar otomotif dan pengenalan teknologi kendaraan.",
          },
          {
            nama: "Sains",
            icon: "🔬",
            deskripsi:
              "Program pengembangan minat dan kemampuan peserta didik dalam bidang sains.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-xl">
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-green-600">
                  KELAS EXCELLENT
                </p>

                <h4 className="mt-1 font-bold leading-5 text-gray-900">
                  {item.nama}
                </h4>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {item.deskripsi}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>

{/* FASILITAS */}
<section id="fasilitas" className="px-6 pb-20">
  <div className="mx-auto max-w-7xl rounded-[2rem] bg-green-900 p-7 text-white shadow-xl md:p-10">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-300">
          Sarana & Prasarana
        </p>

        <h2 className="mt-2 text-3xl font-extrabold">
          Fasilitas {namaSekolah}
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-green-100/75">
          Fasilitas sekolah yang mendukung kegiatan belajar dan aktivitas
          peserta didik.
        </p>
      </div>

      <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
        {fasilitas.length} Fasilitas
      </span>
    </div>

    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {fasilitas.map((item) => (
        <details
          key={item.id}
          className="group rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:bg-white/15"
        >
          <summary className="cursor-pointer list-none">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl">
                {fasilitasIcon[item.nama_fasilitas] || "🏫"}
              </span>

              <div className="min-w-0">
                <h3 className="font-bold leading-5">
                  {item.nama_fasilitas}
                </h3>

                <p className="mt-1 line-clamp-1 text-xs text-green-100/70">
                  {item.deskripsi || "Sarana pendukung sekolah"}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-green-300">
              Lihat selengkapnya →
            </p>
          </summary>

          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-sm leading-6 text-green-100/80">
              {item.deskripsi || "Sarana pendukung sekolah"}
            </p>
          </div>
        </details>
      ))}
    </div>
  </div>
</section>

      {/* PRESTASI */}
      <section id="prestasi" className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
              Prestasi Sekolah
            </p>

            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Prestasi Siswa
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Berbagai pencapaian yang diraih oleh peserta didik{" "}
              {namaSekolah}.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {prestasi.slice(0, 6).map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-lg">
                  🏆
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                    Prestasi {String(index + 1).padStart(2, "0")}
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-6 text-gray-700">
                    {item.judul}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {prestasi.length > 6 && (
            <div className="mt-7 text-center">
              <button
                type="button"
                onClick={() => setDetailOpen("prestasi")}
                className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-green-700 shadow-sm transition hover:shadow-md"
              >
                Lihat Semua Prestasi →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* TENAGA PENGAJAR */}
      <section id="tenaga-pengajar" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
              Sumber Daya Manusia
            </p>

            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Tenaga Pengajar
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Guru dan tenaga pengajar yang mendukung kegiatan pendidikan di{" "}
              {namaSekolah}.
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="rounded-3xl border border-gray-100 bg-gray-50 px-8 py-5 text-center shadow-sm">
              <p className="text-4xl font-extrabold text-green-800">
                {tenagaPengajar.length}
              </p>

              <p className="mt-1 text-xs font-medium text-gray-500">
                Tenaga Pengajar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {tenagaPengajar.slice(0, 12).map((guru) => {
              const initials = guru.nama
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((x) => x[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={guru.id}
                  className="rounded-3xl border border-gray-100 bg-gray-50 p-5 text-center shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-sm font-extrabold text-green-800">
                    {initials}
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs font-bold leading-5 text-gray-800">
                    {guru.nama}
                  </p>
                </div>
              );
            })}
          </div>

          {tenagaPengajar.length > 12 && (
            <div className="mt-7 text-center">
              <button
                type="button"
                onClick={() => setDetailOpen("guru")}
                className="rounded-full bg-green-50 px-5 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-100"
              >
                Lihat Semua Tenaga Pengajar →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* LULUSAN */}
      <section id="lulusan" className="bg-green-50 px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.8fr_1.5fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
              Alumni
            </p>

            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Lulusan Diterima di Sekolah Negeri
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Data lulusan {namaSekolah} yang diterima di sekolah negeri.
            </p>

            <div className="mt-7 rounded-3xl bg-green-800 p-7 text-white shadow-xl">
              <p className="text-sm text-green-200">Total Lulusan</p>
              <p className="mt-1 text-5xl font-extrabold">
                {totalLulusan.toLocaleString("id-ID")}
              </p>
              <p className="mt-1 text-sm text-green-200">
                orang diterima di sekolah negeri
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lulusan.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                    🎓
                  </div>

                  <div>
                    <p className="font-bold">{item.nama_sekolah}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {Number(item.jumlah).toLocaleString("id-ID")} orang
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EKSKUL */}
      <section id="ekstrakurikuler" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
              Kegiatan Siswa
            </p>

            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Ekstrakurikuler
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Kegiatan untuk mengembangkan minat, bakat, kreativitas, dan
              karakter peserta didik.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {ekstrakurikuler.slice(0, 12).map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-gray-100 bg-gray-50 p-5 text-center shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl">
                  {ekskulIcon[item.nama_ekstrakurikuler] || "✨"}
                </div>

                <p className="mt-3 text-xs font-bold leading-5">
                  {item.nama_ekstrakurikuler}
                </p>
              </div>
            ))}
          </div>

          {ekstrakurikuler.length > 12 && (
            <div className="mt-7 text-center">
              <button
                type="button"
                onClick={() => setDetailOpen("ekskul")}
                className="rounded-full bg-green-50 px-5 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-100"
              >
                Lihat Semua Ekstrakurikuler →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* BERITA & KEGIATAN - SEMUA FOTO */}
      <section id="berita-kegiatan" className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-600">
              Informasi & Dokumentasi
            </p>

            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Berita & Kegiatan
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Dokumentasi kegiatan dan informasi terbaru dari {namaSekolah}.
            </p>
          </div>

          {galeri.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
              Belum ada berita atau kegiatan.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galeri.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-56 overflow-hidden bg-green-100">
                    {item.foto_url ? (
                      <img
                        src={item.foto_url}
                        alt={item.judul}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl">
                        🖼️
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
                        {item.kategori || "Kegiatan"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    {item.tanggal && (
                      <p className="text-xs font-medium text-gray-400">
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}

                    <h3 className="mt-2 line-clamp-2 text-base font-bold leading-6 text-gray-900">
                      {item.judul}
                    </h3>

                    {item.deskripsi && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">
                        {item.deskripsi}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => setDetailOpen("galeri")}
                      className="mt-4 border-t border-gray-100 pt-4 text-xs font-bold text-green-700"
                    >
                      Lihat dokumentasi →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

            {/* CTA SPMB */}
      <section id="spmb" className="px-6 py-16">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-green-900 px-7 py-12 text-white shadow-xl md:px-12">
          {heroImage && (
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
          )}

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-300">
                Sistem Penerimaan Murid Baru
              </p>

              <h2 className="mt-2 max-w-2xl text-3xl font-extrabold md:text-4xl">
                Siap Menjadi Bagian dari {namaSekolah}?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-green-100/80">
                Dapatkan informasi penerimaan murid baru dan kenali lebih dekat{" "}
                {namaSekolah}.
              </p>
            </div>

            <a
              href="/login-siswa"
              className="shrink-0 rounded-full bg-white px-7 py-3.5 text-center font-bold text-green-900 transition hover:bg-green-50"
            >
              INFORMASI SPMB →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="kontak" className="bg-green-950 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
                  <img
                    src="https://edolgydbyjiipurrscrg.supabase.co/storage/v1/object/public/profil/logo-sirnamiskin.png"
                    alt="Logo"
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                <div>
                  <p className="font-bold">
                    {kontak.nama_sekolah || namaSekolah}
                  </p>
                  <p className="text-xs text-green-200/70">Bandung</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-green-100/60">
                Website informasi {kontak.nama_sekolah || namaSekolah} untuk
                masyarakat dan calon peserta didik.
              </p>
            </div>

            <div>
              <h3 className="font-bold">Kontak Sekolah</h3>

              <div className="mt-4 space-y-4 text-sm text-green-100/65">
                <div>
                  <p className="font-semibold text-white">Alamat</p>
                  <p className="mt-1 leading-6">
                    {kontak.alamat ||
                      alamat ||
                      "Alamat sekolah belum tersedia."}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white">
                    WhatsApp / Telepon
                  </p>

                  {kontak.no_hp ? (
                    kontak.no_hp.split(/[,;\n]+/).map((n, i) => {
                      const v = n.trim();
                      if (!v) return null;

                      const wa = v.replace(/\D/g, "").replace(/^0/, "62");

                      return (
                        <a
                          key={i}
                          href={`https://wa.me/${wa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:text-green-300"
                        >
                          {v}
                        </a>
                      );
                    })
                  ) : (
                    <p>{telepon || "Nomor kontak belum tersedia."}</p>
                  )}
                </div>

                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p className="mt-1">
                    {kontak.email || email || "Email belum tersedia."}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Media Sosial</h3>

              <div className="mt-4 space-y-2 text-sm">
                {[
                  ["Instagram", kontak.instagram, "instagram", "IG"],
                  ["Facebook", kontak.facebook, "facebook", "F"],
                  ["YouTube", kontak.youtube, "youtube", "YT"],
                  ["TikTok", kontak.tiktok, "tiktok", "TT"],
                ].map(([label, value, platform, icon]) =>
                  value ? (
                    <a
                      key={label}
                      href={socialUrl(value, String(platform))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                        {icon}
                      </span>
                      <span className="text-green-100/70">{value}</span>
                    </a>
                  ) : null
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold">Tentang Website</h3>

              <div className="mt-4 space-y-2 text-sm text-green-100/60">
                <p>Profil Sekolah</p>
                <p>Program Pendidikan</p>
                <p>Prestasi Siswa</p>
                <p>Berita & Kegiatan</p>
                <p>Informasi SPMB</p>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-5 text-xs text-green-100/40">
            © 2026 {kontak.nama_sekolah || namaSekolah}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* DETAIL / SELENGKAPNYA MODAL */}
      {detailOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setDetailOpen(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5 md:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600">
                  Informasi {namaSekolah}
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-gray-900 md:text-2xl">
                  {detailTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setDetailOpen(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-600 transition hover:bg-green-100 hover:text-green-700"
              >
                ×
              </button>
            </div>

            <div className="max-h-[calc(90vh-100px)] overflow-y-auto px-6 py-7 md:px-8">
              {/* PROFIL DETAIL */}
              {detailOpen === "profil" && (
                <div className="space-y-6">
                  <div className="rounded-3xl bg-green-50 p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                      Deskripsi
                    </p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700">
                      {deskripsi || "Informasi belum tersedia."}
                    </p>
                  </div>

                  {[
                    ["Pendahuluan", pendahuluan, "📖"],
                    ["Sejarah Singkat", sejarahSingkat, "🏫"],
                    ["Kurikulum & Status", kurikulumStatus, "🎓"],
                    ["Mata Pelajaran", mataPelajaran, "📚"],
                  ].map(([title, text, icon]) => (
                    <div
                      key={title}
                      className="rounded-3xl border border-gray-100 bg-gray-50 p-6"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                          {icon}
                        </span>
                        <h3 className="text-lg font-bold">{title}</h3>
                      </div>

                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                        {text || "Informasi belum tersedia."}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* VISI MISI DETAIL */}
              {detailOpen === "visi" && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* VISI */}
                  <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-xl">
                        🎯
                      </span>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                          Visi
                        </p>
                        <h3 className="text-lg font-bold text-gray-900">
                          Visi Sekolah
                        </h3>
                      </div>
                    </div>

                    <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                      {visi || "Data visi belum tersedia."}
                    </p>
                  </div>

                  {/* MISI */}
                  <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-xl">
                        📋
                      </span>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                          Misi
                        </p>
                        <h3 className="text-lg font-bold text-gray-900">
                          Misi Sekolah
                        </h3>
                      </div>
                    </div>

                    <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                      {misi || "Data misi belum tersedia."}
                    </p>
                  </div>
                </div>
              )}

              {/* PROGRAM DETAIL */}
              {detailOpen === "program" && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {programKelas.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-gray-100 bg-gray-50 p-5"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-lg">
                        {["🏆", "🌟", "📚", "🏠", "🌍", "💻", "📖", "🔧", "🔬"][
                          index % 9
                        ]}
                      </div>

                      <h3 className="mt-4 font-bold">{item.nama_program}</h3>

                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-500">
                        {item.deskripsi ||
                          "Program pendidikan untuk mendukung perkembangan peserta didik."}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* FASILITAS DETAIL */}
              {detailOpen === "fasilitas" && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {fasilitas.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-gray-100 bg-gray-50 p-5"
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-xl">
                          {fasilitasIcon[item.nama_fasilitas] || "🏫"}
                        </span>

                        <div>
                          <h3 className="font-bold">{item.nama_fasilitas}</h3>
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {item.deskripsi || "Sarana pendukung sekolah."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PRESTASI DETAIL */}
              {detailOpen === "prestasi" && (
                <div className="space-y-3">
                  {prestasi.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 rounded-3xl border border-gray-100 bg-gray-50 p-5"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100">
                        🏆
                      </div>

                      <div>
                        <p className="text-xs font-bold text-green-600">
                          Prestasi {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-6 text-gray-700">
                          {item.judul}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* GURU DETAIL */}
              {detailOpen === "guru" && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {tenagaPengajar.map((guru) => {
                    const initials = guru.nama
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((x) => x[0])
                      .join("")
                      .toUpperCase();

                    return (
                      <div
                        key={guru.id}
                        className="rounded-3xl border border-gray-100 bg-gray-50 p-5 text-center"
                      >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-sm font-extrabold text-green-800">
                          {initials}
                        </div>

                        <p className="mt-3 text-xs font-bold leading-5">
                          {guru.nama}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* EKSKUL DETAIL */}
              {detailOpen === "ekskul" && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {ekstrakurikuler.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-gray-100 bg-gray-50 p-5 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl">
                        {ekskulIcon[item.nama_ekstrakurikuler] || "✨"}
                      </div>

                      <p className="mt-3 text-xs font-bold">
                        {item.nama_ekstrakurikuler}
                      </p>

                      {item.deskripsi && (
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-500">
                          {item.deskripsi}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* GALERI DETAIL */}
              {detailOpen === "galeri" && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {galeri.map((item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-3xl border border-gray-100 bg-gray-50"
                    >
                      <div className="h-52 overflow-hidden bg-green-100">
                        {item.foto_url ? (
                          <img
                            src={item.foto_url}
                            alt={item.judul}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-5xl">
                            🖼️
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          {item.kategori || "Kegiatan"}
                        </span>

                        <h3 className="mt-3 text-sm font-bold leading-6">
                          {item.judul}
                        </h3>

                        {item.tanggal && (
                          <p className="mt-2 text-xs text-gray-400">
                            {new Date(item.tanggal).toLocaleDateString(
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
                          <p className="mt-2 text-xs leading-5 text-gray-500">
                            {item.deskripsi}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
