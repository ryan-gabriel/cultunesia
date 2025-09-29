import React from "react";

// contoh data
// [
//   {
//     quiz_id: '40d466a7-1862-41e6-a1cf-5f659425cab0',
//     title: 'Clothing',
//     category: 'province',
//     created_at: '2025-09-28T12:56:42.47425',
//     scheduled_date: null,
//     province_slug: 'jawa-barat'
//   }
// ]

// ada kemungkinan kaya gini datanya
// { message: 'Tidak ada quiz yang tersedia', quizzes: [] }

const Quizzes = ({ data }) => {
  console.log(data);
  return <div>testing</div>;
};

export default Quizzes;
