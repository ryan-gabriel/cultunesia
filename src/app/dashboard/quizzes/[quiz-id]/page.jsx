"use client";

import { columns } from "@/components/dataTable/questions/columns";
import { DataTable } from "@/components/dataTable/questions/data-table";
import { useAuth } from "@/context/AuthContext";
import { fetchQuestions, fetchQuizById } from "@/utils/quizzes"; // Asumsi ada fungsi fetchQuizById
import {
  Plus,
  AlertCircle,
  Loader2,
  Search,
  ArrowLeft,
  ClipboardList,
} from "lucide-react"; // Impor ikon
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    {/* text-gray-500 (implied) -> dark:text-gray-200 for emphasis */}
    <p className="text-lg font-medium dark:text-gray-200">
      Memuat data pertanyaan...
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

const EmptyState = ({ quizId }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    // Dark mode classes added: bg-gray-50 -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700, text-gray-500 -> dark:text-gray-400
    className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 p-8 text-center"
  >
    <ClipboardList className="w-10 h-10 mb-4" />
    <p className="text-xl font-bold">Belum Ada Pertanyaan</p>
    <p className="text-md mt-2">
      Mulai buat pertanyaan pertama untuk kuis ini.
    </p>
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
          fetchQuestions(quizId),
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
      const res = await fetch(
        `/api/admin/quizzes/${question.quiz_id}/questions/${question.question_id}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Gagal menghapus pertanyaan");
      toast("Question berhasil dihapus", {
        duration: 3000,
      });
      setData((prev) =>
        prev.filter((q) => q.question_id !== question.question_id)
      );
    } catch (err) {
      console.error(err);
      toast("Terjadi kesalahan", {
        duration: 3000,
      });
    }
  };

  const filteredData = useMemo(() => {
    return data
      .filter((q) => !filterType || q.type === filterType)
      .filter(
        (q) =>
          !searchTerm ||
          q.text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [data, searchTerm, filterType]);

  const stats = useMemo(
    () => ({
      total: data.length,
      multipleChoice: data.filter((q) => q.type === "multiple_choice").length,
      shortAnswer: data.filter((q) => q.type === "short_answer").length,
      matching: data.filter((q) => q.type === "matching").length,
    }),
    [data]
  );

  if (authLoading) return <LoadingState />;
  if (!session) return null;

  return (
    // Dark mode added: bg-gray-50 -> dark:bg-gray-900
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Link Kembali */}
          <Link
            href="/dashboard/quizzes"
            // Dark mode classes added: text-gray-600 -> dark:text-gray-400, hover:text-gray-900 -> hover:dark:text-gray-100
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-gray-100 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Kuis
          </Link>

          {/* Header Konten */}
          <div
            // Dark mode classes added: bg-white -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700
            className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div>
              {/* text-gray-900 -> dark:text-gray-100 */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Manajemen Pertanyaan
              </h1>
              {/* text-gray-600 -> dark:text-gray-400 */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                Untuk Kuis:{" "}
                <span className="font-semibold">
                  {quizInfo?.title || "Memuat..."}
                </span>
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

        {/* Statistik Ringkas */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: "Total Pertanyaan", value: stats.total },
            { label: "Pilihan Ganda", value: stats.multipleChoice },
            { label: "Isian Singkat", value: stats.shortAnswer },
            { label: "Menjodohkan", value: stats.matching },
          ].map((stat, index) => (
            <div
              key={index}
              // Dark mode classes added: bg-white -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {/* text-gray-500 -> dark:text-gray-400 */}
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
              {/* text-gray-900 -> dark:text-gray-100 */}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {stat.value}
              </h2>
            </div>
          ))}
        </motion.div>

        {/* Search Bar dan Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          // Dark mode classes added: bg-white -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700
          className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-4"
        >
          <div className="relative flex-grow w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* text-gray-400 -> dark:text-gray-500 */}
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Dark mode classes added: bg-white -> dark:bg-gray-900, border-gray-300 -> dark:border-gray-700, text-gray-900 -> dark:text-gray-100
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 dark:focus:border-yellow-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            // Dark mode classes added: bg-white -> dark:bg-gray-900, border-gray-300 -> dark:border-gray-700, text-gray-900 -> dark:text-gray-100
            className="w-full md:w-auto px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 dark:focus:border-yellow-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 transition-all"
          >
            <option value="">Semua Tipe</option>
            <option value="multiple_choice">Pilihan Ganda</option>
            <option value="short_answer">Isian Singkat</option>
            <option value="matching">Menjodohkan</option>
          </select>
        </motion.div>

        {/* Panel untuk Tabel Data */}
        <AnimatePresence mode="wait">
          {loadingData ? (
            <LoadingState key="loading" />
          ) : error ? (
            <ErrorState key="error" message={error} />
          ) : filteredData.length === 0 ? (
            <EmptyState key="empty" quizId={quizId} />
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              // Dark mode classes added: bg-white -> dark:bg-gray-800, border-gray-200 -> dark:border-gray-700
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