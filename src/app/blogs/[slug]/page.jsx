
import Navbar from "@/components/Navbar/Navbar";
import BlogDetail from "@/components/page/blogs/BlogDetail";
import { fetchBlogBySlug } from "@/utils/serverBlogs";
import React from "react";

const page = async ({ params }) => {
  const slug = params["slug"];
  const blog = await fetchBlogBySlug(slug);
  return (
    <div className="space-y-0">
      <Navbar />
      <BlogDetail data={blog} />
    </div>
  );
};

export default page;
