"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    gsap.set([logoRef.current, titleRef.current, textRef.current, buttonsRef.current], {
      x: () => Math.random() * 400 - 200,
      y: () => Math.random() * 200 - 100,
      rotation: () => Math.random() * 360,
      opacity: 0,
      transformOrigin: "center center",
    });

    const tl = gsap.timeline();
    tl.to(logoRef.current, {
      duration: 1.2,
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      ease: "power3.out",
    });
    tl.to(
      titleRef.current,
      {
        duration: 1.5,
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        ease: "power3.out",
      },
      "-=0.5"
    );
    tl.to(
      textRef.current,
      {
        duration: 1,
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        ease: "power3.out",
      },
      "-=0.7"
    );
    tl.to(
      buttonsRef.current,
      {
        duration: 1,
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        ease: "power3.out",
      },
      "-=0.8"
    );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6 
                    bg-gradient-to-b from-white to-gray-100 
                    dark:from-gray-950 dark:to-gray-900">
      <Image
          ref={logoRef}
          src="/Logo Full.svg"
          alt="Cultunesia Logo"
          width={120}
          height={120}
          className="w-80 mb-6 relative z-10 drop-shadow-md"
        />

      {/* 404 */}
      <h1
        ref={titleRef}
        className="text-8xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-400 
                   bg-clip-text text-transparent drop-shadow-xl"
      >
        404
      </h1>

      {/* Deskripsi */}
      <p
        ref={textRef}
        className="mt-6 text-lg text-gray-700 dark:text-gray-300 max-w-md"
      >
        Halaman yang kamu cari tidak ditemukan.  
      </p>

      {/* Tombol Aksi */}
      <div
        ref={buttonsRef}
        className="mt-10 flex gap-6"
      >
        {/* Kembali */}
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 rounded-2xl font-medium shadow-lg border 
                     bg-yellow-500 text-white hover:bg-yellow-600 
                     transition-all duration-300 ease-in-out
                     dark:bg-yellow-600 dark:hover:bg-yellow-500"
        >
          ← Kembali
        </button>

        {/* Ke Home */}
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl font-medium shadow-lg border 
                     bg-gray-200 text-gray-900 hover:bg-gray-300
                     dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
                     transition-all duration-300 ease-in-out"
        >
          Beranda
        </Link>
      </div>
    </div>
  );
}
