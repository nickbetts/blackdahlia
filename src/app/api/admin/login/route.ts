import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminCookieMaxAgeSeconds,
  createAdminSessionToken,
  parseAdminSessionToken,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;

  const username = body?.username?.trim() || "";
  const password = body?.password?.trim() || "";

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid login credentials." }, { status: 401 });
  }

  const token = createAdminSessionToken(username);
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: adminCookieMaxAgeSeconds(),
  });

  return response;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));

  const token = tokenMatch ? tokenMatch.split("=").slice(1).join("=") : null;
  const session = parseAdminSessionToken(token);

  return NextResponse.json({ authenticated: Boolean(session), session });
}
