"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Users,
  Camera,
  Utensils,
  Globe,
  Heart,
  Shirt,
  Sparkles,
  Brain,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const ProvinceDetail = ({ provinceData }) => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const {
    province,
    funfacts,
    tourism,
    language,
    food,
    ethnic_groups,
    traditional_clothing,
    quizzes
  } = provinceData;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const heroYSpring = useSpring(heroY, springConfig);
  
  const GOLD_CLASS = 'text-primary-gold dark:text-yellow-400';
  const GOLD_BG_CLASS = 'bg-primary-gold dark:bg-yellow-400';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categoryCards = [
    {
      id: "tourism",
      title: "Wisata & Destinasi",
      icon: Camera,
      description: "Jelajahi tempat-tempat menakjubkan",
      gradient: "from-blue-600 via-purple-600 to-pink-600",
      count: tourism?.length || 0,
      data: tourism,
    },
    {
      id: "languages",
      title: "Bahasa Daerah",
      icon: Globe,
      description: "Kekayaan linguistik nusantara",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      count: language?.length || 0,
      data: language,
    },
    {
      id: "foods",
      title: "Kuliner Khas",
      icon: Utensils,
      description: "Cita rasa autentik daerah",
      gradient: "from-orange-600 via-red-600 to-pink-600",
      count: food?.length || 0,
      data: food,
    },
    {
      id: "ethnic_groups",
      title: "Suku & Etnis",
      icon: Heart,
      description: "Keberagaman budaya",
      gradient: "from-purple-600 via-indigo-600 to-blue-600",
      count: ethnic_groups?.length || 0,
      data: ethnic_groups,
    },
    {
      id: "traditional_clothing",
      title: "Pakaian Adat",
      icon: Shirt,
      description: "Warisan busana tradisional",
      gradient: "from-pink-600 via-rose-600 to-red-600",
      count: traditional_clothing?.length || 0,
      data: traditional_clothing,
    },
    {
      id: "quizzes",
      title: "Kuis Harian",
      icon: Brain,
      description: "Uji pengetahuanmu tentang budaya",
      gradient: "from-yellow-500 via-amber-600 to-orange-600",
      count: quizzes?.length || 0,
      data: quizzes,
    },
  ];

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 30 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  const funfactVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen transition-colors duration-500 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"
    >
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        style={{ y: heroYSpring, opacity: heroOpacity }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Enhanced Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent z-10" />
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={
              province?.image_url ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center"
            }
            alt={province?.name || "Province"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-gold/30 via-transparent to-transparent dark:from-yellow-400/30" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div 
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl bg-primary-gold/10 dark:bg-yellow-400/10"
          />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20"
          >
            <Sparkles className={`w-4 h-4 ${GOLD_CLASS}`} />
            <span className="text-white/90 text-sm font-medium">
              Jelajahi Budaya Indonesia
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 leading-tight tracking-tight"
          >
            {province?.name || "Nama Provinsi"}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
          >
            <Users className={`w-5 h-5 ${GOLD_CLASS}`} />
            <span className="text-white text-lg font-medium">
              {province?.population
                ? new Intl.NumberFormat("id-ID").format(province.population)
                : "0"}{" "}
              jiwa
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 -mt-32 mb-24 relative z-30"
      >
        <Card className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border dark:border-gray-800 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-10 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div 
                className="h-1 w-12 rounded-full bg-gradient-to-r from-primary-gold to-primary-gold/50 dark:from-yellow-400 dark:to-yellow-400/50"
              />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Tentang {province?.name || "Provinsi"}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  province?.description || "<p>Deskripsi belum tersedia.</p>",
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Funfacts Section */}
      {funfacts && funfacts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 mb-24"
        >
          <Card 
            className="backdrop-blur-xl bg-gradient-to-br from-primary-gold/5 dark:from-gray-950/20 to-blue-50/50 dark:to-gray-800/50 border border-primary-gold/20 dark:border-yellow-400/20 shadow-xl rounded-3xl overflow-hidden"
          >
            <CardContent className="p-10 md:p-16">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className={`w-6 h-6 ${GOLD_CLASS}`} />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Fakta Menarik
                </h2>
              </div>
              <div className="grid gap-4">
                {funfacts.map((fact, index) => (
                  <motion.div
                    key={fact.id}
                    custom={index}
                    variants={funfactVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex gap-4 p-5 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl border border-white/60 dark:border-gray-600/60 hover:shadow-md transition-all duration-300"
                  >
                    <div 
                      className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${GOLD_BG_CLASS}`}
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {fact.fact}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Categories Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 pb-24"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-primary-gold/10 dark:bg-yellow-400/10"
          >
            <Sparkles className={`w-4 h-4 ${GOLD_CLASS}`} />
            <span className={`font-medium ${GOLD_CLASS}`}>
              Eksplorasi Budaya
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Jelajahi Lebih Dalam
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Temukan kekayaan budaya dan tradisi dari berbagai aspek kehidupan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryCards.map((card, index) => {
            const Icon = card.icon;
            
            // ===== PERUBAHAN DI SINI =====
            // Menggunakan gambar utama provinsi untuk semua kartu.
            const imageUrl =
              province?.image_url ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center";

            return (
              <Link
                key={card.id}
                href={`/${province?.slug || "province"}/${card.id}`}
                passHref
              >
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -12,
                    transition: { duration: 0.4, ease: "easeOut" },
                  }}
                  className="group cursor-pointer h-full"
                >
                  <Card className="h-96 overflow-hidden border-0 shadow-xl rounded-3xl bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-full">
                      {/* Background */}
                      <div className="absolute inset-0">
                        <img
                          src={imageUrl}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-85 group-hover:opacity-90 transition-opacity duration-500`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>

                      {/* Count Badge */}
                      {card.count > 0 && (
                        <div className="absolute top-6 right-6 z-10">
                          <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                            <span className="text-white font-semibold text-sm">
                              {card.count} item{card.count > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Decorative Element */}
                      <div className="absolute top-6 left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />

                      {/* Content */}
                      <CardContent className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                        <motion.div
                          className="mb-6"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div 
                            className="w-16 h-16 bg-white/20 dark:bg-gray-700/50 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg group-hover:text-gray-900 transition-all duration-500"
                          >
                            <Icon className={`w-8 h-8 ${GOLD_CLASS}`} strokeWidth={2} />
                          </div>
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-gold dark:group-hover:text-yellow-400 transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-white/90 text-sm mb-6 leading-relaxed">
                          {card.description}
                        </p>
                        <div 
                          className={`flex items-center gap-2 font-semibold group-hover:gap-3 transition-all duration-300 ${GOLD_CLASS}`}
                        >
                          <span>Selengkapnya</span>
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            →
                          </motion.span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ProvinceDetail;