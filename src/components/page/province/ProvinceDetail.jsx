// Contoh data provinceData untuk melihat strukturnya
// {
//   province: {
//     id: 8,
//     name: 'Jawa Barat',
//     description: 'asdasdasdasdasdasdasd',
//     image_url: 'https://rdmrruoujekrgxrejigz.supabase.co/storage/v1/object/public/general/provinces/jawa-barat-1758675251843.png',
//     created_at: '2025-09-24T00:54:14.197502',
//     updated_at: '2025-09-24T00:54:14.197502',
//     slug: 'jawa-barat',
//     population: 5000000
//   },
//   funfacts: [
//     {
//       id: 1,
//       fact: 'asdasd',
//       created_at: '2025-09-28T09:45:34.342624',
//       province_slug: 'jawa-barat'
//     }
//   ]
// }
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Users,
  Camera,
  Utensils,
  Globe,
  Heart,
  Shirt
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";

const ProvinceDetail = ({ provinceData }) => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const { province, funfacts } = provinceData;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const heroYSpring = useSpring(heroY, springConfig);

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
    },
    {
      id: "language",
      title: "Bahasa Daerah",
      icon: Globe,
      description: "Kekayaan linguistik nusantara",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    },
    {
      id: "food",
      title: "Kuliner Khas",
      icon: Utensils,
      description: "Cita rasa autentik daerah",
      gradient: "from-orange-600 via-red-600 to-pink-600",
    },
    {
      id: "ethnic_groups",
      title: "Suku & Etnis",
      icon: Heart,
      description: "Keberagaman budaya",
      gradient: "from-purple-600 via-indigo-600 to-blue-600",
    },
    {
      id: "traditional_clothing",
      title: "Pakaian Adat",
      icon: Shirt,
      description: "Warisan busana tradisional",
      gradient: "from-pink-600 via-rose-600 to-red-600",
    },
  ];

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100"
    >
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        style={{ y: heroYSpring, opacity: heroOpacity }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-10" />
          <img
            src={
              province.image_url ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center"
            }
            alt={province.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-gold/20 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <motion.div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            {province.name}
          </motion.h1>
          <div className="flex items-center justify-center gap-8 text-white/80 text-lg">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>
                {new Intl.NumberFormat("id-ID").format(province.population)}{" "}
                jiwa
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Description */}
      <motion.div className="container mx-auto px-6 mb-20">
        <Card className="backdrop-blur-lg bg-white/90 border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tentang {province.name}
            </h2>
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-center"
              dangerouslySetInnerHTML={{ __html: province.description }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Funfacts Section */}
      {funfacts?.length > 0 && (
        <motion.div className="container mx-auto px-6 mb-20">
          <h2 className="text-2xl font-bold mb-6">Fakta Menarik</h2>
          <ul className="list-disc list-inside space-y-2">
            {funfacts.map((fact) => (
              <li key={fact.id} className="text-gray-700">
                {fact.fact}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Categories */}
      <motion.div className="container mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Jelajahi Lebih Dalam
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={`/${province.slug}/${card.id}`}
                passHref
              >
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                  className="group cursor-pointer"
                >
                  <Card className="h-80 overflow-hidden border-0 shadow-xl rounded-2xl bg-white hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-full">
                      {/* Background */}
                      <div className="absolute inset-0">
                        <img
                          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center"
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-500`}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>

                      {/* Content */}
                      <CardContent className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-gold/90 group-hover:text-black transition-all duration-500">
                            <Icon className="w-8 h-8" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-gold transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-white/80 text-sm mb-4 leading-relaxed">
                          {card.description}
                        </p>
                        <span className="text-primary-gold font-medium group-hover:underline">
                          Selengkapnya →
                        </span>
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
