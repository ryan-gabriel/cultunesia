import { createServerClient } from "@/lib/supabaseServer";

/**
 * Upload file ke Supabase Storage bucket "general"
 * @param {File|Blob} file - file dari FormData
 * @param {string} path - path di bucket (misal: "provinces/jawa-barat.png")
 * @param {string} bucket - nama bucket (default: "general")
 * @param {"create"|"replace"} type - mode upload (create=upload baru, replace=update)
 * @returns {string|null} publicUrl atau null jika gagal
 */
export async function uploadFileToStorage(
  file,
  path,
  bucket = "general",
  type = "create"
) {
  if (!file || file.size === 0) return null;

  const supabase = createServerClient();
  const arrayBuffer = await file.arrayBuffer();

  let data, error;

  if (type === "create") {
    ({ data, error } = await supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, {
        upsert: true,
        cacheControl: "0",
      }));
  }

  if (type === "replace") {
    ({ data, error } = await supabase.storage
      .from(bucket)
      .update(path, arrayBuffer, {
        upsert: true,
        cacheControl: "0",
      }));
  }

  if (error) {
    console.error("Supabase upload error:", error.message);
    return null;
  }

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
