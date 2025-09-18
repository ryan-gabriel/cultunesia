// src/app/api/login/route.js
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

    // Login menggunakan Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Cek apakah user sudah verifikasi email
    if (!data.user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Silakan verifikasi email sebelum login" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      message: "Login berhasil",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
