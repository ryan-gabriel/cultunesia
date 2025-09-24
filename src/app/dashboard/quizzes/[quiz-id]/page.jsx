"use client";

import { columns } from "@/components/dataTable/questions/columns";
import { DataTable } from "@/components/dataTable/questions/data-table";
import { useAuth } from "@/context/AuthContext";
import { fetchQuestions, fetchQuizById } from "@/utils/quizzes"; // Asumsi ada fungsi fetchQuizById
import { Plus, AlertCircle, Loader2, Search, ArrowLeft, ClipboardList } from "lucide-react"; // Impor ikon
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Komponen untuk UI State ---
const LoadingState = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-xl shadow-inner py-12">
    <Loader2 className="w-8 h-8 animate-spin mb-4 text-yellow-600" />
    <p className="text-lg font-medium">Memuat data pertanyaan...</p>
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

const EmptyState = ({ quizId }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 p-8 text-center">
    <ClipboardList className="w-10 h-10 mb-4" />
    <p className="text-xl font-bold">Belum Ada Pertanyaan</p>
    <p className="text-md mt-2">Mulai buat pertanyaan pertama untuk kuis ini.</p>
    <Link href={`/dashboard/quizzes/${quizId}/create`} className="mt-6">
      <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors shadow-md">
        <Plus size={20} />
        <span>Tambah Pertanyaan Baru</span>
      </button>
    </Link>
  </motion.div>
);

// --- Komponen Utama Halaman ---
const Page = () => {
  const params = useParams();
  const quizId = params["quiz-id"];
  const { session, loading: authLoading } = useAuth();
  
  const [quizInfo, setQuizInfo] = useState(null); // State untuk menyimpan info kuis
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(""); // State untuk filter tipe pertanyaan
  const fetched = useRef(false);

  useEffect(() => {
    if (!session || !quizId || fetched.current) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        // Ambil data kuis dan data pertanyaan secara bersamaan
        const [quizData, questionsData] = await Promise.all([
          fetchQuizById(quizId),
          fetchQuestions(quizId)
        ]);
        setQuizInfo(quizData);
        setData(questionsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
    fetched.current = true;
  }, [session, quizId]);

  const handleDelete = async (question) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pertanyaan ini?`)) return;

    try {
      const res = await fetch(`/api/admin/quizzes/${question.quiz_id}/questions/${question.question_id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menghapus pertanyaan");
      alert("Pertanyaan berhasil dihapus");
      setData((prev) => prev.filter((q) => q.question_id !== question.question_id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const filteredData = useMemo(() => {
    return data
      .filter(q => !filterType || q.type === filterType)
      .filter(q => !searchTerm || q.text?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm, filterType]);

  const stats = useMemo(() => ({
    total: data.length,
    multipleChoice: data.filter(q => q.type === 'multiple_choice').length,
    shortAnswer: data.filter(q => q.type === 'short_answer').length,
    matching: data.filter(q => q.type === 'matching').length,
  }), [data]);

  if (authLoading) return <LoadingState />;
  if (!session) return null;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <Link href="/dashboard/quizzes" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft size={16} />
            Kembali ke Daftar Kuis
          </Link>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Pertanyaan</h1>
              <p className="text-sm text-gray-600 mt-1 truncate">
                Untuk Kuis: <span className="font-semibold">{quizInfo?.title || 'Memuat...'}</span>
              </p>
            </div>
            <Link href={`/dashboard/quizzes/${quizId}/create`}>
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors shadow-md">
                <Plus size={18} />
                <span>Tambah Pertanyaan</span>
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 font-medium">Total Pertanyaan</p><h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</h2></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 font-medium">Pilihan Ganda</p><h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.multipleChoice}</h2></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 font-medium">Isian Singkat</p><h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.shortAnswer}</h2></div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 font-medium">Menjodohkan</p><h2 className="text-3xl font-bold text-gray-900 mt-1">{stats.matching}</h2></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
            <input type="text" placeholder="Cari pertanyaan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 transition-all"/>
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full md:w-auto px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white">
            <option value="">Semua Tipe</option>
            <option value="multiple_choice">Pilihan Ganda</option>
            <option value="short_answer">Isian Singkat</option>
            <option value="matching">Menjodohkan</option>
            <option value="image_guess">Tebak Gambar</option>
          </select>
        </motion.div>

        <AnimatePresence mode="wait">
          {loadingData ? (
            <LoadingState key="loading" />
          ) : error ? (
            <ErrorState key="error" message={error} />
          ) : filteredData.length === 0 ? (
            <EmptyState key="empty" quizId={quizId} />
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