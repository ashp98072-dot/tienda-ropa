import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  verifyPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  if (!body.password || !verifyPassword(body.password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const cookie = adminCookieOptions();
  res.cookies.set(cookie.name, cookie.value, cookie);
  return res;
}
