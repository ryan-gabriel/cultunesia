// File: src/utils/quizzes.js

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