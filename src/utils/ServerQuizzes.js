import { headers } from "next/headers";

/**
 * Fetch quizzes from the API (server-side)
 * @param {Object} options Optional filters, e.g., { province_slug: "jawa-barat", type: "province" }
 */
export async function fetchQuizzesServer(options = {}) {
  const { province_slug, type } = options;

  // Build absolute URL for server-side fetch
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let url = `${protocol}://${host}/api/admin/quizzes`;

  const queryParams = [];
  if (type) queryParams.push(`type=${encodeURIComponent(type)}`);
  if (province_slug)
    queryParams.push(`province_slug=${encodeURIComponent(province_slug)}`);
  if (queryParams.length) url += `?${queryParams.join("&")}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    let errData = {};
    try {
      errData = await res.json();
    } catch (e) {}
    throw new Error(errData?.error || "Gagal fetch quizzes");
  }

  const data = await res.json();
  return data.quizzes || [];
}

/**
 * Fetch a single quiz by ID along with its questions
 * @param {string} quizId - The quiz ID to fetch
 * @returns {Promise<Object>} { quiz, questions? }
 */
export async function fetchQuizWithQuestions(quizId) {
  if (!quizId) throw new Error("quizId wajib diisi");

  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}/api/admin/quizzes/${encodeURIComponent(
    quizId
  )}?include_questions=true`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    let errData = {};
    try {
      errData = await res.json();
    } catch (e) {}
    throw new Error(errData?.error || "Gagal fetch quiz");
  }

  const data = await res.json();
  return data; // { quiz, questions }
}
