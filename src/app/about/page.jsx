"use client";

import Navbar from "@/components/Navbar/Navbar";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card"; // Asumsi path komponen
import { Badge } from "@/components/ui/badge"; // Asumsi path komponen
import { Users } from "lucide-react";

// Data Tim (tidak berubah)
const teamMembers = [
  {
    name: "Muhamad Abdul Azis",
    role: "Backend Developer",
    image: "/team/azis.jpg",
  },
  {
    name: "Ryan Gabriel",
    role: "Frontend Developer",
    image: "/team/ryan.jpg",
  },
  {
    name: "Rafif",
    role: "UI/UX Designer",
    image: "/team/rafif.jpg",
  },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Elemen Dekoratif Latar Belakang */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-200/20 dark:bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-24 sm:py-32 relative z-10">
        <motion.div
          className="text-center"
          initial={mounted ? "hidden" : false}
          animate="visible"
          variants={containerVariants}
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants}>
            <Badge className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20 rounded-full mb-6 border border-amber-400/30 dark:border-amber-600/30 text-amber-700 dark:text-amber-400 font-semibold shadow-lg backdrop-blur-sm">
              <Users className="w-5 h-5" />
              Tim Di Balik Layar
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-amber-100 dark:to-white bg-clip-text text-transparent">
              Tentang Kami
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Kami adalah tim pengembang di balik{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              Cultunesia
            </span>
            , berfokus untuk menghadirkan pengalaman interaktif yang elegan dan
            informatif.
          </motion.p>
        </motion.div>

        {/* Grid Tim */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20"
          initial={mounted ? "hidden" : false}
          animate="visible"
          variants={containerVariants}
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group h-full"
            >
              <Card className="h-full text-center overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 rounded-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-amber-400/50 dark:hover:border-amber-600/50">
                <CardContent className="p-8 flex flex-col items-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-lg mb-6 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {member.name}
                  </h2>
                  <p className="text-amber-600 dark:text-amber-400 font-medium">
                    {member.role}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Text */}
        <motion.div
          className="mt-20 text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          initial={mounted ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p>
            Dengan dedikasi dan semangat kolaborasi, tim kami terus berusaha
            menghadirkan inovasi terbaik untuk pengembangan platform ini.
          </p>
        </motion.div>
      </div>
    </div>
  </>
  );
}