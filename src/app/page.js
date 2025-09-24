// File: app/page.jsx

"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import MapSvg from "@/components/MapSvg";

// --- Komponen Ikon Sederhana ---
const ArrowLeftIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);
const PlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const MinusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);
const ArrowPathIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.185m-7.5 0v-4.992m0 0h-4.992M9.75 19.644v-4.992m0 0h-4.992m4.992 0l-3.182 3.182a8.25 8.25 0 01-11.664 0l-3.18-3.185m7.5 0v-4.992" />
  </svg>
);


export default function Home() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    mapRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    mapRef.current.style.cursor = 'grab';
  };

  useEffect(() => {
    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => mapElement.removeEventListener('wheel', handleWheel);
    }
  }, []);


  return (
    <main className="min-h-screen w-full bg-white relative flex items-center justify-center p-4 sm:p-6 md:p-8">
      
      {/* Tombol Navigasi Kembali - GAYA DIUBAH */}
      <Link 
        href="" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-lg shadow-md hover:bg-yellow-700 transition-colors"
      >
        <span>tombol bebas</span>
      </Link>
      
      {/* Kontrol Zoom - GAYA DIUBAH */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="p-2 text-white bg-yellow-600 rounded-lg shadow-md hover:bg-yellow-700 transition-colors"><PlusIcon className="h-5 w-5" /></button>
        <button onClick={handleZoomOut} className="p-2 text-white bg-yellow-600 rounded-lg shadow-md hover:bg-yellow-700 transition-colors"><MinusIcon className="h-5 w-5" /></button>
        <button onClick={handleReset} className="p-2 text-white bg-yellow-600 rounded-lg shadow-md hover:bg-yellow-700 transition-colors"><ArrowPathIcon className="h-5 w-5" /></button>
      </div>

      {/* Kontainer Peta */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-50 rounded-2xl border border-gray-200 shadow-inner overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="w-full h-full transition-transform duration-200 ease-out"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          <MapSvg />
        </div>
      </div>
    </main>
  );
}