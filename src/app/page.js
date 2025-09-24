// File: app/page.jsx

"use client";

import Image from 'next/image';
import Link from 'next/link'; // Ditambahkan untuk tombol eksplorasi
import { createClient } from '@supabase/supabase-js';
import { useRouter } from "next/navigation";
import MapSvg from "@/components/MapSvg";

// --- Ikon untuk Kartu Fitur (disederhanakan untuk contoh ini) ---
const EthnicIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> );
const TourismIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );
const ClothingIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> );


export default function Home() {
  const router = useRouter();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  const features = [
    { title: "Eksplorasi Budaya", desc: "Kenali keragaman suku, bahasa, dan tradisi dari seluruh penjuru negeri.", icon: <EthnicIcon /> },
    { title: "Destinasi Wisata", desc: "Temukan rekomendasi tempat wisata budaya yang sarat akan sejarah dan keindahan.", icon: <TourismIcon /> },
    { title: "Pakaian Adat", desc: "Lihat galeri visual pakaian adat yang megah dan penuh makna dari berbagai daerah.", icon: <ClothingIcon /> }
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <button
        onClick={handleSignOut}
        className="absolute top-6 right-6 z-10 px-4 py-2 text-sm font-semibold text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
      >
        Sign Out
      </button>

      <main className="w-full">
        {/* Bagian Judul Halaman */}
        <section className="text-center pt-20 pb-12 px-6">
          <Image
            src="/Logo Short.svg"
            alt="Cultunesia Logo"
            width={64}
            height={64}
            className="mx-auto mb-5"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Jelajahi Kekayaan Budaya <span className="text-yellow-600">Indonesia</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih sebuah provinsi pada peta interaktif di bawah untuk memulai petualangan budaya Anda.
          </p>
        </section>

        {/* Bagian Peta Interaktif - Ukuran Diperbesar */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-full h-full overflow-hidden">
              <MapSvg />
            </div>
          </div>
        </section>

        {/* Elemen Singkat dari Halaman Cultunesia */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Apa yang Anda Temukan di Cultunesia?</h2>
              <p className="mt-3 text-gray-600">Platform digital untuk memperkenalkan, melestarikan, dan menginspirasi budaya nusantara.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((item, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                  <div className="text-yellow-600 bg-yellow-100 p-3 rounded-lg w-min mx-auto">
                      {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mt-4 text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              {/* === PERUBAHAN DI SINI === */}
              <Link
                href="/about"
                className="px-8 py-3 font-semibold rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-all"
              >
                Lihat Selengkapnya
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}