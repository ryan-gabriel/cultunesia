import QuizDetail from "@/components/page/province/QuizDetail";
import { fetchQuizWithQuestions } from "@/utils/ServerQuizzes";
import React from "react";

const page = async (context) => {
  const params = await context.params;
  const quizId = params["quiz-id"];
  const quiz = await fetchQuizWithQuestions(quizId);
  const submitUrl = `/api/admin/quizzes/${quizId}/answer`
  return <QuizDetail data={quiz} submitUrl={submitUrl}/>;
};

export default page;
