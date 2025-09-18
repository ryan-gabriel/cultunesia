import { createServerClient } from "@/lib/supabaseServer";
import sharp from "sharp";

/**
 * Upload file ke Supabase Storage bucket
 * @param {File|Blob} file - file dari FormData
 * @param {string} path - path di bucket (misal: "users/userId-avatar.png")
 * @param {string} bucket - nama bucket, default: "avatars"
 * @returns {string|null} publicUrl atau null jika gagal
 */
export async function uploadFileToStorage(file, path, bucket="general") {
  if (!file || file.size === 0) return null;

  const supabase = createServerClient();

  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true, // otomatis timpa kalau path sama
    });

  if (error) {
    console.error("Supabase upload error:", error.message);
    return null;
  }

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).data
    .publicUrl;

  return publicUrl;
}


/**
 * Replace image file di Supabase Storage tanpa mengubah URL
 * Semua image akan dikonversi ke PNG dulu
 * @param {File|Blob} file - file baru
 * @param {string} path - path file di bucket (misal: "provinces/jawa-barat.png")
 * @param {string} bucket - nama bucket
 * @returns {string|null} publicUrl atau null jika gagal
 */
export async function replaceFile(file, path, bucket = "general") {
  if (!file || file.size === 0) return null;

  const supabase = createServerClient();

  // convert file ke buffer
  const arrayBuffer = await file.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);

  // jika file bukan PNG, convert pakai sharp
  if (file.type !== "image/png") {
    try {
      buffer = await sharp(buffer).png().toBuffer();
      // ubah ekstensi path menjadi .png
      path = path.replace(/\.[^/.]+$/, ".png");
    } catch (err) {
      console.error("Error converting image to PNG:", err);
      return null;
    }
  }

  // upload dengan opsi upsert=true supaya menimpa file lama
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error("Supabase replaceFile error:", error.message);
    return null;
  }

  // dapatkan public URL
  const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data
    .publicUrl;

  return publicUrl;
}
