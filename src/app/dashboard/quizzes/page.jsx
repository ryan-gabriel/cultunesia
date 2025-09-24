"use client";

import { columns } from "@/components/dataTable/quizzes/columns";
import { DataTable } from "@/components/dataTable/quizzes/data-table";
import { useAuth } from "@/context/AuthContext";
import { fetchQuizzes } from "@/utils/quizzes";
import { Plus, AlertCircle, Loader2, Search, HelpCircle, Map, Calendar } from "lucide-react"; // Impor ikon
import Link from "next/link";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Komponen untuk UI State ---
const LoadingState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-xl shadow-inner py-12">
    <Loader2 className="w-8 h-8 animate-spin mb-4 text-yellow-600" />
    <p className="text-lg font-medium">Memuat data kuis...</p>
    <p className="text-sm text-gray-400 mt-1">Mohon tunggu sebentar.</p>
  </motion.div>
);

const ErrorState = ({ message }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-xl text-red-700 p-8 text-center">
    <AlertCircle className="w-10 h-10 mb-4" />
    <p className="text-xl font-bold">Terjadi Kesalahan</p>
    <p className="text-md mt-2">{message || "Gagal memuat data. Silakan coba lagi."}</p>
  </motion.div>
);

const EmptyState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 p-8 text-center">
    <HelpCircle className="w-10 h-10 mb-4" />
    <p className="text-xl font-bold">Belum Ada Kuis</p>
    <p className="text-md mt-2">Mulai buat kuis pertama Anda untuk menguji wawasan pengguna.</p>
    <Link href={"/dashboard/quizzes/create"} className="mt-6">
      <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors shadow-md">
        <Plus size={20} />
        <span>Buat Kuis Baru</span>
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
  const [filterCategory, setFilterCategory] = useState(""); // State untuk filter kategori
  const fetched = useRef(false);

  useEffect(() => {
    if (!session || fetched.current) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        const quizzesData = await fetchQuizzes();
        setData(quizzesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
    fetched.current = true;
  }, [session]);

  const handleDelete = async (quiz) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus quiz "${quiz.title}"?`)) return;

    try {
      const res = await fetch(`/api/quizzes/${quiz.quiz_id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menghapus quiz");
      alert("Quiz berhasil dihapus");
      setData((prev) => prev.filter((q) => q.quiz_id !== quiz.quiz_id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🔹 Filter data berdasarkan searchTerm dan filterCategory
  const filteredData = useMemo(() => {
    return data
      .filter(quiz => {
        if (!filterCategory) return true;
        return quiz.category === filterCategory;
      })
      .filter(quiz => {
        if (!searchTerm) return true;
        return quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [data, searchTerm, filterCategory]);

  // 🔹 Hitung statistik dari data
  const stats = useMemo(() => ({
    total: data.length,
    province: data.filter(q => q.category === 'province').length,
    daily: data.filter(q => q.category === 'daily').length,
  }), [data]);

  if (authLoading) return <LoadingState />;
  if (!session) return null;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Halaman */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Kuis</h1>
            <p className="text-sm text-gray-600 mt-1">Buat dan kelola kuis interaktif untuk provinsi dan tantangan harian.</p>
          </div>
          <Link href={"/dashboard/quizzes/create"}>
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors shadow-md">
              <Plus size={18} />
              <span>Buat Kuis Baru</span>
            </button>
          </Link>
        </motion.div>

        {/* Statistik Ringkas */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Kuis</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</h2>
            </div>
            <HelpCircle className="w-10 h-10 text-yellow-500 opacity-60" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Kuis Provinsi</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.province}</h2>
            </div>
            <Map className="w-10 h-10 text-green-500 opacity-60" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Kuis Harian</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.daily}</h2>
            </div>
            <Calendar className="w-10 h-10 text-blue-500 opacity-60" />
          </div>
        </motion.div>

        {/* Search Bar dan Filter */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari kuis berdasarkan judul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 transition-all"
            />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white"
          >
            <option value="">Semua Kategori</option>
            <option value="province">Provinsi</option>
            <option value="daily">Harian</option>
          </select>
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
            <motion.div key="table" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <DataTable columns={columns} data={filteredData} onDelete={handleDelete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;