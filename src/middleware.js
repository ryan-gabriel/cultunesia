import { createServerClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("sb-access-token")?.value;
  const url = req.nextUrl.clone();

  // redirect kalau belum login
  if (!token) {
    if (
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/settings")
    ) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // buat Supabase server client
  const supabase = createServerClient({ req, res: undefined });

  // ambil user dari token
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // cek role di table profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    // bukan admin, redirect ke halaman lain
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/settings", "/settings/:path*"],
};
