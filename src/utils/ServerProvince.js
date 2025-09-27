import { headers } from "next/headers";

export async function fetchProvinceBySlug(slug) {
  if (!slug) throw new Error("Slug provinsi wajib diisi");

  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const url = `${protocol}://${host}/api/provinces/${encodeURIComponent(slug)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal fetch data provinsi");

  const data = await res.json();
  return data.province;
}