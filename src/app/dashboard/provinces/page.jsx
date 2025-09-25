"use client";

import { columns } from "@/components/dataTable/provinces/columns";
import { DataTable } from "@/components/dataTable/provinces/data-table";
import { useAuth } from "@/context/AuthContext";
import { fetchProvinces } from "@/utils/province";
import { Plus, AlertCircle, Loader2, Search, Map } from "lucide-react"; // Impor ikon
import Link from "next/link";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// --- Komponen untuk UI State (Konsisten dengan halaman blog) ---
const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white rounded-xl shadow-inner py-12"
  >
    <Loader2 className="w-8 h-8 animate-spin mb-4 text-yellow-600" />
    <p className="text-lg font-medium">Memuat data provinsi...</p>
    <p className="text-sm text-gray-400 mt-1">Mohon tunggu sebentar.</p>
  </motion.div>
);

const ErrorState = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-xl text-red-700 p-8 text-center"
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
    className="flex flex-col items-center justify-center h-64 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 p-8 text-center"
  >
    <Map className="w-10 h-10 mb-4" />
    <p className="text-xl font-bold">Belum Ada Data Provinsi</p>
    <p className="text-md mt-2">Mulai tambahkan data provinsi pertama Anda.</p>
    <Link href={"/dashboard/provinces/create"} className="mt-6">
      <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors shadow-md">
        <Plus size={20} />
        <span>Tambah Provinsi Baru</span>
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
        const provinceData = await fetchProvinces();
        setData(provinceData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
    fetched.current = true;
  }, [session]);

  const handleDelete = async (province) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${province.name}?`)) return;

    try {
      const res = await fetch(`/api/provinces/${province.slug}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menghapus provinsi");
      toast("Provinsi berhasil dihapus", {
        description: "Perubahan berhasil disimpan",
        duration: 3000,
      });
      setData((prev) => prev.filter((p) => p.slug !== province.slug));
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
    return data.filter((province) =>
      province.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (authLoading) return <LoadingState />;
  if (!session) return null;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Halaman */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen Provinsi
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Kelola data provinsi yang akan ditampilkan di seluruh platform
              Cultunesia.
            </p>
          </div>
          <Link href={"/dashboard/provinces/create"}>
            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 font-semibold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors shadow-md">
              <Plus size={18} />
              <span>Tambah Provinsi Baru</span>
            </button>
          </Link>
        </motion.div>

        {/* Statistik Ringkas */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Provinsi
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {data.length}
              </h2>
            </div>
            <Map className="w-10 h-10 text-yellow-500 opacity-60" />
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari provinsi berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 transition-all"
            />
          </div>
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
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <DataTable
                columns={columns}
                data={filteredData}
                onDelete={handleDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Page;
