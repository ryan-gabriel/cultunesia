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

  const image = formData.get("image");
  const body = {};
  formData.forEach((value, key) => {
    if (key !== "image") body[key] = value;
  });

  let imageUrl = null;
  if (image && image.size > 0) {
    const timestamp = Date.now();
    const ext = image.name.split(".").pop();
    const path = `provinces/${provinceSlug}-${timestamp}.${ext}`;
    imageUrl = await uploadFileToStorage(image, path);
    console.log(imageUrl)
  }

  const { data, error } = await supabase
    .from(resourceSlug)
    .insert([{ ...body, province_id: province.id, image_url: imageUrl }])
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

  // ====== Ambil province ======
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

  // ====== Ambil formData ======
  const formData = await req.formData();
  const id = formData.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });

  const fields = {};
  for (const [key, value] of formData.entries()) {
    if (key !== "image") fields[key] = value;
  }

  // ====== Ambil data lama ======
  const { data: oldRecord, error: oldError } = await supabase
    .from(resourceSlug)
    .select("image_url")
    .eq("id", id)
    .single();

  if (oldError || !oldRecord) {
    return NextResponse.json(
      { error: "Data lama tidak ditemukan" },
      { status: 404 }
    );
  }

  let imageUrl = oldRecord.image_url;

  
  // ====== Handle upload image baru (replace lama) ======
  const newImage = formData.get("image");
  if (newImage && newImage.size > 0) {
    let uploadPath;

    if (oldRecord.image_url) {
      // pakai path lama (supaya replace)
      const parts = oldRecord.image_url.split("/general/");
      uploadPath = parts[1]; // ex: "provinces/jawa-barat-1758331749152.png"
    } else {
      uploadPath = `provinces/${provinceSlug}-${Date.now()}.png`;
    }
    console.log(uploadPath)
    imageUrl = await uploadFileToStorage(newImage, uploadPath, "general", "replace");
  }

  // ====== Update DB ======
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
  if (!id) {
    return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });
  }

  const supabase = createServerClient();

  // Pastikan provinsi ada
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

  // Ambil resource yang mau dihapus (untuk ambil image_url)
  const { data: resourceItem } = await supabase
    .from(resourceSlug)
    .select("image_url")
    .eq("id", id)
    .eq("province_id", province.id)
    .single();

  // Kalau ada gambar, hapus juga dari storage
  if (resourceItem?.image_url) {
    const bucket = "general"
    try {
      // Ambil relative path dari URL public
      const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
      const filePath = resourceItem.image_url.replace(publicUrlPrefix, "");

      await supabase.storage.from(bucket).remove([filePath]);
    } catch (err) {
      console.error("Gagal hapus image:", err);
    }
  }

  // Hapus record di tabel
  const { error } = await supabase
    .from(resourceSlug)
    .delete()
    .eq("id", id)
    .eq("province_id", province.id);

  if (error) {
    return NextResponse.json(
      { error: `Gagal menghapus ${resourceSlug}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: `${resourceSlug} berhasil dihapus` });
}
