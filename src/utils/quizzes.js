// File: src/utils/quizzes.js

import { supabase } from "@/lib/supabaseClient";

/**
 * Fetch semua quizzes dari backend API
 * @returns {Promise<Array>} - array data quizzes
 */
export async function fetchQuizzes() {
  const res = await fetch(`/api/admin/quizzes`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || "Gagal mengambil daftar kuis");
  }
  const data = await res.json();
  return data.quizzes || [];
}

// FUNGSI BARU DITAMBAHKAN DI SINI
/**
 * Fetch detail satu kuis berdasarkan ID
 * @param {string} quizId - ID dari kuis yang akan diambil
 * @returns {Promise<Object>} - objek data kuis
 */
export async function fetchQuizById(quizId) {
  const res = await fetch(`/api/admin/quizzes/${quizId}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || "Gagal mengambil detail kuis");
  }
  const data = await res.json();
  return data.quiz || null;
}

/**
 * Fetch semua pertanyaan untuk satu kuis
 * @param {string} quizId - ID dari kuis
 * @returns {Promise<Array>} - array data pertanyaan
 */
export async function fetchQuestions(quizId) {
  const res = await fetch(`/api/admin/quizzes/${quizId}/questions`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || "Gagal mengambil daftar pertanyaan");
  }
  const data = await res.json();
  return data.questions || [];
}

/**
 * Fetch detail satu pertanyaan berdasarkan ID
 * @param {string} quizId - ID dari kuis
 * @param {string} questionId - ID dari pertanyaan
 * @returns {Promise<Object>} - objek data pertanyaan
 */
export async function fetchQuestionById(quizId, questionId) {
  const res = await fetch(
    `/api/admin/quizzes/${quizId}/questions/${questionId}`
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || "Gagal mengambil detail pertanyaan");
  }
  const data = await res.json();
  return data.question || null;
}

export async function fetchTodayQuiz() {
  // 1. ambil user_id dari Supabase Auth
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("User belum login");
  const userId = data.user.id;

  // 2. bangun query params
  const params = new URLSearchParams();
  params.set("today", "true");
  params.set("user_id", userId); // kirim user_id ke backend

  // 3. panggil endpoint
  const res = await fetch(`/api/admin/quizzes?${params.toString()}`, {
    cache: "no-store", // optional: supaya selalu fresh
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error || "Gagal fetch today quiz");
  }

  const dataRes = await res.json();
  return dataRes; // { quizzes } atau { message: "Sudah pernah ..." }
}