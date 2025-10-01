import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 🔑 Login pakai Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 🚨 pastikan email sudah terverifikasi
    if (!data.user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Silakan verifikasi email sebelum login" },
        { status: 403 }
      );
    }

    const { access_token, refresh_token } = data.session;

    // 🔍 Ambil role dari profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id) // id user dari auth
      .single();

    if (profileError) {
      console.error(profileError);
      return NextResponse.json(
        { error: "Gagal mengambil role user" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      message: "Login berhasil",
      user: data.user,
      role: profile?.role || null, // role ikut dikirim
      access_token,
      refresh_token,
    });

    response.cookies.set("sb-access-token", access_token, { httpOnly: true });
    response.cookies.set("sb-refresh-token", refresh_token, { httpOnly: true });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
