// contoh data 
// {
//   "blogs": [
//     {
//       "id": "6ad6b567-c644-4a1b-af25-77c1e89506a4",
//       "title": "asdasdasd",
//       "description": "asdasdasdasdasd",
//       "created_at": "2025-09-29T09:26:17.497307+00:00",
//       "updated_at": "2025-09-29T09:26:17.497307+00:00",
//       "thumbnail_url": "https://rdmrruoujekrgxrejigz.supabase.co/storage/v1/object/public/general/blogs/1759137976566.png",
//       "slug": "asdasdasd"
//     }
//   ],
//   "total": 1,
//   "page": 1,
//   "limit": 5,
//   "totalPages": 1
// }

import BlogsList from "@/components/page/blogs/BlogsList";
import { fetchBlogs } from "@/utils/serverBlogs";
import React from "react";

const Page = async ({ searchParams }) => {
  try {
    // ambil page & limit dari query string, kasih default
    const page = parseInt(searchParams?.page || "1", 10);
    const limit = parseInt(searchParams?.limit || "5", 10);

    const { blogs, pagination } = await fetchBlogs({ page, limit });
    const { totalPages, total } = pagination;

    if (!blogs || blogs.length === 0) {
      return (
        <div className="p-6 text-gray-600">Belum ada blog yang tersedia.</div>
      );
    }

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Daftar Blog</h1>

        <BlogsList blogs={blogs}/>

        {/* tampilkan pagination info */}
        <div className="text-sm text-gray-500">
          Halaman {page} dari {totalPages} ({total} total blog, {limit} per
          halaman)
        </div>

        {/* debug json */}
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto mt-4">
          {JSON.stringify({ blogs, total, page, limit, totalPages }, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return <div className="p-6 text-red-600">Gagal memuat daftar blog.</div>;
  }
};

export default Page;
