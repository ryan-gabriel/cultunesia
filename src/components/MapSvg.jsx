// File: components/MapSvg.jsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import provincesData from "@/data/provinces.json";
import regionsData from "@/data/regionBorders.json";
import islandsData from "@/data/islandBorders.json";
import countriesData from "@/data/countryBorders.json";
import otherCountriesData from "@/data/otherCountries.json";

const MapSvg = ({ provincesFromDB }) => {
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [loading, setLoading] = useState(true);

  const svgRef = useRef(null);
  const gRefs = useRef({});
  const otherRefs = useRef({});
  const tooltipRef = useRef({});

  useEffect(() => {
    // ... (kode animasi GSAP Anda tetap sama)
    const provinceElements = Object.values(gRefs.current);
    const otherElements = Object.values(otherRefs.current);

    provinceElements.forEach((el) => {
      gsap.set(el, { x: Math.random() * 2000 - 1000, y: Math.random() * 1000 - 500, rotation: Math.random() * 360, opacity: 0, transformOrigin: "center center"});
    });
    gsap.set(otherElements, { opacity: 0 });
    gsap.set(svgRef.current, { opacity: 1 });
    const timeline = gsap.timeline();
    timeline.to(provinceElements, { duration: 1.5, x: 0, y: 0, rotation: 0, opacity: 1, stagger: 0.05, ease: "power3.out" });
    timeline.to(otherElements, { duration: 0.5, opacity: 1, stagger: 0.02, ease: "power1.inOut", onComplete: () => setLoading(false) }, "+=0.1");
  }, []);

  const handleMouseEnter = (e, provinceFromJSON) => {
    // PERBAIKAN: Tambahkan pengecekan ini untuk memastikan 'provincesFromDB' adalah array
    if (!provincesFromDB || !Array.isArray(provincesFromDB)) {
      console.warn("Data provinsi (provincesFromDB) tidak tersedia atau bukan array.");
      return; // Hentikan eksekusi fungsi jika data tidak valid
    }

    const dbData = provincesFromDB.find(p => p.slug === provinceFromJSON.id);
    
    setHoveredProvince({
      id: provinceFromJSON.id,
      name: provinceFromJSON.name,
      description: dbData?.description || "Deskripsi tidak tersedia.",
      population: dbData?.population || 0,
      slug: dbData?.slug,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    setHoveredProvince(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev);
  };

  const handleMouseLeave = () => {
    setHoveredProvince(null);
  };

  return (
    <div className="relative w-full h-fit">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        id="map-indonesia"
        viewBox="0 0 1875.5 860.859"
        className="w-full h-fit"
        style={{ opacity: 0 }}
      >
        {/* Other Countries & Borders */}
        {otherCountriesData.map((country) => <path key={country.id} ref={(el) => (otherRefs.current[country.id] = el)} id={country.id} fill="#D3D3D3" stroke="#898989" d={country.d} />)}
        {regionsData.map((region) => <path key={region.id} ref={(el) => (otherRefs.current[region.id] = el)} id={region.id} fill="none" stroke="#D3D3D3" d={region.d} />)}
        {islandsData.map((island) => <path key={island.id} ref={(el) => (otherRefs.current[island.id] = el)} id={island.id} fill="none" stroke={island.stroke} d={island.d} />)}
        {countriesData.map((country) => <path key={country.id} ref={(el) => (otherRefs.current[country.id] = el)} id={country.id} fill="none" stroke={country.stroke} strokeWidth={country.strokeWidth} d={country.d} />)}

        {/* Provinces */}
        {provincesData.map((province) => (
          <g
            key={province.id}
            ref={(el) => (gRefs.current[province.id] = el)}
            id={province.id}
            className={`province ${province.id}`}
            onMouseEnter={(e) => handleMouseEnter(e, province)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformOrigin: "center center", cursor: "pointer" }}
          >
            {province.paths.map((d, idx) => (
              <path
                key={idx}
                d={d}
                fill="#F5BD02"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                style={{
                  transition: "fill 0.3s, opacity 0.3s",
                  opacity: !loading && hoveredProvince && hoveredProvince.id !== province.id ? 0.4 : 1,
                }}
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {!loading && hoveredProvince && (
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none z-50 p-4 rounded-xl shadow-xl border w-64 bg-white text-gray-900"
          style={{
            left: Math.min(hoveredProvince.x + 20, window.innerWidth - 270),
            top: hoveredProvince.y + 20,
          }}
        >
          <h3 className="font-bold text-lg">{hoveredProvince.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">
            {hoveredProvince.description}
          </p>
          <p className="text-xs text-gray-500 mt-3">
            <strong>Populasi:</strong> {new Intl.NumberFormat('id-ID').format(hoveredProvince.population)}
          </p>
          {hoveredProvince.slug && (
            <Link href={`/province/${hoveredProvince.slug}`}>
              <a className="block text-center w-full mt-4 px-3 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors">
                Jelajahi
              </a>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSvg;