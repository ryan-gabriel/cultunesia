"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"; // Asumsi path komponen
import { Badge } from "@/components/ui/badge"; // Asumsi path komponen

// Fungsi helper untuk memformat tanggal (dari referensi)
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Fungsi helper untuk menghitung estimasi waktu baca
const calculateReadingTime = (htmlContent) => {
  if (!htmlContent) return 0;
  // Menghapus tag HTML untuk menghitung kata
  const text = htmlContent.replace(/<[^>]*>/g, "");
  const wordsPerMinute = 200; // Rata-rata kecepatan membaca
  const words = text.split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
};

const BlogDetail = ({ data }) => {
  const { title, content, thumbnail_url, created_at, description } = data;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const readingTime = calculateReadingTime(content);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Elemen Dekoratif Latar Belakang */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-yellow-200/20 dark:bg-yellow-500/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
      </div>

      <motion.main
        className="relative z-10 container mx-auto px-4 sm:px-4 py-12 sm:py-20"
        variants={containerVariants}
        initial={mounted ? "hidden" : false}
        animate="visible"
      >
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
          {/* Tombol Kembali */}
          <Link href="/blogs" passHref>
            <Button
              variant="outline"
              className="mb-8 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Semua Artikel
            </Button>
          </Link>

          {/* Header Artikel */}
          <header className="mb-12 text-center">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-amber-100 dark:to-white bg-clip-text text-transparent">
                {title}
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            >
              {description}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center gap-4 mt-6"
            >
              <Badge variant="secondary" className="backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5 mr-2" />
                {formatDate(created_at)}
              </Badge>
              <Badge variant="secondary" className="backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 mr-2" />
                {readingTime} min baca
              </Badge>
            </motion.div>
          </header>

          {/* Gambar Thumbnail */}
          <motion.div
            variants={itemVariants}
            className="mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/10 border border-gray-200/50 dark:border-gray-800"
          >
            <img
              src={thumbnail_url}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Konten Artikel */}
          <motion.article
            variants={itemVariants}
            // Gunakan class `prose` dari Tailwind Typography untuk styling otomatis
            className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none"
            // Penting: Merender konten HTML dari API dengan aman
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </motion.div>
      </motion.main>
    </div>
  );
};

export default BlogDetail;