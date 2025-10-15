"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UtensilsCrossed,
  MapPin,
  Calendar,
  Search,
  Sparkles,
  ChevronRight,
  Filter,
  ChefHat,
  Info,
} from "lucide-react";

export default function Food({ data }) {
  const [selectedFood, setSelectedFood] = useState(data.foods[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredFoods = data.foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedFood && !filteredFoods.find((f) => f.id === selectedFood.id)) {
      setSelectedFood(filteredFoods[0] || null);
    }
  }, [searchQuery, selectedFood, filteredFoods]);

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
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Kuliner Tradisional Nusantara
                  </h1>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-16">
                  Cita rasa khas dari berbagai daerah di Indonesia
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0 shadow-lg px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                {data.foods.length} Hidangan
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
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Cari makanan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-gray-800 rounded-xl focus:ring-amber-500"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Daftar Makanan */}
                <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Daftar Makanan
                      </h3>
                      <span className="text-xs text-gray-500">
                        {filteredFoods.length} dari {data.foods.length}
                      </span>
                    </div>
                    <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                      <AnimatePresence mode="popLayout">
                        {filteredFoods.map((food, index) => (
                          <motion.div
                            key={food.id}
                            initial={mounted ? { opacity: 0, x: -10 } : false}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Button
                              variant="ghost"
                              onClick={() => setSelectedFood(food)}
                              className={`w-full text-left justify-start rounded-xl transition-all h-auto p-3 ${
                                selectedFood?.id === food.id
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30"
                                  : "hover:bg-amber-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              <div className="flex items-center space-x-3 w-full">
                                <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-white/20 shadow-md">
                                  <img
                                    src={food.image_url}
                                    alt={food.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold truncate text-sm">
                                    {food.name}
                                  </p>
                                  <div className="flex items-center gap-1 text-xs opacity-80">
                                    <MapPin className="w-3 h-3" />
                                    <p className="truncate">
                                      {formatProvinceName(food.province_slug)}
                                    </p>
                                  </div>
                                </div>
                                {selectedFood?.id === food.id && (
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
                {selectedFood ? (
                  <motion.div
                    key={selectedFood.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Card className="overflow-hidden shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
                      {/* Gambar Header */}
                      <div className="relative h-64 sm:h-80 lg:h-[28rem] overflow-hidden">
                        <motion.img
                          src={selectedFood.image_url}
                          alt={selectedFood.name}
                          className="w-full h-full object-cover"
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/20">
                          <UtensilsCrossed className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Deskripsi */}
                      <CardContent className="p-8 sm:p-10">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-4 font-semibold">
                            <MapPin className="w-4 h-4" />
                            {formatProvinceName(selectedFood.province_slug)}
                          </div>
                          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                            {selectedFood.name}
                          </h1>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-8">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(selectedFood.created_at)}</span>
                          </div>

                          {/* Huruf pertama besar dan tebal */}
                          <div
                            className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-headings:font-semibold first-letter:text-7xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left"
                            dangerouslySetInnerHTML={{
                              __html: selectedFood.description,
                            }}
                          />
                        </motion.div>
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
                    <Card className="flex items-center justify-center h-[28rem] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-dashed shadow-lg">
                      <div className="text-center text-gray-500">
                        <Info className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                        <h3 className="text-lg font-semibold">
                          Tidak ada makanan yang dipilih
                        </h3>
                        <p className="text-sm">
                          Pilih makanan dari daftar di sebelah kiri untuk melihat
                          detailnya.
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
