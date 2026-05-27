import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ArtistSlug } from "@/content/studio";
import { createTimeOff } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { CreateTimeOffInput } from "@/lib/admin-types";

export const runtime = "nodejs";

function parseInput(payload: unknown): CreateTimeOffInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body is invalid.");
  }

  const body = payload as Record<string, unknown>;
  const artistSlug = String(body.artistSlug || "").trim();
  const startAt = String(body.startAt || "").trim();
  const endAt = String(body.endAt || "").trim();

  if (!artistSlug || !startAt || !endAt) {
    throw new Error("Missing required time-off fields.");
  }

  return {
    artistSlug: artistSlug as ArtistSlug,
    startAt,
    endAt,
    reason: String(body.reason || "").trim(),
  };
}

export async function POST(request: NextRequest) {
  const session = requireAdminApiSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const payload = await request.json().catch(() => null);
    const period = await createTimeOff(parseInput(payload));
    return NextResponse.json({ period }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create time-off period.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
