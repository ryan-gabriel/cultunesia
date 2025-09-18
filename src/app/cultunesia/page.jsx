import React from "react";

const articles = [
  {
    category: "Profil",
    date: "18/9/2025",
    title: "Tentang Cultunesia",
    desc: "Platform interaktif yang menghadirkan kekayaan budaya Indonesia dalam bentuk modern.",
    image: "/about/cultunesia1.jpg",
  },
  {
    category: "Visi",
    date: "18/9/2025",
    title: "Visi & Misi",
    desc: "Menjadikan budaya Indonesia lebih dekat dengan generasi muda melalui inovasi digital.",
    image: "/about/cultunesia2.jpg",
  },
  {
    category: "Tim",
    date: "18/9/2025",
    title: "Tim Pengembang",
    desc: "Dibangun oleh tim kreatif yang berfokus pada teknologi, seni, dan interaktivitas.",
    image: "/about/cultunesia3.jpg",
  },
];

const AboutCultunesia = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Headpage / Hero */}
      <div className="relative w-full h-64 md:h-80 lg:h-96">
        <img
          src="/banner.jpg" // taruh gambar banner di /public/banner.jpg
          alt="Cultunesia Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <img
            src="/Logo Short.svg"
            alt="Cultunesia Logo"
            className="w-28 md:w-36 lg:w-44 drop-shadow-lg"
          />
        </div>
      </div>

      {/* Header text */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang Cultunesia</h1>
        <p className="text-gray-600 max-w-3xl">
          Cultunesia adalah platform digital yang menggabungkan kekayaan budaya
          Indonesia dengan teknologi modern. Kami berkomitmen menghadirkan
          pengalaman interaktif yang elegan, minimalis, dan mudah diakses semua
          orang.
        </p>
      </div>

      {/* Artikel style layout */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover transform hover:scale-105 transition duration-500"
            />
            <div className="p-5">
              <p className="text-yellow-600 text-sm font-semibold uppercase">
                {item.category} <span className="text-gray-400">| {item.date}</span>
              </p>
              <h2 className="text-lg font-bold mt-2 mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Banner tambahan */}
      <div className="max-w-6xl mx-auto mt-16 px-6">
        <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-700 text-white rounded-xl p-10 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">
            Budaya Indonesia, Hadir di Ujung Jari
          </h2>
          <p className="text-white/90 max-w-2xl">
            Kami percaya bahwa teknologi dapat menjadi jembatan untuk
            memperkenalkan budaya Indonesia ke seluruh dunia dengan cara yang
            modern, interaktif, dan berkesan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutCultunesia;
