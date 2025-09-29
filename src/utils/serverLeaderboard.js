import { headers } from "next/headers";

export async function fetchLeaderboard() {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let url = `${protocol}://${host}/api/leaderboard`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }

  const data = await response.json();

  return data.leaderboard; // sesuai endpoint GET tadi
}
