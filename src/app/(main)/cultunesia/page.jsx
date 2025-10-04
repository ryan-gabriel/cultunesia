"use client";

import Navbar from "@/components/Navbar/Navbar";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Palette,
  BookOpen,
  Globe,
  Image,
  Users,
  Sparkles,
  ArrowRight,
  Heart,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AboutPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Compass,
      title: "Eksplorasi Budaya",
      desc: "Kenali keragaman budaya Indonesia dari Sabang sampai Merauke.",
      gradient: "from-amber-500 to-yellow-600",
    },
    {
      icon: Palette,
      title: "Karya & Tradisi",
      desc: "Ruang untuk seni, musik, dan tradisi lokal.",
      gradient: "from-orange-500 to-amber-600",
    },
    {
      icon: BookOpen,
      title: "Cerita Nusantara",
      desc: "Kumpulan kisah inspiratif dari berbagai daerah.",
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      icon: Globe,
      title: "Tur Virtual",
      desc: "Pengalaman imersif menjelajah destinasi budaya.",
      gradient: "from-amber-600 to-orange-600",
    },
    {
      icon: Image,
      title: "Koleksi Visual",
      desc: "Dokumentasi foto, lukisan, dan karya seni.",
      gradient: "from-yellow-600 to-amber-600",
    },
    {
      icon: Users,
      title: "Komunitas",
      desc: "Terhubung dengan komunitas pecinta budaya.",
      gradient: "from-orange-600 to-amber-700",
    },
  ];

  const coreComponents = [
    "Eksplorasi",
    "Tradisi",
    "Karya",
    "Cerita",
    "Tur Virtual",
    "Komunitas",
  ];

  const missionPoints = [
    {
      icon: Zap,
      text: "Materi ringkas dan mudah diakses",
    },
    {
      icon: Heart,
      text: "Merayakan keragaman budaya lokal",
    },
    {
      icon: Shield,
      text: "Kolaborasi terbuka dengan komunitas",
    },
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          initial={mounted ? { opacity: 0, y: 30 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={mounted ? { scale: 0.9, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Platform Budaya Digital
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl"
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
              Cultunesia
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-3xl mx-auto"
            initial={mounted ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Platform digital untuk memperkenalkan, melestarikan, dan menginspirasi
            masyarakat melalui kekayaan budaya Indonesia. Eksplorasi karya, tradisi,
            dan cerita budaya nusantara dengan tampilan modern namun elegan.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white rounded-xl font-bold hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 flex items-center gap-2 border border-amber-400/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mulai Eksplorasi
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tentang Kami
              <BookOpen className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { delay: 1 }, y: { duration: 2, repeat: Infinity } }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mx-auto" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-200/10 dark:bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="text-center mb-16 relative z-10"
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Target className="w-3 h-3 mr-2" />
            Fitur Utama
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Semua yang Anda butuhkan untuk{" "}
            <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              Budaya Nusantara
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Fitur lengkap untuk mengeksplorasi dan melestarikan warisan budaya Indonesia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl hover:border-amber-400/50 dark:hover:border-amber-600/50 transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-6 relative">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Core Components & Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Core Components */}
          <motion.div
            initial={mounted ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full bg-gradient-to-br from-amber-50 to-yellow-50/50 dark:from-gray-900 dark:to-gray-800 border-amber-200/50 dark:border-gray-700/50 shadow-xl">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-amber-600 text-white border-0">
                  <Zap className="w-3 h-3 mr-2" />
                  Arsitektur Produk
                </Badge>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Komponen Inti
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {coreComponents.map((comp, i) => (
                    <motion.div
                      key={i}
                      className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-4 rounded-xl text-center text-sm font-semibold text-gray-800 dark:text-gray-200 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {comp}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={mounted ? { opacity: 0, x: 20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0">
                  <Heart className="w-3 h-3 mr-2" />
                  Misi Kami
                </Badge>
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Pelestarian Budaya lewat Teknologi
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Cultunesia menghubungkan pembelajaran, arsip budaya, dan media
                  kreatif agar lebih dekat dengan generasi muda.
                </p>
                <div className="space-y-4">
                  {missionPoints.map((point, i) => {
                    const Icon = point.icon;
                    return (
                      <motion.div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors group"
                        initial={mounted ? { opacity: 0, x: -10 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 pt-1">
                          {point.text}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 text-center text-white py-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <motion.div
          className="relative z-10"
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 fill-current" />
            © 2025 Cultunesia — Menjaga Warisan, Menginspirasi Masa Depan.
          </p>
        </motion.div>
      </footer>
    </div>
  </>
  );
};

export default AboutPage;