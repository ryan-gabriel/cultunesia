/**
 * Fetch semua provinsi dari backend API
 * @returns {Promise<Array>} - array data provinsi
 */
export async function fetchProvinces() {
  const res = await fetch(`/api/province`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || "Gagal mengambil daftar provinsi");
  }

  const data = await res.json();
  return data.provinces; // pastikan backend mengembalikan { provinces: [...] }
}


/**
 * Fetch provinsi dari backend API
 * @param {string} slug - slug provinsi, contoh: "jawa-barat"
 * @returns {Promise<Object>} - data provinsi
 */
export async function fetchProvinceBySlug(slug) {
  if (!slug) throw new Error("Slug provinsi wajib diisi");

  const res = await fetch(`/api/province/${slug}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error || "Gagal mengambil provinsi");
  }

  const data = await res.json();
  return data.province;
}