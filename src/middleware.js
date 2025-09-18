import { NextResponse } from "next/server";

export function middleware(req) {
    console.log('testing middleware')
  const token = req.cookies.get("sb-access-token")?.value;
  const url = req.nextUrl.clone();

  if (!token && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
