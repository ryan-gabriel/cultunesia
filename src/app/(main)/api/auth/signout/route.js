// src/app/api/signout/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const response = NextResponse.json({ message: "Sign out berhasil" });
    response.cookies.delete("sb-access-token", { path: "/" });
    response.cookies.delete("sb-refresh-token", { path: "/" });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal sign out" }, { status: 500 });
  }
}
