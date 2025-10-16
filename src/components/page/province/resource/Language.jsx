"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Languages,
  MapPin,
  Calendar,
  Search,
  Sparkles,
  ChevronRight,
  Filter,
  Info,
} from "lucide-react";

export default function Language({ data }) {
  const [selectedLanguage, setSelectedLanguage] = useState(data.languages[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLanguages = data.languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedLanguage && !filteredLanguages.find(f => f.id === selectedLanguage.id)) {
      setSelectedLanguage(filteredLanguages[0] || null);
    }
  }, [searchQuery, selectedLanguage, filteredLanguages]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatProvinceName = (slug) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-200/20 dark:bg-yellow-500/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <motion.header
          className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
          initial={mounted ? { y: -100, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
                    <Languages className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Warisan Bahasa Daerah
                  </h1>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-16">
                  Khazanah linguistik dari berbagai provinsi di Indonesia
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                {data.languages.length} Bahasa
              </Badge>
            </div>
          </div>
        </motion.header>

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <motion.aside
              className="lg:col-span-4 xl:col-span-3"
              initial={mounted ? { opacity: 0, x: -20 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="sticky top-32 space-y-4">
                {/* Search */}
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Cari bahasa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 rounded-xl"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Daftar Bahasa */}
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Daftar Bahasa
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {filteredLanguages.length} dari {data.languages.length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                      <AnimatePresence mode="popLayout">
                        {filteredLanguages.map((lang, index) => (
                          <motion.div
                            key={lang.id}
                            initial={mounted ? { opacity: 0, x: -10 } : false}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => setSelectedLanguage(lang)}
                              className={`w-full text-left justify-start rounded-xl transition-all duration-300 h-auto p-3 ${
                                selectedLanguage?.id === lang.id
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30"
                                  : "hover:bg-amber-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              <div className="flex items-center space-x-3 w-full">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold truncate text-sm">
                                    {lang.name}
                                  </p>
                                  <div className="flex items-center gap-1 text-xs opacity-80">
                                    <MapPin className="w-3 h-3" />
                                    <p className="truncate">
                                      {formatProvinceName(lang.province_slug)}
                                    </p>
                                  </div>
                                </div>
                                {selectedLanguage?.id === lang.id && (
                                  <ChevronRight className="w-5 h-5 flex-shrink-0" />
                                )}
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.aside>

            {/* Konten Utama */}
            <motion.main
              className="lg:col-span-8 xl:col-span-9"
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {selectedLanguage ? (
                  <motion.div
                    key={selectedLanguage.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
                      {/* Header teks */}
                      <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
                        <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 mb-4">
                          <MapPin className="w-3 h-3 mr-2" />
                          {formatProvinceName(selectedLanguage.province_slug)}
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                          {selectedLanguage.name}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-amber-100">
                          <Calendar className="w-4 h-4" />
                          <p>{formatDate(selectedLanguage.created_at)}</p>
                        </div>
                      </div>

                      {/* Deskripsi dengan Dropcap */}
                      <CardContent className="p-8 sm:p-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full" />
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Tentang Bahasa
                          </h2>
                        </div>
                        <div
                          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-semibold prose-p:text-gray-700 dark:prose-p:text-gray-300 first-letter:text-7xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left"
                          dangerouslySetInnerHTML={{
                            __html: selectedLanguage.description,
                          }}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="flex items-center justify-center min-h-[400px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-dashed border-gray-300 dark:border-gray-700 shadow-lg">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <Info className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Tidak ada bahasa yang dipilih
                        </h3>
                        <p className="text-sm">
                          Pilih bahasa dari daftar di sebelah kiri untuk melihat detailnya.
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.main>
          </div>
        </div>
      </div>
    </>
  );
}
