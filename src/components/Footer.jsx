"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Data untuk tautan footer (Bagian 'legal' telah dihapus)
const footerLinks = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Cultunesia", href: "/cultunesia" },
    { label: "Blog", href: "/blogs" },
    { label: "Quiz", href: "/quizzes" },
    { label: "Leaderboard", href: "/leaderboard" },
  ],
  services: [
    { label: "Provinces", href: "/provinces" },
    { label: "Chatbot AI", href: "/chatbot" },
    { label: "Map", href: "/" },
    { label: "About Us", href: "/about" }, // Memindahkan About Us ke sini
  ],
};

const Footer = () => {
  return (
    <motion.footer
      className="w-full bg-gradient-to-t from-gray-50/95 via-gray-50/90 to-transparent dark:from-gray-950/95 dark:via-gray-950/90 dark:to-transparent backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pt-16 mt-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        {/* Mengubah tata letak grid menjadi 3 kolom utama di desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10 md:gap-12 pb-12">
          {/* Col 1: Logo & Description (Menggunakan 2 kolom di desktop/tablet) */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <img
                src="/Logo Full.svg"
                alt="Cultunesia Logo"
                className="w-48 drop-shadow-md"
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              <strong className="font-semibold text-gray-800 dark:text-white">
                Cultunesia
              </strong>{" "}
              adalah portal edukasi dan eksplorasi budaya Indonesia yang
              komprehensif. Kami menyajikan kuis interaktif, artikel mendalam,
              informasi provinsi, dan chatbot AI untuk memudahkan Anda
              mempelajari keanekaragaman budaya nusantara.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4 border-b border-amber-400/50 pb-2 inline-block">
              Tautan Cepat
            </h4>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-500 transition duration-200 relative group before:content-[''] before:absolute before:w-1 before:h-1 before:rounded-full before:bg-amber-500 before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:opacity-0 group-hover:before:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services & Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4 border-b border-amber-400/50 pb-2 inline-block">
              Eksplorasi & Info
            </h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-500 transition duration-200 relative group before:content-[''] before:absolute before:w-1 before:h-1 before:rounded-full before:bg-amber-500 before:left-[-12px] before:top-1/2 before:-translate-y-1/2 before:opacity-0 group-hover:before:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright (Tidak ada perubahan) */}
        <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-6 pb-8 flex justify-center items-center">
          <p className="text-sm text-gray-500 dark:text-gray-500 order-2 md:order-1 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Cultunesia. All rights reserved.
            Made with <span className="text-red-500">&hearts;</span> for
            Indonesian Culture.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
