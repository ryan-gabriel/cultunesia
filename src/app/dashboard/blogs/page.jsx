"use client";

import { columns } from "@/components/dataTable/blogs/columns";
import { DataTable } from "@/components/dataTable/blogs/data-table";
import { useAuth } from "@/context/AuthContext";
import { fetchBlogs } from "@/utils/blogs";
import { Plus, AlertCircle, Loader2, Search, FileText } from "lucide-react"; // Impor ikon tambahan
import Link from "next/link";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Untuk animasi
import { toast } from "sonner";

// --- Komponen untuk UI State ---
const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    // Dark mode classes added: bg-white -> dark:bg-gray-800, text-gray-500 -> dark:text-gray-400
    className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-inner py-12"
  >
    <Loader2 className="w-8 h-8 animate-spin mb-4 text-yellow-600" />
    {/* text-gray-500 (implied by parent) -> dark:text-gray-200 for emphasis */}
    <p className="text-lg font-medium dark:text-gray-200">
      Memuat data artikel...
    </p>
    {/* text-gray-400 -> dark:text-gray-500 */}
    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
      Mohon tunggu sebentar.
    </p>
  </motion.div>
);

const ErrorState = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    // Dark mode classes added: bg-red-50 -> dark:bg-red-950, border-red-200 -> dark:border-red-800, text-red-700 -> dark:text-red-300
    className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 p-8 text-center"
  >
    <AlertCircle className="w-10 h-10 mb-4" />
    <p className="text-xl font-bold">Terjadi Kesalahan</p>
    <p className="text-md mt-2">
      {message || "Gagal memuat data. Silakan coba lagi."}
    </p>
  </motion.div>
);

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    // Dark mode classes added: bg-gray-50 -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700, text-gray-500 -> dark:text-gray-400
    className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 p-8 text-center"
  >
    <FileText className="w-10 h-10 mb-4" />
    <p className="text-xl font-bold">Belum Ada Artikel</p>
    <p className="text-md mt-2">Mulai buat artikel pertama Anda sekarang!</p>
    <Link href={"/dashboard/blogs/create"} className="mt-6">
      <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors shadow-md">
        <Plus size={20} />
        <span>Buat Artikel Baru</span>
      </button>
    </Link>
  </motion.div>
);

// --- Komponen Utama Halaman ---
const Page = () => {
  const { session, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const fetched = useRef(false);

  useEffect(() => {
    if (!session || fetched.current) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        const blogData = await fetchBlogs();
        setData(blogData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
    fetched.current = true;
  }, [session]);

  const handleDelete = async (blog) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus blog "${blog.title}"?`))
      return;

    try {
      const res = await fetch(`/api/blogs/${blog.slug}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menghapus blog");

      toast("Blog Berhasil Dihapus", {
        description: "Perubahan berhasil disimpan",
        duration: 3000,
      });
      setData((prev) => prev.filter((b) => b.id !== blog.id));
    } catch (err) {
      console.error(err);
      toast("Error occurred!", {
        description: err.message,
        duration: 3000,
      });
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.profiles?.full_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (authLoading) return <LoadingState />;
  if (!session) return null;

  return (
    // Dark mode added: bg-gray-50 -> dark:bg-gray-900
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Halaman */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // Dark mode classes added: bg-white -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700
          className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div>
            {/* text-gray-900 -> dark:text-gray-100 */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Manajemen Artikel Blog
            </h1>
            {/* text-gray-600 -> dark:text-gray-400 */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Buat, edit, dan kelola semua artikel untuk Cultunesia.
            </p>
          </div>
          <Link href={"/dashboard/blogs/create"}>
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors shadow-md">
              <Plus size={18} />
              <span>Buat Artikel Baru</span>
            </button>
          </Link>
        </motion.div>

        {/* 🔹 Statistik Ringkas */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Card Statistik */}
          {[
            {
              label: "Total Artikel",
              value: data.length,
              iconColor: "text-yellow-500",
            },
            {
              label: "Artikel Diterbitkan",
              value: data.length,
              iconColor: "text-green-500",
            },
            { label: "Artikel Draft", value: 0, iconColor: "text-blue-500" },
            { label: "Penulis Aktif", value: 1, iconColor: "text-purple-500" },
          ].map((stat, index) => (
            <div
              key={index}
              // Dark mode classes added: bg-white -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between"
            >
              <div>
                {/* text-gray-500 -> dark:text-gray-400 */}
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
                {/* text-gray-900 -> dark:text-gray-100 */}
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {stat.value}
                </h2>
              </div>
              <FileText className={`w-10 h-10 ${stat.iconColor} opacity-60`} />
            </div>
          ))}
        </motion.div>

        {/* 🔹 Search Bar dan Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          // Dark mode classes added: bg-white -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700
          className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-4"
        >
          <div className="relative flex-grow w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* text-gray-400 -> dark:text-gray-500 */}
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Cari artikel berdasarkan judul, deskripsi, atau penulis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Dark mode classes added: bg-white -> dark:bg-gray-900, border-gray-300 -> dark:border-gray-700, text-gray-900 -> dark:text-gray-100
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 dark:focus:border-yellow-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 transition-all"
            />
          </div>
          {/* <select className="w-full md:w-auto px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
             <option value="">Semua Kategori</option>
             <option value="budaya">Budaya</option>
             <option value="sejarah">Sejarah</option>
          </select> */}
        </motion.div>

        {/* Panel untuk Tabel Data */}
        <AnimatePresence mode="wait">
          {loadingData ? (
            <LoadingState key="loading" />
          ) : error ? (
            <ErrorState key="error" message={error} />
          ) : filteredData.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              // Dark mode added: bg-white -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
            >
              <DataTable
                columns={columns}
                data={filteredData}
                onDelete={handleDelete}
                // Catatan: Komponen 'DataTable' dan 'columns' perlu diperbarui untuk mendukung dark mode.
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;