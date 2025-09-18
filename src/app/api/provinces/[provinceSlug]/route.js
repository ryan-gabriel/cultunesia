import { createServerClient } from "@/lib/supabaseServer";
import { replaceFile } from "@/utils/supabaseStorage";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { provinceSlug } = params;

  const supabase = createServerClient();

  const { data: province, error } = await supabase
    .from("provinces")
    .select("*")
    .eq("slug", provinceSlug)
    .single();

  if (error || !province) {
    return NextResponse.json(
      { error: "Provinsi tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ province });
}

export async function PUT(req, { params }) {
  try {
    const { provinceSlug: slug } = params;
    console.log(slug);
    if (!slug)
      return NextResponse.json({ error: "Slug wajib diisi" }, { status: 400 });

    const formData = await req.formData();
    console.log(formData);
    const name = formData.get("name");
    const description = formData.get("description") || null;
    const population = formData.get("population")
      ? Number(formData.get("population"))
      : null;
    const image = formData.get("image"); // optional

    if (!name)
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });

    const supabase = createServerClient();

    // ambil provinsi lama dulu
    const { data: oldProvince, error: fetchError } = await supabase
      .from("provinces")
      .select("*")
      .eq("slug", slug)
      .single();

    if (fetchError || !oldProvince) {
      return NextResponse.json(
        { error: "Provinsi tidak ditemukan" },
        { status: 404 }
      );
    }

    let imageUrl = oldProvince.image_url;

    // replace image jika ada
    if (image && image.size > 0) {
      // gunakan replaceFile supaya URL tetap sama
      const path = oldProvince.image_url
        ?.split("/storage/v1/object/public/")[1] // ambil path di bucket dari publicUrl
        ?.split("?")[0]; // hapus query string kalau ada

      if (path) {
        imageUrl = await replaceFile(image, path, "general");
      }
    }

    // update database
    const { data, error: updateError } = await supabase
      .from("provinces")
      .update({
        name,
        description,
        population,
        image_url: imageUrl,
      })
      .eq("slug", slug);

    if (updateError)
      return NextResponse.json({ error: updateError.message }, { status: 400 });

    return NextResponse.json({
      message: "Provinsi berhasil diupdate",
      province: data,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { provinceSlug: slug } = params;

    if (!slug)
      return NextResponse.json({ error: "Slug wajib diisi" }, { status: 400 });

    const supabase = createServerClient();

    // ambil provinsi dulu untuk cek dan hapus image jika ada
    const { data: province, error: fetchError } = await supabase
      .from("provinces")
      .select("*")
      .eq("slug", slug)
      .single();

    if (fetchError || !province) {
      return NextResponse.json(
        { error: "Provinsi tidak ditemukan" },
        { status: 404 }
      );
    }

    // hapus image di storage kalau ada
    if (province.image_url) {
      const path = province.image_url
        .split("/storage/v1/object/public/")[1]
        ?.split("?")[0];
      if (path) {
        try {
          await supabase.storage.from("general").remove([path]);
        } catch (err) {
          console.error("Gagal hapus image:", err);
          // jangan return error, lanjut hapus database
        }
      }
    }

    // hapus data provinsi di database
    const { error: deleteError } = await supabase
      .from("provinces")
      .delete()
      .eq("slug", slug);

    if (deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 400 });

    return NextResponse.json({
      message: "Provinsi berhasil dihapus",
      slug,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
