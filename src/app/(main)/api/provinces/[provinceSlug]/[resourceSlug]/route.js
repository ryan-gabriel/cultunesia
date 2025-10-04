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

const RESOURCES_WITHOUT_IMAGE = ["funfacts", "languages"];

export async function PUT(req, context) {
  const { provinceSlug, resourceSlug } = await context.params;

  if (!allowedResources.includes(resourceSlug)) {
    return NextResponse.json(
      { error: "Resource tidak ditemukan" },
      { status: 404 }
    );
  }

  const hasImage = !RESOURCES_WITHOUT_IMAGE.includes(resourceSlug);

  const supabase = createServerClient();
  const formData = await req.formData();

  const id = formData.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });

  const fields = {};
  for (const [key, value] of formData.entries()) {
    // Hanya masukkan kolom yang bukan "image" atau "id" ke dalam fields
    if (key !== "image" && key !== "id") fields[key] = value;
  }

  // --- Ambil record lama (cek exist + ambil image_url *HANYA JIKA* resource memiliki gambar) ---
  let selectFields = "id";
  if (hasImage) {
    selectFields += ", image_url"; // Tambahkan image_url jika resource memilikinya
  }

  const { data: oldRecord, error: oldError } = await supabase
    .from(resourceSlug)
    .select(selectFields) // Gunakan selectFields yang sudah disesuaikan
    .eq("id", id)
    .eq("province_slug", provinceSlug)
    .maybeSingle();

  if (oldError || !oldRecord) {
    return NextResponse.json(
      { error: "Data lama tidak ditemukan" },
      { status: 404 }
    );
  }

  // --- Opsional update image (HANYA jika resource memiliki gambar) ---
  if (hasImage) {
    const newImage = formData.get("image");
    if (newImage?.size > 0) {
      let uploadPath;
      // Periksa apakah oldRecord.image_url ada dan bukan null/undefined sebelum split
      if (oldRecord.image_url) {
        // Logika untuk mendapatkan path lama dari full URL Supabase
        const parts = oldRecord.image_url.split("/general/");
        // Pastikan parts[1] ada sebelum digunakan
        if (parts[1]) {
          uploadPath = parts[1];
        } else {
          // Fallback jika format URL tidak sesuai, buat path baru
          const ext = newImage.name.split(".").pop() || "png";
          uploadPath = `provinces/${provinceSlug}-${Date.now()}.${ext}`;
        }
      } else {
        // Buat path baru jika image_url kosong
        const ext = newImage.name.split(".").pop() || "png";
        uploadPath = `provinces/${provinceSlug}-${Date.now()}.${ext}`;
      }

      const imageUrl = await uploadFileToStorage(
        newImage,
        uploadPath,
        "general",
        "replace" // Asumsi 'replace' akan menimpa file di path yang sama
      );
      fields.image_url = imageUrl;
    }
  }

  // --- Lakukan Update ke Supabase ---
  const { data, error } = await supabase
    .from(resourceSlug)
    .update(fields)
    .eq("id", id)
    .eq("province_slug", provinceSlug)
    .select()
    .single();

  if (error) {
    console.error("Supabase Update Error:", error);
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

  const hasImage = !RESOURCES_WITHOUT_IMAGE.includes(resourceSlug);

  // Menggunakan req.json() untuk mendapatkan body request
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID wajib ada" }, { status: 400 });

  const supabase = createServerClient();

  // --- Ambil record (cek exist + ambil image_url *HANYA JIKA* resource memiliki gambar) ---
  let selectFields = "id";
  if (hasImage) {
    selectFields += ", image_url"; // Tambahkan image_url jika resource memilikinya
  }

  const { data: resourceItem, error: fetchError } = await supabase
    .from(resourceSlug)
    .select(selectFields) // Gunakan selectFields yang sudah disesuaikan
    .eq("id", id)
    .eq("province_slug", provinceSlug)
    .maybeSingle();


  if (fetchError || !resourceItem) {
    return NextResponse.json(
      { error: `${resourceSlug} tidak ditemukan` },
      { status: 404 }
    );
  }

  // --- Hapus file dari Storage (HANYA jika resource memiliki gambar) ---
  if (hasImage && resourceItem.image_url) {
    const bucket = "general";
    try {
      // Asumsi: process.env.NEXT_PUBLIC_SUPABASE_URL tersedia
      const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
      const filePath = resourceItem.image_url.replace(publicUrlPrefix, "");

      // Pastikan filePath tidak kosong sebelum mencoba menghapus
      if (filePath) {
        await supabase.storage.from(bucket).remove([filePath]);
      } else {
        console.warn(
          `File path kosong untuk resource: ${resourceSlug} dengan ID: ${id}`
        );
      }
    } catch (err) {
      // Log error, tapi lanjutkan penghapusan data
      console.error("Gagal hapus image dari storage:", err);
    }
  }

  // --- Hapus record dari Database ---
  const { error } = await supabase
    .from(resourceSlug)
    .delete()
    .eq("id", id)
    .eq("province_slug", provinceSlug);

  if (error) {
    console.error("Supabase Delete Error:", error);
    return NextResponse.json(
      { error: `Gagal menghapus ${resourceSlug}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: `${resourceSlug} berhasil dihapus` });
}
