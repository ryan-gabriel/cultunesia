import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Silakan verifikasi email sebelum login" },
        { status: 403 }
      );
    }

    const { access_token, refresh_token } = data.session;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const response = NextResponse.json({
      message: "Login berhasil",
      user: data.user,
      role: profile?.role || null,
      access_token,
      refresh_token,
    });

    // ⏳ Tentukan expiry cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 hari
    }
    // kalau tidak ada rememberMe → session cookie (hilang saat browser ditutup)

    response.cookies.set("sb-access-token", access_token, cookieOptions);
    response.cookies.set("sb-refresh-token", refresh_token, cookieOptions);

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
