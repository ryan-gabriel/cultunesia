// src/app/blogs/page.jsx

import Navbar from "@/components/Navbar/Navbar";
import BlogsList from "@/components/page/blogs/BlogsList";
import { fetchBlogs } from "@/utils/serverBlogs";

export default async function Page(context) {
  const searchParams = await context.searchParams;
  const page = parseInt(searchParams?.page || "1", 10);
  const limit = parseInt(searchParams?.limit || "6", 10);

  let initialData = { blogs: [], pagination: {} };

  try {
    const data = await fetchBlogs({ page, limit });
    if (!data) throw new Error("Gagal memuat data blog");
    initialData = data
  } catch (err) {
    console.error("Fetch blog error:", err.message);
  }

  return (
    <>
      <Navbar />
      <BlogsList data={initialData} page={page} limit={limit} />
    </>
  );
}
