"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palmtree, // Ikon utama untuk pariwisata
  MapPin,
  Calendar,
  Search,
  Sparkles,
  ChevronRight,
  Filter,
  Info,
  FileText, // Ikon untuk tab deskripsi
} from "lucide-react";

// Contoh Data (jika diperlukan untuk pengujian)
// const sampleData = {
//   tourism: [
//     {
//       id: 1,
//       name: "Kawah Putih",
//       description: "<p>Kawah Putih adalah sebuah danau kawah vulkanik di Jawa Barat, Indonesia, sekitar 50 km sebelah selatan Kota Bandung...</p>",
//       created_at: "2025-10-01T10:30:00.000Z",
//       province_slug: "jawa-barat",
//       image_url: "https://images.unsplash.com/photo-1585278713455-23c347f7d9f7?q=80&w=2070&auto=format&fit=crop",
//       street_view_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.423985160982!2d107.40051231529688!3d-7.16957809483325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e688d0e51b1a7cd%3A0x47b8f2d5a37f014e!2sKawah%20Putih!5e0!3m2!1sen!2sid!4v1664627471234!5m2!1sen!2sid",
//       maps_url: null,
//     }
//   ]
// };

export default function Tourism({ data }) {
  const [selectedTour, setSelectedTour] = useState(data.tourism[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTours = data.tourism.filter((tour) =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedTour && !filteredTours.find(f => f.id === selectedTour.id)) {
      setSelectedTour(filteredTours[0] || null);
    }
  }, [searchQuery, selectedTour, filteredTours]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatProvinceName = (slug) => {
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300 relative overflow-hidden">
        {/* Decorative Background */}
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
                    <Palmtree className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Destinasi Wisata Nusantara
                  </h1>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-16">
                  Jelajahi keindahan alam dan budaya Indonesia
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                {data.tourism.length} Destinasi
              </Badge>
            </div>
          </div>
        </motion.header>

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
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Cari destinasi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-gray-800 rounded-xl focus:ring-amber-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Daftar Destinasi
                      </h3>
                      <span className="text-xs text-gray-500">{filteredTours.length} dari {data.tourism.length}</span>
                    </div>
                    <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                      <AnimatePresence mode="popLayout">
                        {filteredTours.map((tour, index) => (
                          <motion.div
                            key={tour.id}
                            layout
                            initial={mounted ? { opacity: 0, x: -10 } : false}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => setSelectedTour(tour)}
                              className={`w-full text-left justify-start rounded-xl transition-all h-auto p-3 ${
                                selectedTour?.id === tour.id
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30"
                                  : "hover:bg-amber-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              <div className="flex items-center space-x-3 w-full">
                                <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-white/20 shadow-md">
                                  <img src={tour.image_url} alt={tour.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold truncate text-sm">{tour.name}</p>
                                  <div className="flex items-center gap-1 text-xs opacity-80">
                                    <MapPin className="w-3 h-3" />
                                    <p className="truncate">{formatProvinceName(tour.province_slug)}</p>
                                  </div>
                                </div>
                                {selectedTour?.id === tour.id && <ChevronRight className="w-5 h-5 flex-shrink-0" />}
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

            {/* Main Content */}
            <motion.main
              className="lg:col-span-8 xl:col-span-9"
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {selectedTour ? (
                  <motion.div
                    key={selectedTour.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="overflow-hidden shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                      <div className="relative h-64 sm:h-80 lg:h-[28rem] overflow-hidden group">
                        <motion.img
                          src={selectedTour.image_url}
                          alt={selectedTour.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 mb-4">
                              <MapPin className="w-3 h-3 mr-2" />{formatProvinceName(selectedTour.province_slug)}
                            </Badge>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">{selectedTour.name}</h1>
                            <div className="flex items-center gap-2 text-amber-100">
                              <Calendar className="w-4 h-4" /><p className="text-sm">{formatDate(selectedTour.created_at)}</p>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <Tabs defaultValue="description" className="w-full">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
                            <TabsTrigger value="description"><FileText className="w-4 h-4 mr-2"/>Deskripsi</TabsTrigger>
                            <TabsTrigger value="maps"><MapPin className="w-4 h-4 mr-2"/>Peta Lokasi</TabsTrigger>
                          </TabsList>
                        </div>
                        <TabsContent value="description" className="p-6 sm:p-8">
                           <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedTour.description }}/>
                        </TabsContent>
                        <TabsContent value="maps" className="p-4 sm:p-6">
                            {mounted && (selectedTour.street_view_url || selectedTour.maps_url) ? (
                                <iframe
                                    src={selectedTour.street_view_url || selectedTour.maps_url}
                                    className="w-full h-[500px] border-0 rounded-2xl shadow-lg"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            ) : (
                                <div className="flex items-center justify-center h-[500px] bg-gray-100 dark:bg-gray-800/50 rounded-2xl">
                                  <p className="text-gray-500">Peta tidak tersedia.</p>
                                </div>
                            )}
                        </TabsContent>
                      </Tabs>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <Card className="flex items-center justify-center min-h-[400px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-dashed shadow-lg">
                      <div className="text-center text-gray-500">
                        <Info className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                        <h3 className="text-lg font-semibold">Tidak ada destinasi yang dipilih</h3>
                        <p className="text-sm">Pilih destinasi dari daftar di kiri untuk melihat detailnya.</p>
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