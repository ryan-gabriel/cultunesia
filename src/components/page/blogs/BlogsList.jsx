"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, ArrowRight, Newspaper, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Fungsi helper untuk memformat tanggal
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const BlogsList = ({ data, page, limit }) => {
  const { blogs, pagination } = data;
  const { totalPages } = pagination || {};
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

  const cardVariants = {
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      window.location.href = `/blogs?page=${newPage}&limit=${limit}`;
    }
  };

  if (!blogs || blogs.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <motion.div
          className="text-center py-20"
          initial={mounted ? { opacity: 0, scale: 0.9 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-950 dark:to-yellow-950 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Newspaper className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Belum Ada Blog
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Saat ini belum ada artikel yang tersedia.
          </p>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-200/20 dark:bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <motion.div
        initial={mounted ? { opacity: 0, y: -20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="pt-40 pb-24 text-center relative z-10"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={mounted ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20 rounded-full mb-6 border border-amber-400/30 dark:border-amber-600/30 text-amber-700 dark:text-amber-400 font-semibold shadow-lg backdrop-blur-sm">
              <Newspaper className="w-5 h-5" />
              Wawasan Nusantara
            </Badge>
          </motion.div>
          
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-amber-100 dark:to-white bg-clip-text text-transparent">
              Artikel & Wawasan
            </span>
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={mounted ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Jelajahi artikel, berita, dan cerita mendalam tentang kekayaan
            budaya Indonesia.
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog, index) => (
            <Link href={`/blogs/${blog.slug}`} key={blog.id} passHref>
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group cursor-pointer h-full"
              >
                <Card className="h-full overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 rounded-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-amber-400/50 dark:hover:border-amber-600/50">
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={blog.thumbnail_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Featured Badge for first 3 items */}
                    {index < 3 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg backdrop-blur-sm">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Date Badge */}
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white border-0 backdrop-blur-sm shadow-lg">
                        <Calendar className="w-3 h-3 mr-2" />
                        {formatDate(blog.created_at)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                        {blog.description}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold group-hover:gap-3 transition-all">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            className="flex justify-center items-center mt-16 gap-4 flex-wrap"
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              variant="outline"
              className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Sebelumnya
            </Button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                        pageNum === page
                          ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <span key={pageNum} className="text-gray-400 dark:text-gray-600">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              variant="outline"
              className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
            >
              Berikutnya
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogsList;