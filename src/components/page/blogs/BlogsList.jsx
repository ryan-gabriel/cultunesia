//conoth data
// [
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

import React from "react";

const BlogsList = ({ blogs }) => {
  return (
    <ul className="space-y-4 mb-6">
      {blogs.map((blog) => (
        <li key={blog.id} className="border p-4 rounded bg-white shadow">
          <h2 className="text-lg font-semibold">{blog.title}</h2>
          <p className="text-gray-600 text-sm">{blog.description}</p>
          <span className="text-xs text-gray-400">
            {new Date(blog.created_at).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default BlogsList;
