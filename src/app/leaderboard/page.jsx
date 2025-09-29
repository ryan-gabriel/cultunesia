import Leaderboard from "@/components/page/leaderboard/Leaderboard";
import { fetchLeaderboard } from "@/utils/serverLeaderboard";
import React from "react";

const Page = async () => {
  const leaderboard = await fetchLeaderboard();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto mt-4">
        {JSON.stringify(leaderboard, null, 2)}
      </pre>
      <Leaderboard data={leaderboard} />
    </div>
  );
};

export default Page;
