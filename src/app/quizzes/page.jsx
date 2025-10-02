"use client";

import React, { useEffect, useState } from "react";
import QuizDetail from "@/components/page/province/QuizDetail";
import { fetchTodayQuiz } from "@/utils/quizzes";
import NoQuizToday from "@/components/page/quizzes/NoQuizToday";
import QuizCompletionNotice from "@/components/page/quizzes/QuizCompletionNotice";
import NoUserLogin from "@/components/page/quizzes/NoUserLogin";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar/Navbar";
import StatusDisplay from "@/components/page/quizzes/StatusDisplay";

export default function page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        setUserData(userData);
        const data = await fetchTodayQuiz();
        setData(data || []);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <StatusDisplay type="loading" />;
  if (error) return <StatusDisplay type="error" message={error} />;

  if (!userData || !userData.user) return <NoUserLogin />;
  // jika backend return message (misal sudah pernah)
  if (data?.already_completed) {
    return <QuizCompletionNotice data={data} />;
  }
  console.log(data);
  // jika tidak ada quiz hari ini
  if (!data?.quiz || data.quiz.length === 0) {
    return <NoQuizToday data={data} />;
  }

  // ambil quiz pertama dari list untuk QuizDetail (atau sesuaikan logikamu)
  const quiz = data.quiz;
  const submitUrl = `/api/admin/quizzes/${quiz.quiz_id}/answer`;

  return <QuizDetail data={data} submitUrl={submitUrl} isDaily={true} />;
}
