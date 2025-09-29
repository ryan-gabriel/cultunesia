import Quizzes from "@/components/page/province/Quizzes";
import { fetchQuizzesServer } from "@/utils/ServerQuizzes";

import React from "react";

const page = async (context) => {
  const params = await context.params;
  const provinceSlug = params["province-slug"];
  const quizzes = await fetchQuizzesServer({
    type: "province",
    province_slug: provinceSlug,
  });
  return <Quizzes data={quizzes} />;
};

export default page;
