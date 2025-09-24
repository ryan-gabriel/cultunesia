// File: components/MapView.jsx

"use client";

import React, { useState } from 'react';
// Link tidak lagi dibutuhkan di sini jika tombol kembali dihapus
// import Link from 'next/link'; 
import MapSvg from "@/components/MapSvg";
import ProvinceTooltip from '@/components/ProvinceTooltip';

// Ikon ArrowLeftIcon tidak lagi digunakan
// const ArrowLeftIcon = (props) => ( ... );

export default function MapView({ provinces }) {
  const [hoveredProvince, setHoveredProvince] = useState(null);

  // Menampilkan pesan loading jika data belum siap
  if (!provinces) {
    return <div className="flex items-center justify-center h-screen">Memuat data peta...</div>;
  }

  return (
    <main className="min-h-screen w-full bg-white relative flex items-center justify-center p-4 sm:p-6 md:p-8">
      
      {/* Tombol Kembali ke Beranda telah dihapus dari sini */}
      
      {/* Kontainer Peta dan Tooltip */}
      <div className="relative w-full max-w-7xl h-[85vh] flex items-center justify-center">
        <div className="w-full h-full bg-gray-50 rounded-2xl border border-gray-200 shadow-inner overflow-hidden">
          <MapSvg 
            provincesFromDB={provinces} 
            onProvinceHover={setHoveredProvince} 
          />
        </div>
        
        <ProvinceTooltip province={hoveredProvince} />
      </div>
    </main>
  );
}