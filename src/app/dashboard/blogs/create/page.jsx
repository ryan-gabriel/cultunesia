"use client";

import BlogForm from "@/components/forms/provinces/BlogForm";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();

  const handleSuccess = (data) => {
    console.log(data)
    router.replace("/dashboard/blogs")
  };

  return (
    <div>
      <BlogForm onSuccess={handleSuccess}/>
    </div>
  );
};

export default page;
