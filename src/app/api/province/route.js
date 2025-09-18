import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerClient();

  const { data: provinces, error } = await supabase
    .from("provinces")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil daftar provinsi" },
      { status: 500 }
    );
  }

  return NextResponse.json({ provinces });
}
