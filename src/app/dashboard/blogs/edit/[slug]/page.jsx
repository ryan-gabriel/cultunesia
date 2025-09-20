"use client";

import BlogForm from "@/components/forms/provinces/BlogForm";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const slug = params['slug']
  const router = useRouter();

  const handleSuccess = (data) => {
    console.log(data);
    router.replace("/dashboard/blogs");
  };

  return (
    <div>
      <BlogForm onSuccess={handleSuccess} slug={slug} />
    </div>
  );
};

export default page;
