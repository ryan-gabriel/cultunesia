import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { uploadFileToStorage } from "@/utils/supabaseStorage";

const allowedResources = [
  "ethnic_groups",
  "foods",
  "funfacts",
  "languages",
  "tourism",
  "traditional_clothing",
  "quizzes",
];

// =================== GET ===================
export async function GET(req, context) {
  const { provinceSlug, resourceSlug } = await context.params;

  if (!allowedResources.includes(resourceSlug)) {
    return NextResponse.json(
      { error: "Resource tidak ditemukan" },
      { status: 404 }
    );
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from(resourceSlug)
    .select("*")
    .eq("province_slug", provinceSlug);

  if (error) {
    return NextResponse.json(
      { error: `Gagal memuat ${resourceSlug}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ [resourceSlug]: data || [] });
}

// =================== POST ===================
export async function POST(req, context) {
  const { provinceSlug, resourceSlug } = await context.params;
  if (!allowedResources.includes(resourceSlug)) {
    return NextResponse.json(
      { error: "Resource tidak ditemukan" },
      { status: 404 }
    );
  }

  const supabase = createServerClient();
  const formData = await req.formData();

  // cek provinsi exist
  const { count, error: provinceError } = await supabase
    .from("provinces")
    .select("*", { head: true, count: "exact" })
    .eq("slug", provinceSlug);

  if (provinceError || count === 0) {
    return NextResponse.json(
      { error: "Provinsi tidak ditemukan" },
      { status: 404 }
    );
  }

  // kumpulkan field
  const body = {};
  formData.forEach((value, key) => {
    if (key !== "image") body[key] = value;
  });

  // opsional image
  const image = formData.get("image");
  if (image?.size > 0) {
    const ext = image.name.split(".").pop();
    const path = `provinces/${provinceSlug}-${Date.now()}.${ext}`;
    const imageUrl = await uploadFileToStorage(image, path);
    body.image_url = imageUrl; // hanya tambah kalau ada
  }

  const { data, error } = await supabase
    .from(resourceSlug)
    .insert([{ ...body, province_slug: provinceSlug }])
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Gagal menambahkan ${resourceSlug}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ [resourceSlug]: data });
}

// =================== PUT ===================
export async function PUT(req, context) {
  const { provinceSlug, resourceSlug } = await context.params;
  if (!allowedResources.includes(resourceSlug)) {
    return NextResponse.json(
      { error: "Resource tidak ditemukan" },
      { status: 404 }
    );
  }

  const supabase = createServerClient();
  const formData = await req.formData();

  const id = formData.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });

  const fields = {};
  for (const [key, value] of formData.entries()) {
    if (key !== "image" && key !== "id") fields[key] = value;
  }

  // ambil record lama (cek exist + ambil image_url kalau ada)
  const { data: oldRecord, error: oldError } = await supabase
    .from(resourceSlug)
    .select("id, image_url")
    .eq("id", id)
    .eq("province_slug", provinceSlug)
    .maybeSingle();

  if (oldError || !oldRecord) {
    return NextResponse.json(
      { error: "Data lama tidak ditemukan" },
      { status: 404 }
    );
  }

  // opsional update image
  const newImage = formData.get("image");
  if (newImage?.size > 0) {
    let uploadPath;
    if (oldRecord.image_url) {
      const parts = oldRecord.image_url.split("/general/");
      uploadPath = parts[1];
    } else {
      const ext = newImage.name.split(".").pop() || "png";
      uploadPath = `provinces/${provinceSlug}-${Date.now()}.${ext}`;
    }
    const imageUrl = await uploadFileToStorage(
      newImage,
      uploadPath,
      "general",
      "replace"
    );
    fields.image_url = imageUrl;
  }

  const { data, error } = await supabase
    .from(resourceSlug)
    .update(fields)
    .eq("id", id)
    .eq("province_slug", provinceSlug)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Gagal mengupdate ${resourceSlug}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ [resourceSlug]: data });
}

// =================== DELETE ===================
export async function DELETE(req, context) {
  const { provinceSlug, resourceSlug } = await context.params;
  if (!allowedResources.includes(resourceSlug)) {
    return NextResponse.json(
      { error: "Resource tidak ditemukan" },
      { status: 404 }
    );
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });

  const supabase = createServerClient();

  // ambil record (cek exist + ambil image_url kalau ada)
  const { data: resourceItem, error: fetchError } = await supabase
    .from(resourceSlug)
    .select("id, image_url")
    .eq("id", id)
    .eq("province_slug", provinceSlug)
    .maybeSingle();

  if (fetchError || !resourceItem) {
    return NextResponse.json(
      { error: `${resourceSlug} tidak ditemukan` },
      { status: 404 }
    );
  }

  // hapus file kalau memang ada image_url
  if (resourceItem.image_url) {
    const bucket = "general";
    try {
      const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
      const filePath = resourceItem.image_url.replace(publicUrlPrefix, "");
      await supabase.storage.from(bucket).remove([filePath]);
    } catch (err) {
      console.error("Gagal hapus image:", err);
    }
  }

  const { error } = await supabase
    .from(resourceSlug)
    .delete()
    .eq("id", id)
    .eq("province_slug", provinceSlug);

  if (error) {
    return NextResponse.json(
      { error: `Gagal menghapus ${resourceSlug}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: `${resourceSlug} berhasil dihapus` });
}
