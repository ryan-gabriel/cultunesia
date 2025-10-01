import Navbar from "@/components/Navbar/Navbar";
import Leaderboard from "@/components/page/leaderboard/Leaderboard";
import { fetchLeaderboard } from "@/utils/serverLeaderboard";
import React from "react";

const Page = async () => {
  const leaderboard = await fetchLeaderboard();

  return (
    <> 
      <Navbar />
      <div className="p-6">
        <Leaderboard data={leaderboard} />
      </div>
    </> 
  );
};

export default Page;