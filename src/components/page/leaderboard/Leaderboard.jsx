// contoh data
// [
//   {
//     "user_id": "f31be36e-1d8f-45a4-ae02-7ff24ea2216f",
//     "full_name": "Ryan Gabriel Siringoringo",
//     "avatar_url": "https://rdmrruoujekrgxrejigz.supabase.co/storage/v1/object/public/general/users/f31be36e-1d8f-45a4-ae02-7ff24ea2216f-avatar.png",
//     "total_score": 1
//   }
// ]

import React from "react";

const Leaderboard = ({ data }) => {
  const leaderboard = data;
  return (
    <ul className="space-y-3">
      {leaderboard.map((user, index) => (
        <li
          key={user.user_id}
          className="flex items-center gap-4 p-3 border rounded-md bg-gray-50"
        >
          <span className="font-bold w-6">{index + 1}.</span>
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{user.full_name}</p>
            <p className="text-sm text-gray-500">Skor: {user.total_score}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Leaderboard;
