"use client";

import React, { useEffect, useState } from "react";
import QuizDetail from "@/components/page/province/QuizDetail";
import { fetchTodayQuiz } from "@/utils/quizzes";

export default function page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTodayQuiz();
        setData(data || []); // kalau backend return quizzes
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // jika backend return message (misal sudah pernah)
  if (data?.message) {
    return <p>{data.message}</p>;
  }
  console.log(data)
  // jika tidak ada quiz hari ini
  if (!data?.quiz || data.quiz.length === 0) {
    return <p>Tidak ada quiz hari ini</p>;
  }

  // ambil quiz pertama dari list untuk QuizDetail (atau sesuaikan logikamu)
  const quiz = data.quiz;
  const submitUrl = `/api/admin/quizzes/${quiz.quiz_id}/answer`;

  return <QuizDetail data={data} submitUrl={submitUrl} isDaily={true} />;
}
