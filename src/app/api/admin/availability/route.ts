import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ArtistSlug } from "@/content/studio";
import { listTimeOff, listWeeklyAvailability } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = requireAdminApiSession(request);
  if (session instanceof NextResponse) return session;

  const url = new URL(request.url);
  const artistSlug = (url.searchParams.get("artistSlug") || undefined) as
    | ArtistSlug
    | undefined;

  try {
    const [weekly, timeOff] = await Promise.all([
      listWeeklyAvailability(artistSlug),
      listTimeOff({ artistSlug, limit: 500 }),
    ]);
    return NextResponse.json({ weekly, timeOff });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load availability.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
