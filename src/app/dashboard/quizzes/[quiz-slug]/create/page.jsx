"use client";

import QuestionForm from "@/components/forms/quizzes/QuestionForm";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const quizId = params["quiz-id"];
  const router = useRouter();

  const onSubmit = async (data) => {
    router.replace(`/dashboard/quizzes/${quizId}`);
  };

  return (
    <div>
      <QuestionForm quizId={quizId} onSubmit={onSubmit} />
    </div>
  );
};

export default page;
