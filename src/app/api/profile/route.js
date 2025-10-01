import { createServerClient } from "@/lib/supabaseServer";
import { uploadFileToStorage } from "@/utils/supabaseStorage";
import { NextResponse } from "next/server";

export async function GET(req) {
  const supabase = createServerClient();

  // Ambil token dari header
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];
  console.log("token:", token);

  if (!token) {
    return NextResponse.json({ error: "Token tidak ada" }, { status: 401 });
  }

  // Ambil user dari token
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: "User tidak valid" }, { status: 401 });
  }

  // Query profile sesuai user.id
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({ profile });
}

export async function PUT(request) {
  const supabase = createServerClient();

  // 🔑 Ambil token dari header
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Token tidak ada" }, { status: 401 });
  }

  // 🔑 Ambil user dari token
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: "User tidak valid" }, { status: 401 });
  }

  try {
    // 2️⃣ Ambil FormData
    const formData = await request.formData();
    const username = formData.get("username");
    const full_name = formData.get("full_name");
    const newAvatar = formData.get("avatar"); // File optional

    // 3️⃣ Ambil profile lama (untuk ambil avatar_url lama)
    const { data: oldProfile, error: profileError } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Gagal mengambil profile lama" },
        { status: 500 }
      );
    }

    let imageUrl = oldProfile?.avatar_url || null;

    // 4️⃣ Kalau ada avatar baru → replace / buat path baru
    if (newAvatar && newAvatar.size > 0) {
      let uploadPath;

      if (imageUrl) {
        // Replace file lama → ambil path dari URL publik
        const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/general/`;
        uploadPath = imageUrl.replace(publicUrlPrefix, "");
      } else {
        // Buat path baru
        const timestamp = Date.now();
        const ext = newAvatar.name.split(".").pop();
        uploadPath = `users/${user.id}-${timestamp}.${ext}`;
      }

      imageUrl = await uploadFileToStorage(
        newAvatar,
        uploadPath,
        "general",
        "replace"
      );
    }

    // 5️⃣ Update profile
    const { error: updateError, data: updated } = await supabase
      .from("profiles")
      .update({
        username,
        full_name,
        ...(imageUrl && { avatar_url: imageUrl }),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Profile berhasil diperbarui", profile: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
