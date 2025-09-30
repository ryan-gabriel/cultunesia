"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Newspaper, Calendar, ArrowRight, LoaderCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fungsi helper untuk memformat tanggal
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const BlogsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState({ blogs: [], pagination: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10); // Mengubah default limit ke 6 untuk grid

  useEffect(() => {
    const fetchBlogsFromApi = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Panggil API route Anda. Pastikan API route ini sudah dibuat.
        const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error("Gagal memuat data blog. Silakan coba lagi.");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogsFromApi();
  }, [page, limit]);

  const { blogs, pagination } = data;
  const { totalPages, total } = pagination || {};

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/blogs?page=${newPage}&limit=${limit}`);
    }
  };

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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="pt-40 pb-24 text-center bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-gold/10 rounded-full mb-6 border border-primary-gold/20"
          >
            <Newspaper className="w-5 h-5 text-primary-gold" />
            <span className="text-primary-gold font-semibold">Wawasan Nusantara</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Artikel & Wawasan
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jelajahi artikel, berita, dan cerita mendalam tentang kekayaan budaya Indonesia.
          </p>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 flex-col text-gray-500">
             <LoaderCircle className="w-10 h-10 animate-spin mb-4" />
             <p className="text-lg">Memuat artikel...</p>
          </div>
        ) : error ? (
           <div className="flex justify-center items-center h-64 flex-col text-red-600 bg-red-50 p-8 rounded-2xl">
             <AlertTriangle className="w-10 h-10 mb-4" />
             <p className="text-lg font-semibold">{error}</p>
          </div>
        ) : !blogs || blogs.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700">Belum Ada Blog</h2>
            <p className="text-gray-500 mt-2">Saat ini belum ada artikel yang tersedia. Silakan cek kembali nanti.</p>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogs.map((blog) => (
                <Link href={`/blogs/${blog.slug}`} key={blog.id} passHref>
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="group cursor-pointer h-full"
                  >
                    <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl rounded-2xl transition-shadow duration-300">
                      <div className="relative h-56">
                        <img
                          src={blog.thumbnail_url || "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800"}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                      <CardContent className="p-6 flex flex-col justify-between flex-grow h-full">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary-gold transition-colors">
                            {blog.title}
                          </h2>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(blog.created_at)}</span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {blog.description}
                          </p>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-primary-gold font-semibold">
                          <span>Baca Selengkapnya</span>
                          <motion.span
                            className="group-hover:translate-x-1 transition-transform"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 space-x-4">
                  <Button 
                    onClick={() => handlePageChange(page - 1)} 
                    disabled={page <= 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-gray-700 font-medium">
                    Halaman {page} dari {totalPages}
                  </span>
                   <Button 
                    onClick={() => handlePageChange(page + 1)} 
                    disabled={page >= totalPages}
                  >
                    Berikutnya
                  </Button>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;