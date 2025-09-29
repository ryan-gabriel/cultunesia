import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { uploadFileToStorage } from "@/utils/supabaseStorage";
import { generateSlug } from "@/utils/blogs";

// =================== GET ===================
export async function GET(req) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "0", 10); // default 0 → tidak ada pagination
  const limit = parseInt(searchParams.get("limit") || "0", 10);

  // Mode tanpa pagination → ambil semua blogs
  if (page === 0 || limit === 0) {
    const { data, error } = await supabase
      .from("blogs")
      .select(
        "id, title, description, created_at, updated_at, thumbnail_url, slug"
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Gagal memuat post" }, { status: 500 });
    }

    return NextResponse.json({ blogs: data });
  }

  // 🔹 Hitung total rows (cepat karena head:true)
  const { count, error: countError } = await supabase
    .from("blogs")
    .select("id", { count: "exact", head: true });

  if (countError) {
    return NextResponse.json(
      { error: "Gagal menghitung total" },
      { status: 500 }
    );
  }

  const total = count || 0;
  let totalPages = Math.ceil(total / limit);

  // 🔹 Minimal 1 halaman meski total = 0
  if (totalPages === 0) {
    totalPages = 1;
  }

  // Kalau page > totalPages → return kosong
  if (page > totalPages) {
    return NextResponse.json({
      blogs: [],
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  }

  // 🔹 Hitung range aman
  const from = (page - 1) * limit;
  let to = from + limit - 1;
  if (to >= total) to = total - 1;

  // 🔹 Ambil data sesuai range
  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title, description, created_at, updated_at, thumbnail_url, slug"
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: "Gagal memuat post" }, { status: 500 });
  }

  return NextResponse.json({
    blogs: data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
}

// =================== POST ===================
export async function POST(req) {
  const formData = await req.formData();
  const supabase = createServerClient();

  const thumbnail = formData.get("thumbnail");
  const body = {};
  formData.forEach((value, key) => {
    if (key !== "thumbnail") body[key] = value;
  });

  // Generate slug from title if not provided
  if (!body.slug && body.title) {
    body.slug = generateSlug(body.title);
  }

  let thumbnailUrl = null;
  if (thumbnail && thumbnail.size > 0) {
    const timestamp = Date.now();
    const ext = thumbnail.name.split(".").pop();
    const path = `blogs/${timestamp}.${ext}`;
    thumbnailUrl = await uploadFileToStorage(thumbnail, path);
  }

  const { data, error } = await supabase
    .from("blogs")
    .insert([
      {
        ...body,
        thumbnail_url: thumbnailUrl,
        // Ensure slug is included even if it was generated
        slug: body.slug,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Gagal menambahkan post" },
      { status: 500 }
    );
  }

  return NextResponse.json({ post: data });
}
