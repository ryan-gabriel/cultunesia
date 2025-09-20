import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { uploadFileToStorage } from "@/utils/supabaseStorage";
import { generateSlug } from "@/utils/blogs";

// =================== GET ===================
export async function GET() {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from("blogs")
    .select("id, title, description, created_at, updated_at, thumbnail_url, slug")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat post" },
      { status: 500 }
    );
  }

  return NextResponse.json({ blogs: data });
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
    .insert([{ 
      ...body, 
      thumbnail_url: thumbnailUrl,
      // Ensure slug is included even if it was generated
      slug: body.slug 
    }])
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