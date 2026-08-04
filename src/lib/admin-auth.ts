import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "iny_admin";

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "ineedyou-dev-secret"
  );
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "ineedyou-admin";
}

export function sessionToken() {
  return createHash("sha256")
    .update(`${getAdminPassword()}:${secret()}`)
    .digest("hex");
}

export function verifyPassword(password: string) {
  const expected = getAdminPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return false;
  const expected = sessionToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function adminCookieOptions() {
  return {
    name: COOKIE,
    value: sessionToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearAdminCookieOptions() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
