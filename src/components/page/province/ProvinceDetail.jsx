"use client"

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  MapPin, 
  Users, 
  Camera, 
  Utensils, 
  Globe, 
  Lightbulb, 
  Heart, 
  Shirt,
  ChevronRight,
  Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProvinceDetail = ({ provinceData }) => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
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
      id: 'tourism',
      title: 'Wisata & Destinasi',
      icon: Camera,
      description: 'Jelajahi tempat-tempat menakjubkan',
      gradient: 'from-blue-600 via-purple-600 to-pink-600'
    },
    {
      id: 'language',
      title: 'Bahasa Daerah',
      icon: Globe,
      description: 'Kekayaan linguistik nusantara',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-600'
    },
    {
      id: 'food',
      title: 'Kuliner Khas',
      icon: Utensils,
      description: 'Cita rasa autentik daerah',
      gradient: 'from-orange-600 via-red-600 to-pink-600'
    },
    {
      id: 'funfact',
      title: 'Fakta Menarik',
      icon: Lightbulb,
      description: 'Hal unik yang perlu diketahui',
      gradient: 'from-yellow-600 via-orange-600 to-red-600'
    },
    {
      id: 'ethnic_groups',
      title: 'Suku & Etnis',
      icon: Heart,
      description: 'Keberagaman budaya',
      gradient: 'from-purple-600 via-indigo-600 to-blue-600'
    },
    {
      id: 'traditional_clothing',
      title: 'Pakaian Adat',
      icon: Shirt,
      description: 'Warisan busana tradisional',
      gradient: 'from-pink-600 via-rose-600 to-red-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section with Parallax */}
      <motion.div 
        ref={heroRef}
        style={{ y: heroYSpring, opacity: heroOpacity }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-10" />
          <img
            src={provinceData.image_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center"}
            alt={provinceData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-gold/20 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-20 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isVisible ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 120 }}
          >
            <Badge className="mb-6 bg-primary-gold/90 text-black font-medium px-4 py-2 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              Provinsi Indonesia
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            {provinceData.name}
          </motion.h1>

          <motion.div 
            className="flex items-center justify-center gap-8 text-white/80 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{new Intl.NumberFormat('id-ID').format(provinceData.population)} jiwa</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-primary-gold" />
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>Jelajahi Sekarang</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-primary-gold rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-30 -mt-20"
      >
        {/* Description Card */}
        <motion.div variants={itemVariants} className="container mx-auto px-6 mb-20">
          <Card className="backdrop-blur-lg bg-white/90 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Tentang {provinceData.name}</h2>
                  <div className="w-24 h-1 bg-primary-gold mx-auto rounded-full" />
                </div>
                
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-center"
                  dangerouslySetInnerHTML={{ __html: provinceData.description }}
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div variants={itemVariants} className="container mx-auto px-6 mb-20">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Jelajahi Lebih Dalam
            </motion.h2>
            <motion.div 
              className="w-32 h-1 bg-primary-gold mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10, 
                    transition: { duration: 0.3 }
                  }}
                  className="group cursor-pointer"
                >
                  <Card className="h-80 overflow-hidden border-0 shadow-xl rounded-2xl bg-white hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-full">
                      {/* Background Image with Gradient Overlay */}
                      <div className="absolute inset-0">
                        <img
                          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center"
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-85 group-hover:opacity-90 transition-opacity duration-500`} />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>

                      {/* Content */}
                      <CardContent className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4"
                        >
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-gold/90 group-hover:text-black transition-all duration-500">
                            <Icon className="w-8 h-8" />
                          </div>
                        </motion.div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-gold transition-colors duration-300">
                          {card.title}
                        </h3>
                        <p className="text-white/80 text-sm mb-4 leading-relaxed">
                          {card.description}
                        </p>

                        <Button 
                          variant="ghost" 
                          className="w-fit p-0 h-auto text-white hover:text-primary-gold hover:bg-transparent group-hover:translate-x-2 transition-all duration-300"
                        >
                          <span className="mr-2">Selengkapnya</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div 
          variants={itemVariants}
          className="container mx-auto px-6 pb-20"
        >
          <Card className="bg-gradient-to-r from-primary-gold via-yellow-500 to-primary-gold text-black border-0 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold mb-4">
                  Siap Menjelajahi {provinceData.name}?
                </h3>
                <p className="text-lg mb-8 opacity-90">
                  Temukan keajaiban dan kekayaan budaya yang menanti untuk dijelajahi
                </p>
                <Button 
                  size="lg" 
                  className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Mulai Perjalanan
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProvinceDetail;