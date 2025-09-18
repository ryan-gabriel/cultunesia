"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import provincesData from "@/data/provinces.json";
import regionsData from "@/data/regionBorders.json";
import islandsData from "@/data/islandBorders.json";
import countriesData from "@/data/countryBorders.json";
import otherCountriesData from "@/data/otherCountries.json";

const MapSvg = () => {
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [loading, setLoading] = useState(true);

  const svgRef = useRef(null);
  const gRefs = useRef({});
  const otherRefs = useRef({});
  const tooltipRef = useRef({});

  useEffect(() => {
    const provinceElements = Object.values(gRefs.current);
    const otherElements = Object.values(otherRefs.current);

    // Set scramble awal
    provinceElements.forEach((el) => {
      gsap.set(el, {
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 1000 - 500,
        rotation: Math.random() * 360,
        opacity: 0,
        transformOrigin: "center center",
      });
    });

    gsap.set(otherElements, { opacity: 0 });

    // Tampilkan SVG (tidak ada flash karena opacity:0)
    gsap.set(svgRef.current, { opacity: 1 });

    // Timeline animasi
    const timeline = gsap.timeline();
    timeline.to(provinceElements, {
      duration: 1.5,
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      stagger: 0.05,
      ease: "power3.out",
    });
    timeline.to(
      otherElements,
      {
        duration: 0.5,
        opacity: 1,
        stagger: 0.02,
        ease: "power1.inOut",
        onComplete: () => setLoading(false),
      },
      "+=0.1"
    );
  }, []);

  return (
    <div className="relative w-full h-fit">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        id="map-indonesia"
        width="1875.5"
        height="860.859"
        viewBox="0 0 1875.5 860.859"
        className="w-full h-fit"
        style={{ opacity: 0 }} // langsung tersembunyi sebelum animasi
      >
        {/* Other Countries */}
        {otherCountriesData.map((country) => (
          <path
            key={country.id}
            ref={(el) => (otherRefs.current[country.id] = el)}
            id={country.id}
            fill="#D3D3D3"
            stroke="#898989"
            d={country.d}
          />
        ))}

        {/* Provinces */}
        {provincesData.map((province) => (
          <g
            key={province.id}
            ref={(el) => (gRefs.current[province.id] = el)}
            className={`province ${province.id}`}
            onMouseEnter={(e) =>
              setHoveredProvince({
                id: province.id,
                name: province.name,
                description: province.description || "Deskripsi singkat",
                x: e.clientX,
                y: e.clientY,
              })
            }
            onMouseMove={(e) =>
              setHoveredProvince((prev) =>
                prev ? { ...prev, x: e.clientX, y: e.clientY } : prev
              )
            }
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => alert(`Klik provinsi: ${province.name}`)}
            style={{ transformOrigin: "center center", cursor: "pointer" }}
          >
            {province.paths.map((d, idx) => (
              <path
                key={idx}
                d={d}
                fill="#F5BD02"
                style={{
                  transition: "fill 0.5s, opacity 0.5s",
                  opacity:
                    !loading && hoveredProvince && hoveredProvince.id !== province.id
                      ? 0.3
                      : 1,
                }}
              />
            ))}
          </g>
        ))}

        {/* Region Borders */}
        {regionsData.map((region) => (
          <path
            key={region.id}
            ref={(el) => (otherRefs.current[region.id] = el)}
            id={region.id}
            fill="none"
            stroke="#D3D3D3"
            d={region.d}
          />
        ))}

        {/* Islands */}
        {islandsData.map((island) => (
          <path
            key={island.id}
            ref={(el) => (otherRefs.current[island.id] = el)}
            id={island.id}
            fill="none"
            stroke={island.stroke}
            d={island.d}
          />
        ))}

        {/* Countries */}
        {countriesData.map((country) => (
          <path
            key={country.id}
            ref={(el) => (otherRefs.current[country.id] = el)}
            id={country.id}
            fill="none"
            stroke={country.stroke}
            strokeWidth={country.strokeWidth}
            d={country.d}
          />
        ))}
      </svg>

      {/* Tooltip */}
    {!loading && hoveredProvince && (
  <div
    ref={tooltipRef}
    className={`
      fixed pointer-events-none z-50 px-3 py-2 rounded-xl shadow-xl border 
      transition-all duration-200 transform
      bg-white text-gray-900 
      dark:bg-gray-900 dark:text-white dark:border-gray-700
    `}
    style={{
      left: Math.min(
        hoveredProvince.x + 20,
        window.innerWidth - 180 // lebar tooltip max
      ),
      top: Math.min(
        hoveredProvince.y + 20,
        window.innerHeight - 80 // tinggi tooltip max
      ),
    }}
  >
    <h3 className="font-semibold text-sm">{hoveredProvince.name}</h3>
  </div>
)}

    </div>
  );
};

export default MapSvg;