/**
 * Fetch semua quizzes dari backend API
 * @returns {Promise<Array>} - array data quizzes
 */
export async function fetchQuizzes() {
  const res = await fetch(`/api/admin/quizzes`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || "Gagal mengambil daftar quizzes");
  }

  const data = await res.json();
  console.log(data);
  return data.quizzes || [];
}

/**
 * Fetch semua quizzes dari backend API
 * @returns {Promise<Array>} - array data quizzes
 */
export async function fetchQuestions(quizId) {
  const res = await fetch(`/api/admin/quizzes/${quizId}/questions`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || "Gagal mengambil daftar quizzes");
  }

  const data = await res.json();
  console.log(data);
  return data.questions || [];
}

/**
 * Fetch semua quizzes dari backend API
 * @returns {Promise<Array>} - array data quizzes
 */
export async function fetchQuestionById(quizId, questionId) {
  const res = await fetch(
    `/api/admin/quizzes/${quizId}/questions/${questionId}`
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || "Gagal mengambil daftar quizzes");
  }

  const data = await res.json();
  console.log(data);
  return data.question || [];
}