import { headers } from "next/headers";

export async function fetchProvinceBySlug(slug, options = {}) {
  if (!slug) throw new Error("Slug provinsi wajib diisi");

  const { include = [] } = options; // e.g. include: ["funfacts", "tourism"]

  const h = await headers(); // ✅ await first
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const query = include.length ? `?include=${include.join(",")}` : "";
  const url = `${protocol}://${host}/api/provinces/${encodeURIComponent(
    slug
  )}${query}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal fetch data provinsi");

  const data = await res.json();
  return data; // return whole response (province + extras)
}

const allowed_resource = [
  "tourism",
  "languages",
  "foods",
  "ethnic_groups",
  "traditional_clothing",
];

export async function fetchProvinceResource(provinceSlug, resource) {
  if (!provinceSlug) throw new Error("Slug provinsi wajib diisi");
  if (!resource) throw new Error("Resource wajib diisi");
  if (!allowed_resource.includes(resource)) {
    throw new Error(`Resource tidak valid: ${resource}`);
  }

  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}/api/provinces/${encodeURIComponent(
    provinceSlug
  )}/${encodeURIComponent(resource)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Gagal fetch resource provinsi");

  const data = await res.json();
  return data;
}
