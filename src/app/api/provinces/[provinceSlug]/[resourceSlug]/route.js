import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { uploadFileToStorage, replaceFile } from "@/utils/supabaseStorage";

const allowedResources = [
  "ethnic_groups",
  "foods",
  "funfacts",
  "languages",
  "tourism",
  "traditional_clothing",
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

  const { data: province, error: provinceError } = await supabase
    .from("provinces")
    .select("id")
    .eq("slug", provinceSlug)
    .single();

  if (provinceError || !province) {
    return NextResponse.json(
      { error: "Provinsi tidak ditemukan" },
      { status: 404 }
    );
  }

  const { data, error } = await supabase
    .from(resourceSlug)
    .select("*")
    .eq("province_id", province.id);

  if (error)
    return NextResponse.json(
      { error: `Gagal memuat ${resourceSlug}` },
      { status: 500 }
    );

  return NextResponse.json({ [resourceSlug]: data });
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

  const formData = await req.formData();
  const supabase = createServerClient();

  const { data: province, error: provinceError } = await supabase
    .from("provinces")
    .select("id")
    .eq("slug", provinceSlug)
    .single();

  if (provinceError || !province) {
    return NextResponse.json(
      { error: "Provinsi tidak ditemukan" },
      { status: 404 }
    );
  }

  // Ambil file image dan fields lainnya
  const image = formData.get("image");
  const body = {};
  formData.forEach((value, key) => {
    if (key !== "image") body[key] = value;
  });

  let imageUrl = null;
  if (image && image.size > 0) {
    const timestamp = Date.now();
    imageUrl = await uploadFileToStorage(
      image,
      `provinces/${provinceSlug}-${timestamp}.${image.name.split(".").pop()}`
    );
  }

  const { data, error } = await supabase
    .from(resourceSlug)
    .insert([{ ...body, province_id: province.id, image_url: imageUrl }])
    .select()
    .single();

  if (error)
    return NextResponse.json(
      { error: `Gagal menambahkan ${resourceSlug}` },
      { status: 500 }
    );

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

  const { data: province, error: provinceError } = await supabase
    .from("provinces")
    .select("id")
    .eq("slug", provinceSlug)
    .single();

  if (provinceError || !province) {
    return NextResponse.json(
      { error: "Provinsi tidak ditemukan" },
      { status: 404 }
    );
  }

  // ================== Ambil formData ==================
  const formData = await req.formData();
  const id = formData.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });

  // Ambil semua field kecuali image
  const fields = {};
  for (const [key, value] of formData.entries()) {
    if (key !== "image") fields[key] = value;
  }

  // Ambil record lama
  const { data: oldRecord, error: oldError } = await supabase
    .from(resourceSlug)
    .select("image_url")
    .eq("id", id)
    .single();

  if (oldError) {
    return NextResponse.json(
      { error: "Data lama tidak ditemukan" },
      { status: 404 }
    );
  }

  let imageUrl = oldRecord.image_url;

  // ================== Handle upload image ==================
  const newImage = formData.get("image");
  if (newImage && newImage.size > 0) {
    const path = oldRecord.image_url
      ?.split("/storage/v1/object/public/")[1]
      ?.split("?")[0];

    if (path) {
      imageUrl = await replaceFile(newImage, path, "general");
    }
  }

  // ================== Update record ==================
  const { data, error } = await supabase
    .from(resourceSlug)
    .update({ ...fields, image_url: imageUrl })
    .eq("id", id)
    .eq("province_id", province.id)
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

  const { data: province, error: provinceError } = await supabase
    .from("provinces")
    .select("id")
    .eq("slug", provinceSlug)
    .single();

  if (provinceError || !province) {
    return NextResponse.json(
      { error: "Provinsi tidak ditemukan" },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from(resourceSlug)
    .delete()
    .eq("id", id)
    .eq("province_id", province.id);

  if (error)
    return NextResponse.json(
      { error: `Gagal menghapus ${resourceSlug}` },
      { status: 500 }
    );

  return NextResponse.json({ message: `${resourceSlug} berhasil dihapus` });
}
