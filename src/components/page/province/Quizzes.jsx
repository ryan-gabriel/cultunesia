"use client";
// contoh data
// [
//   {
//     quiz_id: '40d466a7-1862-41e6-a1cf-5f659425cab0',
//     title: 'Clothing',
//     category: 'province',
//     created_at: '2025-09-28T12:56:42.47425',
//     scheduled_date: null,
//     province_slug: 'jawa-barat'
//   }
// ]

// ada kemungkinan kaya gini datanya
// { message: 'Tidak ada quiz yang tersedia', quizzes: [] }

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Utility function to convert ISO date to a universal YYYY-MM-DD string
 * for consistent SSR rendering.
 * @param {string | null} iso
 * @returns {string} Universal date string or ISO date string.
 */
const getUniversalDateString = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toISOString().split('T')[0];
  } catch (e) {
    return iso;
  }
};

/**
 * Utility function for client-side locale formatting.
 * This should ONLY be called after mounting (inside useEffect or state initialization).
 * @param {string} isoDate - ISO 8601 date string.
 * @returns {string} Formatted date and time.
 */
const formatClientDate = (isoDate) => {
  if (!isoDate || isoDate === '—') return '—';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return isoDate;
  }
}

const slugToWords = (slug) => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const QuizDateDisplay = ({ isoDate }) => {
    // 1. SSR renders the universal (ISO) string
    const universalDate = getUniversalDateString(isoDate);
    
    // 2. Client uses state to hold the locale formatted string
    const [displayDate, setDisplayDate] = useState(universalDate);

    // 3. Update state only after client mounting
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const clientFormatted = formatClientDate(isoDate);
            setDisplayDate(clientFormatted);
        }
    }, [isoDate]);

    return (
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {displayDate}
        </span>
    );
};


const Quizzes = ({ data = [], provinceSlug }) => {
  const quizzes = Array.isArray(data) ? data : data?.quizzes ?? [];
  const emptyMessage = Array.isArray(data) ? null : data?.message ?? null;

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-gold), rgba(245,189,2,0.12))",
            }}
          >
            <MapPin className="w-6 h-6 text-black/80" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              Quiz Provinsi {slugToWords(provinceSlug)}
            </h2>
            <p className="text-sm text-slate-500">
              Temukan quiz budaya yang berfokus pada provinsi{" "}
              {slugToWords(provinceSlug)}.
            </p>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {quizzes.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="grid place-items-center p-12 bg-white/60 dark:bg-slate-900 rounded-2xl shadow border border-dashed border-slate-300 dark:border-slate-700"
          >
            <div className="text-center">
              <Badge className="mb-4" variant="outline">
                {emptyMessage ?? "Belum ada quiz"}
              </Badge>
              <p className="text-sm text-slate-500">
                Coba buat quiz baru atau cek filter provinsi.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {quizzes.map((q) => (
              <motion.article
                key={q.quiz_id || q.title || q.created_at}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{
                  translateY: -6,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="rounded-2xl overflow-hidden cursor-pointer"
              >
                <Link
                  href={`/${q.province_slug}/quizzes/${q.quiz_id}`}
                  className="block h-full"
                >
                  <Card className="h-full border-0 shadow-lg dark:bg-slate-800 dark:shadow-xl dark:shadow-slate-900/50">
                    <CardHeader className="p-5 pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                            <span
                              className="inline-flex items-center justify-center w-9 h-9 rounded-md flex-shrink-0"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(245,189,2,0.12), transparent)",
                              }}
                            >
                              <Play className="w-4 h-4 text-amber-500" />
                            </span>
                            <span className="truncate max-w-[150px] sm:max-w-none">
                              {q.title}
                            </span>
                          </h3>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="block text-xs text-slate-400">
                            Dibuat
                          </span>
                          {/* MENGGANTI PEMANGGILAN formatDate dengan komponen QuizDateDisplay */}
                          <QuizDateDisplay isoDate={q.created_at} />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-3 flex flex-col justify-between h-[calc(100%-70px)]">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          <span className="capitalize font-medium">
                            {q.province_slug?.replace(/-/g, " ") ??
                              "Semua Provinsi"}
                          </span>
                        </div>
                        {q.category && (
                          <Badge variant="secondary" className="text-xs">
                            {q.category === "daily" ? "Harian" : "Provinsi"}
                          </Badge>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-md"
                      >
                        Mulai Kuis <Play className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Quizzes;