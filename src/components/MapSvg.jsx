// File: components/MapSvg.jsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import provincesData from "@/data/provinces.json";
import regionsData from "@/data/regionBorders.json";
import islandsData from "@/data/islandBorders.json";
import countriesData from "@/data/countryBorders.json";
import otherCountriesData from "@/data/otherCountries.json";
import Link from "next/link";

const MapSvg = ({ provincesFromDB = [] }) => {
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [loading, setLoading] = useState(true);

  const svgRef = useRef(null);
  const gRefs = useRef({});
  const otherRefs = useRef({});
  const tooltipRef = useRef({});

  useEffect(() => {
    // GSAP Animation
    const provinceElements = Object.values(gRefs.current);
    const otherElements = Object.values(otherRefs.current);

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
    gsap.set(svgRef.current, { opacity: 1 });

    const timeline = gsap.timeline();
    timeline.to(provinceElements, {
      duration: 1,
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      stagger: 0.03,
      ease: "power3.out",
    });

    timeline.to(
      otherElements,
      {
        duration: 0.3,
        opacity: 1,
        stagger: 0.02,
        ease: "power1.inOut",
        onComplete: () => {
          console.log("Animation completed, loading set to false");
          setLoading(false);
        },
      },
      "+=0.1"
    );
  }, []);

  const handleMouseEnter = (e, provinceFromJSON) => {
    console.log("Mouse entered province:", provinceFromJSON.name);
    console.log("provincesFromDB:", provincesFromDB);

    // Check if provincesFromDB is valid
    if (!provincesFromDB || !Array.isArray(provincesFromDB)) {
      console.warn(
        "Data provinsi (provincesFromDB) tidak tersedia atau bukan array."
      );
      // Still show tooltip with basic info from JSON
      setHoveredProvince({
        slug: provinceFromJSON.slug,
        name: provinceFromJSON.name,
        description: "Deskripsi tidak tersedia.",
        population: 0,
        x: e.clientX,
        y: e.clientY,
      });
      return;
    }

    const dbData = provincesFromDB.find((p) => p.slug === provinceFromJSON.id);
    console.log("Found DB data:", dbData);

    setHoveredProvince({
      slug: provinceFromJSON.slug,
      name: provinceFromJSON.name,
      description: dbData?.description || "Deskripsi tidak tersedia.",
      population: dbData?.population || 0,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (hoveredProvince) {
      setHoveredProvince((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    }
  };

  const handleMouseLeave = () => {
    console.log("Mouse left province");
    setHoveredProvince(null);
  };

  // Debug logging
  useEffect(() => {
    console.log(
      "Component state - loading:",
      loading,
      "hoveredProvince:",
      hoveredProvince
    );
  }, [loading, hoveredProvince]);

  return (
    <div className="relative w-full h-fit dark:bg-gray-900">
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
        {otherCountriesData?.map((country) => (
          <path
            key={country.id}
            ref={(el) => (otherRefs.current[country.id] = el)}
            id={country.id}
            fill="#D3D3D3"
            stroke="#898989"
            d={country.d}
          />
        ))}

        {regionsData?.map((region) => (
          <path
            key={region.id}
            ref={(el) => (otherRefs.current[region.id] = el)}
            id={region.id}
            fill="none"
            stroke="#D3D3D3"
            d={region.d}
          />
        ))}

        {islandsData?.map((island) => (
          <path
            key={island.id}
            ref={(el) => (otherRefs.current[island.id] = el)}
            id={island.id}
            fill="none"
            stroke={island.stroke}
            d={island.d}
          />
        ))}

        {countriesData?.map((country) => (
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

        {/* Provinces */}
        {provincesData?.map((province) => (
          <Link key={province.slug} href={`/${province.slug}`} passHref>
            <g
              ref={(el) => (gRefs.current[province.slug] = el)}
              id={province.slug}
              className={`province ${province.slug}`}
              onMouseEnter={(e) => handleMouseEnter(e, province)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transformOrigin: "center center",
                cursor: "pointer",
                pointerEvents: "all",
              }}
            >
              {province.paths?.map((d, idx) => (
                <path
                  key={idx}
                  d={d}
                  fill="#F5BD02"
                  stroke="none"
                  strokeWidth="2"
                  style={{
                    transition: "fill 0.3s, opacity 0.3s",
                    opacity:
                      !loading &&
                      hoveredProvince &&
                      hoveredProvince.slug !== province.slug
                        ? 0.4
                        : 1,
                    pointerEvents: "all",
                  }}
                />
              ))}
            </g>
          </Link>
        ))}
      </svg>

      {/* Tooltip */}
      
      {!loading && hoveredProvince && (
        <div
          ref={tooltipRef}
          className="fixed pointer-events-none z-50 p-4 rounded-xl shadow-xl border w-64 bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
          style={{
            // Cek apakah mouse ada di sebelah kanan layar
            left:
              hoveredProvince.x > window.innerWidth / 2
                ? hoveredProvince.x - 280 // tampil ke kiri cursor
                : hoveredProvince.x + 20, // tampil ke kanan cursor

            // Cek apakah mouse ada di bagian bawah layar
            top:
              hoveredProvince.y > window.innerHeight / 2
                ? hoveredProvince.y - 150 // tampil ke atas cursor
                : hoveredProvince.y + 10, // tampil ke bawah cursor
          }}
        >
          <h3 className="font-bold text-lg">{hoveredProvince.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">
            {hoveredProvince.description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            <strong>Populasi:</strong>{" "}
            {new Intl.NumberFormat("id-ID").format(hoveredProvince.population)}
          </p>
        </div>
      )}

    </div>
  );
};

export default MapSvg;
