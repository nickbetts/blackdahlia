import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ArtistSlug } from "@/content/studio";
import { listAvailabilityWindows } from "@/lib/admin-db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const artistSlug = (url.searchParams.get("artistSlug") || undefined) as
    | ArtistSlug
    | undefined;
  const fromDate = url.searchParams.get("fromDate") || undefined;
  const daysParam = url.searchParams.get("days");
  const days = daysParam ? Number.parseInt(daysParam, 10) : undefined;

  try {
    const slots = await listAvailabilityWindows({
      artistSlug,
      fromDate,
      days,
    });

    return NextResponse.json({ slots });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load artist availability.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
