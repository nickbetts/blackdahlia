import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ArtistSlug } from "@/content/studio";
import { upsertWeeklyRule } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { UpsertWeeklyRuleInput, WeekdayIndex } from "@/lib/admin-types";

export const runtime = "nodejs";

function parseInput(payload: unknown): UpsertWeeklyRuleInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body is invalid.");
  }

  const body = payload as Record<string, unknown>;
  const artistSlug = String(body.artistSlug || "").trim();
  const weekday = Number(body.weekday);
  const startTime = String(body.startTime || "").trim();
  const endTime = String(body.endTime || "").trim();
  const enabled = Boolean(body.enabled);

  if (!artistSlug || !startTime || !endTime) {
    throw new Error("Missing required weekly availability fields.");
  }

  return {
    artistSlug: artistSlug as ArtistSlug,
    weekday: weekday as WeekdayIndex,
    startTime,
    endTime,
    enabled,
  };
}

export async function PUT(request: NextRequest) {
  const session = requireAdminApiSession(request);
  if (session instanceof NextResponse) return session;

  try {
    const payload = await request.json().catch(() => null);
    const rule = await upsertWeeklyRule(parseInput(payload));
    return NextResponse.json({ rule });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save weekly rule.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
