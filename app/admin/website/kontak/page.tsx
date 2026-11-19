"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

type Kontak = {
  id: number;
  nama_sekolah: string;
  alamat: string;
  no_hp: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
};

export default function KontakPage() {
  const router = useRouter();

  const [data, setData] = useState<Kontak | null>(null);

  const [namaSekolah, setNamaSekolah] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");

  const [loading, setLoading] = useState(false);

  // Mengambil data kontak
  const fetchKontak = async () => {
    const { data, error } = await supabase
      .from("kontak-messages")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      alert("Gagal mengambil data: " + error.message);
      return;
    }

    if (data) {
      setData(data);
      setNamaSekolah(data.nama_sekolah || "");
      setAlamat(data.alamat || "");
      setNoHp(data.no_hp || "");
      setEmail(data.email || "");
      setInstagram(data.instagram || "");
      setFacebook(data.facebook || "");
      setYoutube(data.youtube || "");
      setTiktok(data.tiktok || "");
    }
  };

  useEffect(() => {
    fetchKontak();
  }, []);

  // Simpan data kontak
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const dataKontak = {
        nama_sekolah: namaSekolah,
        alamat,
        no_hp: noHp,
        email,
        instagram,
        facebook,
        youtube,
        tiktok,
      };

      if (data) {
        const { error } = await supabase
          .from("kontak-messages")
          .update(dataKontak)
          .eq("id", data.id);

        if (error) throw error;

        alert("Data kontak berhasil diperbarui!");
      } else {
        const { error } = await supabase
          .from("kontak-messages")
          .insert([dataKontak]);

        if (error) throw error;

        alert("Data kontak berhasil disimpan!");
      }

      // Setelah berhasil disimpan, kembali ke menu Website
      router.push("/admin/website");

    } catch (error: any) {
      alert("Gagal menyimpan data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Kontak & Media Sosial
            </h1>

            <p className="text-gray-600 mt-1">
              Kelola informasi kontak MTs Sirnamiskin
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/website")}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            ← Kembali
          </button>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow-md p-6">

          <h2 className="text-xl font-bold text-green-800 mb-5">
            Informasi Sekolah
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAMA SEKOLAH */}
            <div>
              <label className="block font-semibold mb-1">
                Nama Sekolah
              </label>

              <input
                type="text"
                value={namaSekolah}
                onChange={(e) => setNamaSekolah(e.target.value)}
                placeholder="MTs Sirnamiskin"
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* ALAMAT */}
            <div>
              <label className="block font-semibold mb-1">
                Alamat
              </label>

              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Masukkan alamat sekolah"
                rows={3}
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* NO HP */}
            <div>
              <label className="block font-semibold mb-1">
                No. HP / WhatsApp
              </label>

              <input
                type="text"
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block font-semibold mb-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@sekolah.sch.id"
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* MEDIA SOSIAL */}
            <div className="border-t pt-5 mt-5">

              <h2 className="text-xl font-bold text-green-800 mb-4">
                Media Sosial
              </h2>

              <div className="space-y-4">

                {/* INSTAGRAM */}
                <div>
                  <label className="block font-semibold mb-1">
                    Instagram
                  </label>

                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* FACEBOOK */}
                <div>
                  <label className="block font-semibold mb-1">
                    Facebook
                  </label>

                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* YOUTUBE */}
                <div>
                  <label className="block font-semibold mb-1">
                    YouTube
                  </label>

                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* TIKTOK */}
                <div>
                  <label className="block font-semibold mb-1">
                    TikTok
                  </label>

                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="https://tiktok.com/@..."
                    className="w-full border rounded-lg p-3"
                  />
                </div>

              </div>
            </div>

            {/* TOMBOL SIMPAN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading
                ? "Menyimpan..."
                : "Simpan Informasi Kontak"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}