"use client";

import React, { useState, useMemo, useEffect } from "react";
// Mengganti import Link dari "next/link" dengan tag <a> HTML standar untuk mencegah error kompilasi.
// import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Users,
  ArrowRight,
  Globe,
  Search,
  Info,
  ArrowDownUp,
  ArrowDownAZ,
  ArrowUpZA,
  ArrowDown10,
  ArrowUp01,
  LandPlot,
} from "lucide-react";
import Link from "next/link";

const ProvincesList = ({ provinceData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format populasi menjadi string yang mudah dibaca
  const formatPopulation = (pop) => {
    const population = parseInt(pop, 10);
    if (isNaN(population) || population === 0) return "N/A";
    return new Intl.NumberFormat("id-ID").format(population);
  };

  const filteredProvinces = useMemo(() => {
    if (!provinceData) return [];
    let provinces = provinceData.filter((p) => p.slug);
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      provinces = provinces.filter((p) =>
        p.name?.toLowerCase().includes(lowercasedSearch)
      );
    }
    return provinces;
  }, [provinceData, searchTerm]);

  const sortedAndFilteredProvinces = useMemo(() => {
    let sortableItems = [...filteredProvinces];
    sortableItems.sort((a, b) => {
      if (sortConfig.key === "name") {
        const nameA = a.name || "";
        const nameB = b.name || "";
        if (sortConfig.direction === "ascending") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      } else if (sortConfig.key === "population") {
        const popA = parseInt(a.population, 10) || 0;
        const popB = parseInt(b.population, 10) || 0;
        if (sortConfig.direction === "ascending") {
          return popA - popB;
        } else {
          return popB - popA;
        }
      }
      return 0;
    });
    return sortableItems;
  }, [filteredProvinces, sortConfig]);

  const sortLabels = {
    "name-ascending": "Nama (A-Z)",
    "name-descending": "Nama (Z-A)",
    "population-descending": "Populasi (Tertinggi)",
    "population-ascending": "Populasi (Terendah)",
  };
  const currentSortLabel =
    sortLabels[`${sortConfig.key}-${sortConfig.direction}`];

  if (!provinceData || provinceData.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-yellow-200 dark:from-amber-800 dark:to-yellow-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Info className="w-12 h-12 text-amber-700 dark:text-amber-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Data Provinsi Belum Tersedia
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Saat ini kami belum dapat memuat daftar provinsi.
          </p>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-amber-100/50 dark:from-gray-900 dark:via-gray-950 dark:to-amber-950/20 relative overflow-hidden">
      {/* Elemen Dekoratif Latar Belakang */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-300/30 dark:bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 left-0 w-[600px] h-[600px] bg-yellow-300/30 dark:bg-yellow-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-16 sm:py-20 relative z-10">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={mounted ? "hidden" : false}
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Badge className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 dark:from-amber-500/30 dark:to-yellow-500/30 rounded-full mb-6 border border-amber-500/40 dark:border-amber-700/40 text-amber-800 dark:text-amber-300 font-semibold shadow-xl backdrop-blur-sm">
              <Globe className="w-5 h-5" />
              Kekayaan Nusantara
            </Badge>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 dark:from-white dark:via-amber-50 dark:to-white bg-clip-text text-transparent">
              Jelajahi Setiap Provinsi
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Temukan keunikan budaya, sejarah, dan kearifan lokal dari{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {provinceData.length}
            </span>{" "}
            provinsi di seluruh Indonesia.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="relative w-full">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                placeholder="Cari provinsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 h-14 text-lg rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition shadow-lg"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-5 text-md rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:border-amber-500 dark:hover:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all font-semibold shadow-lg"
                >
                  <ArrowDownUp className="w-4 h-4 mr-2" />
                  <span>{currentSortLabel || "Urutkan"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Urutkan Berdasarkan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    setSortConfig({ key: "name", direction: "ascending" })
                  }
                >
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  <span>Nama (A-Z)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    setSortConfig({ key: "name", direction: "descending" })
                  }
                >
                  <ArrowUpZA className="mr-2 h-4 w-4" />
                  <span>Nama (Z-A)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    setSortConfig({
                      key: "population",
                      direction: "descending",
                    })
                  }
                >
                  <ArrowDown10 className="mr-2 h-4 w-4" />
                  <span>Populasi (Tertinggi)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    setSortConfig({ key: "population", direction: "ascending" })
                  }
                >
                  <ArrowUp01 className="mr-2 h-4 w-4" />
                  <span>Populasi (Terendah)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </motion.div>

        {/* Grid Provinsi */}
        <motion.div
          key={sortConfig.key + sortConfig.direction}
          variants={containerVariants}
          initial={mounted ? "hidden" : false}
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {sortedAndFilteredProvinces.length > 0 ? (
              sortedAndFilteredProvinces.map((province) => (
                <motion.div
                  key={province.slug}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group h-full"
                >
                  {/* Menggunakan tag <a> standar untuk mencegah error Next.js Link */}
                  <Link
                    href={`/${province.slug}`}
                    passHref
                    className="block h-full"
                  >
                    <Card className="h-full flex flex-col overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 dark:hover:shadow-amber-900/30 rounded-2xl transition-all duration-300 border border-gray-300/70 dark:border-gray-700/70 hover:border-amber-500/70 dark:hover:border-amber-700/70">
                      {/* 1. Tambahkan Image Header */}
                      <div className="relative h-36 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {province.image_url ? (
                          <img
                            src={province.image_url}
                            alt={`Peta ${province.name}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              // Fallback jika URL gambar rusak
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/600x400/fff1d0/b45309?text=${province.name.replace(
                                / /g,
                                "+"
                              )}`;
                            }}
                          />
                        ) : (
                          // Placeholder jika image_url tidak ada
                          <div className="w-full h-full flex items-center justify-center bg-amber-100 dark:bg-amber-950/50">
                            <LandPlot className="w-10 h-10 text-amber-700 dark:text-amber-300" />
                          </div>
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="text-xl font-extrabold text-gray-900 dark:text-white leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                          {province.name}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex-grow flex flex-col justify-between pt-0 pb-2">
                        {/* Tambahkan Deskripsi Singkat */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
                          {province.description ||
                            "Deskripsi singkat belum tersedia untuk provinsi ini."}
                        </p>

                        {/* 2. Format Populasi */}
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>
                            {formatPopulation(province.population)} Penduduk
                          </span>
                        </div>

                        {/* Tombol Lihat Detail */}
                        <div className="mt-auto flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold group-hover:gap-3 transition-all">
                          <span>Jelajahi Sekarang</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-12"
              >
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Search className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Tidak Ditemukan
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Provinsi dengan kata kunci "{searchTerm}" tidak ada.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProvincesList;
