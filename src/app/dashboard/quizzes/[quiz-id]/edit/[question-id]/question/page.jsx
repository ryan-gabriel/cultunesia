"use client";

import QuestionForm from "@/components/forms/quizzes/QuestionForm";
import { fetchQuestionById } from "@/utils/quizzes";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  const quizId = params["quiz-id"];
  const questionId = params["question-id"];
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const result = await fetchQuestionById(quizId, questionId);
        setData(result);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch question.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const onSubmit = async (formData) => {
    router.replace(`/dashboard/quizzes/${quizId}`);
  };

  if (loading) return <div>Loading question...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <QuestionForm quizId={quizId} onSubmit={onSubmit} initialData={data} />
    </div>
  );
};

export default Page;
