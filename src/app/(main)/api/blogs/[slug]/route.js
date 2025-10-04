import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { generateSlug } from "@/utils/blogs"; 
import { uploadFileToStorage } from "@/utils/supabaseStorage";

// =================== PUT ===================
export async function PUT(req, context) {
  const formData = await req.formData();
  const supabase = createServerClient();

  const params = await context.params;
  const slug = await params.slug;
  if (!slug) {
    return NextResponse.json({ error: "Slug wajib ada" }, { status: 400 });
  }

  const fields = {};
  for (const [key, value] of formData.entries()) {
    if (key !== "thumbnail") fields[key] = value;
  }

  // regenerate slug if title is updated
  if (fields.title) {
    fields.slug = generateSlug(fields.title);
  }

  // Get existing post by slug
  const { data: oldRecord, error: oldError } = await supabase
    .from("blogs")
    .select("id, thumbnail_url")
    .eq("slug", slug)
    .single();

  if (oldError || !oldRecord) {
    return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  }

  let thumbnailUrl = oldRecord.thumbnail_url;

  // Handle new thumbnail upload
  const newThumbnail = formData.get("thumbnail");
  if (newThumbnail && newThumbnail.size > 0) {
    let uploadPath;

    if (oldRecord.thumbnail_url) {
      // Replace old file
      const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/general/`;
      uploadPath = oldRecord.thumbnail_url.replace(publicUrlPrefix, "");
    } else {
      // New file path
      const timestamp = Date.now();
      const ext = newThumbnail.name.split(".").pop();
      uploadPath = `blogs/${timestamp}.${ext}`;
    }

    thumbnailUrl = await uploadFileToStorage(newThumbnail, uploadPath, "general", "replace");
  }

  // Update record (by id for safety)
  const { data, error } = await supabase
    .from("blogs")
    .update({
      ...fields,
      thumbnail_url: thumbnailUrl,
      slug: fields.slug || slug,
    })
    .eq("id", oldRecord.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Gagal mengupdate post" }, { status: 500 });
  }

  return NextResponse.json({ post: data });
}

// =================== DELETE ===================
export async function DELETE(req, context) {
  const supabase = createServerClient();
  const params = await context.params;
  const slug = await params.slug;

  if (!slug) {
    return NextResponse.json({ error: "Slug wajib ada" }, { status: 400 });
  }

  // Get post data by slug
  const { data: post } = await supabase
    .from("blogs")
    .select("id, thumbnail_url")
    .eq("slug", slug)
    .single();

  if (!post) {
    return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  }

  // Delete thumbnail from storage if exists
  if (post.thumbnail_url) {
    try {
      const bucket = "general";
      const publicUrlPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
      const filePath = post.thumbnail_url.replace(publicUrlPrefix, "");

      await supabase.storage.from(bucket).remove([filePath]);
    } catch (err) {
      console.error("Gagal hapus thumbnail:", err);
    }
  }

  // Delete post record
  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", post.id);

  if (error) {
    return NextResponse.json({ error: "Gagal menghapus post" }, { status: 500 });
  }

  return NextResponse.json({ message: "Post berhasil dihapus" });
}


export async function GET(req, context) {
  const supabase = createServerClient();
  
  // Extract slug from context params
  const params = await context.params;
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ error: "Slug wajib ada" }, { status: 400 });
  }

  try {
    // Fetch blog by slug
    const { data: blog, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      // Handle specific error cases
      if (error.code === 'PGRST116') {
        // No rows returned (not found)
        return NextResponse.json(
          { error: "Blog tidak ditemukan" },
          { status: 404 }
        );
      }
      
      // Other database errors
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Gagal memuat blog" },
        { status: 500 }
      );
    }

    // Return the blog data
    return NextResponse.json({ blog });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}