// contoh data
// {
//   "id": "6ad6b567-c644-4a1b-af25-77c1e89506a4",
//   "user_id": null,
//   "title": "asdasdasd",
//   "content": "<p>asdasdas3e413ewdasdas</p>\r\n<p>das</p>\r\n<p>d</p>\r\n<p>asda</p>",
//   "thumbnail_url": "https://rdmrruoujekrgxrejigz.supabase.co/storage/v1/object/public/general/blogs/1759137976566.png",
//   "created_at": "2025-09-29T09:26:17.497307+00:00",
//   "updated_at": "2025-09-29T09:26:17.497307+00:00",
//   "slug": "asdasdasd",
//   "description": "asdasdasdasdasd"
// }

import React from "react";

const BlogDetail = ({ data }) => {
  return (
    <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto mt-4">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default BlogDetail;
