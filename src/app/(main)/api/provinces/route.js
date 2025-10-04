import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { uploadFileToStorage } from "@/utils/supabaseStorage";

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

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description") || null;
    const population = formData.get("population")
      ? Number(formData.get("population"))
      : null;
    const image = formData.get("image");

    if (!name) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }

    const slug = slugify(name); // buat slug dari nama

    let imageUrl = null;

    if (image && image.size > 0) {
      const timestamp = Date.now();
      imageUrl = await uploadFileToStorage(
        image,
        `provinces/${slug}-${timestamp}.${image.name.split(".").pop()}`
      );
    }

    const supabase = createServerClient();

    const { error: dbError, data } = await supabase.from("provinces").insert([
      {
        name,
        slug,
        description,
        population,
        image_url: imageUrl,
      },
    ]);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Province berhasil dibuat", data },
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
