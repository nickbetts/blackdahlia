import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, parseAdminSessionToken, type AdminSession } from "@/lib/admin-auth";

export function adminSessionFromRequest(request: NextRequest): AdminSession | null {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return parseAdminSessionToken(token);
}

export function requireAdminApiSession(request: NextRequest): AdminSession | NextResponse {
  const session = adminSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return session;
}

export async function adminSessionFromServerCookies(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return parseAdminSessionToken(token);
}
