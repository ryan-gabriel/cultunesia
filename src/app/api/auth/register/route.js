import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { uploadFileToStorage } from "@/utils/supabaseStorage";

export async function POST(req) {
  try {
    // 1️⃣ Parse FormData (untuk mendukung file avatar)
    const formData = await req.formData();

    const fullName = formData.get("fullName");
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const avatar = formData.get("avatar"); // File, optional

    if (!email || !password || !fullName || !username) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 2️⃣ Buat user di Supabase Auth → kirim email konfirmasi otomatis
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username }, // simpan metadata user
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;
    let avatarUrl = null;

    // 3️⃣ Upload avatar ke storage (jika ada)
    if (avatar && avatar.size > 0) {
      avatarUrl = await uploadFileToStorage(avatar, `users/${userId}-avatar.png`);
    }

    // 4️⃣ Simpan data user ke tabel users (optional, bisa juga pakai metadata)
    const { error: dbError } = await supabase.from("profiles").insert([
      {
        id: userId,
        full_name: fullName,
        username,
        avatar_url: avatarUrl,
      },
    ]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message:
          "User berhasil dibuat. Silakan cek email untuk verifikasi sebelum login.",
        userId,
        avatarUrl,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
