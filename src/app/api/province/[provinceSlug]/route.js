import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { provinceSlug } = params;

  const supabase = createServerClient();

  const { data: province, error } = await supabase
    .from("provinces")
    .select("*")
    .eq("slug", provinceSlug)
    .single();

  if (error || !province) {
    return NextResponse.json(
      { error: "Provinsi tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ province });
}
