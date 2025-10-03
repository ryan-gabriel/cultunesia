"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Info, ArrowRight, Globe, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Asumsikan komponen UI dasar (Input, Button, dll.) diimpor dari shadcn/ui

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

/**
 * Komponen untuk menampilkan daftar provinsi dalam format kartu yang elegan dengan filter.
 */
export default function ProvincesList({ provinceData }) {
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Filtering Logic
  const filteredProvinces = useMemo(() => {
    if (!searchTerm) {
      return provinceData.filter((p) => p.slug);
    }
    const lowercasedSearch = searchTerm.toLowerCase();
    return provinceData.filter(
      (p) =>
        p.slug &&
        (p.name?.toLowerCase().includes(lowercasedSearch) ||
         p.description?.toLowerCase().includes(lowercasedSearch))
    );
  }, [provinceData, searchTerm]);

  const totalProvinces = provinceData.length;
  const currentCount = filteredProvinces.length;

  // 2. Empty State Handling (Filtered or Initial)
  if (totalProvinces === 0) {
    return (
      <div className="text-center py-16 bg-slate-800 rounded-xl mx-4 my-8 shadow-2xl text-slate-400">
        <Info className="w-8 h-8 mx-auto mb-3 text-amber-500" />
        <p className="text-lg font-medium">
          Tidak ada data provinsi yang dimuat.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 bg-white dark:bg-slate-900">
      
      {/* Header Section with Search */}
      <header className="text-center mb-12">
        <Globe className="w-10 h-10 mx-auto text-amber-500 mb-3" />
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
          Jelajahi Kekayaan Budaya Nusantara
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 mt-3">
          Menampilkan **{currentCount}** dari **{totalProvinces}** provinsi dengan kuis budaya eksklusif.
        </p>

        {/* Search Input */}
        <div className="mt-8 max-w-lg mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari provinsi (contoh: Papua Pegunungan)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition shadow-lg"
            />
          </div>
        </div>
      </header>
      
      {/* Grid Cards Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence>
          {filteredProvinces.length > 0 ? (
            filteredProvinces.map((province) => {
              const linkHref = `/${province.slug}`;
              const cardColorClass = province.color || 'bg-slate-50/50 border-slate-300 dark:bg-slate-800/80 dark:border-slate-700';

              return (
                <motion.article
                  key={province.slug}
                  variants={itemVariants}
                  layout // Tambahkan layout untuk animasi filter yang halus
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  <Link href={linkHref} className="block h-full">
                    <Card className={`h-full border-2 ${cardColorClass} dark:shadow-2xl dark:shadow-slate-900/50`}>
                      
                      {/* Card Header (Province Name) */}
                      <CardHeader className="p-6 pb-4 flex flex-row items-start justify-between">
                        <CardTitle className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                          {province.name}
                        </CardTitle>
                        <MapPin className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                      </CardHeader>

                      {/* Card Content (Details & Link) */}
                      <CardContent className="p-6 pt-0 space-y-4">
                        
                        {/* Description */}
                        <p className="text-sm text-slate-600 dark:text-slate-400 min-h-[50px]">
                          {province.description || 
                          "Detail deskripsi provinsi ini segera hadir. Jelajahi kuis kami!"}
                        </p>

                        {/* Population & Info */}
                        <div className="flex items-center gap-6 border-t pt-4 border-slate-300/50 dark:border-slate-700">
                            <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                <Users className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
                                <span className="text-xs uppercase text-slate-500 dark:text-slate-400">Populasi:</span>
                                <span className="font-bold ml-2 text-amber-600 dark:text-amber-400 text-base">
                                  {province.population || '—'}
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-4">
                          <span 
                            className="w-full inline-flex items-center justify-center rounded-xl h-12 px-6 text-base font-semibold transition-colors 
                                       bg-amber-500 text-white shadow-md shadow-amber-500/50 
                                       hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 dark:shadow-amber-900/50"
                            style={{
                              '--color-primary-gold': '#f5bd02' 
                            }}
                          >
                            Mulai Eksplorasi 
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </span>
                        </div>
                        
                      </CardContent>
                    </Card>
                  </Link>
                </motion.article>
              );
            })
          ) : (
            <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:col-span-4 text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-xl shadow-inner border border-dashed border-slate-300 dark:border-slate-700"
            >
                <Info className="w-8 h-8 mx-auto mb-3 text-red-500" />
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    Tidak ada provinsi yang cocok dengan pencarian "**{searchTerm}**".
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Coba kata kunci lain atau hapus filter.
                </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}