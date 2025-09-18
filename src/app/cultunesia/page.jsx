import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full flex items-center justify-center">
        <img
          src="/hero-bg.jpg" // ganti dengan gambar background hero Cultunesia
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow">
            Cultunesia
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
            Platform digital untuk memperkenalkan, melestarikan, dan menginspirasi
            masyarakat melalui kekayaan budaya Indonesia. Eksplorasi karya, tradisi,
            dan cerita budaya nusantara dengan tampilan modern namun elegan.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
              Mulai Eksplorasi
            </button>
            <button className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-200 transition">
              Tentang Kami
            </button>
          </div>
        </div>
      </div>

      {/* Fitur Utama */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-center text-2xl font-semibold text-yellow-600 mb-3">
          Fitur Utama
        </h2>
        <h3 className="text-center text-3xl font-bold mb-12">
          Semua yang Anda butuhkan untuk{" "}
          <span className="text-yellow-600">Budaya Nusantara</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Eksplorasi Budaya",
              desc: "Kenali keragaman budaya Indonesia dari Sabang sampai Merauke.",
            },
            {
              title: "Karya & Tradisi",
              desc: "Ruang untuk seni, musik, dan tradisi lokal.",
            },
            {
              title: "Cerita Nusantara",
              desc: "Kumpulan kisah inspiratif dari berbagai daerah.",
            },
            {
              title: "Tur Virtual",
              desc: "Pengalaman imersif menjelajah destinasi budaya.",
            },
            {
              title: "Koleksi Visual",
              desc: "Dokumentasi foto, lukisan, dan karya seni.",
            },
            {
              title: "Komunitas",
              desc: "Terhubung dengan komunitas pecinta budaya.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 p-6 rounded-xl border border-yellow-500 hover:bg-yellow-50 hover:shadow-lg transition"
            >
              <h4 className="text-lg font-semibold mb-3 text-gray-900">
                {item.title}
              </h4>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Komponen inti & Misi */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Komponen inti */}
        <div className="bg-gray-50 p-8 rounded-xl border border-yellow-500">
          <h3 className="text-yellow-600 text-sm uppercase mb-2">
            Arsitektur Produk
          </h3>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Komponen Inti
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Eksplorasi",
              "Tradisi",
              "Karya",
              "Cerita",
              "Tur Virtual",
              "Komunitas",
            ].map((comp, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 p-3 rounded-lg text-center text-sm text-gray-800 hover:border-yellow-500 hover:text-yellow-600 transition"
              >
                {comp}
              </div>
            ))}
          </div>
        </div>

        {/* Misi */}
        <div className="bg-white p-8 rounded-xl shadow">
          <h3 className="text-yellow-600 text-sm uppercase mb-2">Misi</h3>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Pelestarian Budaya lewat Teknologi
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Cultunesia menghubungkan pembelajaran, arsip budaya, dan media
            kreatif agar lebih dekat dengan generasi muda.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Materi ringkas dan mudah diakses</li>
            <li>Merayakan keragaman budaya lokal</li>
            <li>Kolaborasi terbuka dengan komunitas</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-yellow-600 text-center text-white py-6 text-sm">
        © 2025 Cultunesia — Menjaga Warisan, Menginspirasi Masa Depan.
      </footer>
    </div>
  );
};

export default AboutPage;
