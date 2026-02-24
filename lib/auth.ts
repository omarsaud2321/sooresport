import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "soor_admin";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

export function isAdminAuthed(): boolean {
  const c = cookies().get(COOKIE_NAME)?.value;
  return !!c && c === "1";
}

export async function login(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) throw new Error("Missing ADMIN_PASSWORD_HASH in env");
  const ok = await bcrypt.compare(password, hash);
  if (ok) {
    cookies().set(COOKIE_NAME, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: MAX_AGE_SEC,
      path: "/"
    });
  }
  return ok;
}

export function logout() {
  cookies().set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
}
