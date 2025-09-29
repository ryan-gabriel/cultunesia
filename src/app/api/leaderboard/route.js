import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerClient();

  // ✅ Pakai RPC function untuk aggregate
  const { data, error } = await supabase.rpc("get_leaderboard", {
    limit_count: 10,
  });

  console.log(error);

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data leaderboard" },
      { status: 500 }
    );
  }

  // Format response
  const leaderboard = data.map((row) => ({
    user_id: row.user_id,
    full_name: row.full_name || "Unknown",
    avatar_url: row.avatar_url || null,
    total_score: row.total_score,
  }));

  return NextResponse.json({ leaderboard });
}
