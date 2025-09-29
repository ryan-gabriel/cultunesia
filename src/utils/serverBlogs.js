import { headers } from "next/headers";

export async function fetchBlogs(options = {}) {
  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  let url = `${protocol}://${host}/api/blogs`;

  const params = new URLSearchParams();
  if (options.page) params.set("page", options.page.toString());
  if (options.limit) params.set("limit", options.limit.toString());

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }

  const data = await response.json();

  // kalau ada pagination, return keduanya
  if (data.pagination) {
    return { blogs: data.blogs, pagination: data.pagination };
  }

  // default tanpa pagination
  return { blogs: data.blogs };
}

export async function fetchBlogBySlug(slug) {
  if (!slug) throw new Error("Slug wajib diisi");

  const h = await headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}/api/blogs/${encodeURIComponent(slug)}`;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch blog");
  }

  const data = await response.json();
  return data.blog;
}

// Helper function tetap sama
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}
