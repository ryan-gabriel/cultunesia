import React from "react";

const Footer = () => {
  return (
    <footer className="w-full mt-20 border-t border-black/10 dark:border-white/10 text-black dark:text-white overflow-hidden">
      <div className="absolute w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-28 py-10 -z-50">
        <img
          src="https://aksara-batak.sgp1.cdn.digitaloceanspaces.com/design/logo-white-notext.svg"
          alt="Aksaranta Logo"
          className="opacity-20 max-w-[100vw] dark:invert-0 invert"
        />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-28 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <a href="/" className="text-2xl font-title">
              aksaranta
            </a>
            <p className="text-black/70 dark:text-white/70 text-sm font-sans max-w-sm">
              Jelajahi budaya, aksara, dan sejarah Batak dalam satu tempat.
              Belajar interaktif, artikel, dan tur virtual.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-black/50 dark:text-white/50 text-sm tracking-wide mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/learn"
                  className="hover:text-red-400 transition-colors"
                >
                  Learn
                </a>
              </li>
              <li>
                <a
                  href="/culture"
                  className="hover:text-red-400 transition-colors"
                >
                  Culture
                </a>
              </li>
              <li>
                <a
                  href="/history"
                  className="hover:text-red-400 transition-colors"
                >
                  History
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-red-400 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/game"
                  className="hover:text-red-400 transition-colors"
                >
                  Game
                </a>
              </li>
            </ul>
          </div>

          {/* Kamus & Tools */}
          <div>
            <h4 className="text-black/50 dark:text-white/50 text-sm tracking-wide mb-3">
              Kamus & Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/kamus"
                  className="hover:text-red-400 transition-colors"
                >
                  Kamus
                </a>
              </li>
              <li>
                <a
                  href="/kamus-aksara"
                  className="hover:text-red-400 transition-colors"
                >
                  Kamus Aksara
                </a>
              </li>
              <li>
                <a
                  href="/batak-songs"
                  className="hover:text-red-400 transition-colors"
                >
                  Songs
                </a>
              </li>
              <li>
                <a
                  href="/aksara-translator"
                  className="hover:text-red-400 transition-colors"
                >
                  Aksara Translator
                </a>
              </li>
            </ul>
          </div>

          {/* Virtual & More */}
          <div>
            <h4 className="text-black/50 dark:text-white/50 text-sm tracking-wide mb-3">
              Virtual & More
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/virtual"
                  className="hover:text-red-400 transition-colors"
                >
                  Virtual Tour
                </a>
              </li>
              <li className="pt-1 text-white/50 text-xs uppercase tracking-wide">
                Destinations
              </li>
              <li>
                <a
                  href="/virtual/bukit-holbung"
                  className="hover:text-red-400 transition-colors"
                >
                  Bukit Holbung
                </a>
              </li>
              <li>
                <a
                  href="/virtual/air-terjun-piso"
                  className="hover:text-red-400 transition-colors"
                >
                  Air Terjun Sipiso-piso
                </a>
              </li>
              <li>
                <a
                  href="/virtual/danau-toba"
                  className="hover:text-red-400 transition-colors"
                >
                  Danau Toba
                </a>
              </li>
              <li>
                <a
                  href="/virtual/sibeabea"
                  className="hover:text-red-400 transition-colors"
                >
                  Sibea-bea
                </a>
              </li>
              <li>
                <a
                  href="/virtual/taman-alam-lubini"
                  className="hover:text-red-400 transition-colors"
                >
                  Taman Alam Lumbini
                </a>
              </li>
              <li>
                <a
                  href="/virtual/arrasyid"
                  className="hover:text-red-400 transition-colors"
                >
                  Arrasyiid
                </a>
              </li>
              <li>
                <a
                  href="/virtual/graha-bunda"
                  className="hover:text-red-400 transition-colors"
                >
                  Graha Bunda
                </a>
              </li>
              <li>
                <a
                  href="/virtual/funland"
                  className="hover:text-red-400 transition-colors"
                >
                  Mikie Funland
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-black/10 dark:border-white/10" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-black/60 dark:text-white/60 text-xs">
            © 2025 Aksaranta. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-black/60 dark:text-white/60">
            <a className="hover:text-red-400 transition-colors scroll-smooth">
              Kembali ke atas
            </a>
            <span className="opacity-30">•</span>
            <a href="#credits" className="hover:text-red-400 transition-colors">
              Credits
            </a>
            <span className="opacity-30">•</span>
            <a
              href="https://chat.aksaranta.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 transition-colors"
            >
              Chat
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
