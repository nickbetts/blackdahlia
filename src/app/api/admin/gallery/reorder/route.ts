import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { reorderGalleryImages } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { ArtistSlug } from "@/content/studio";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = requireAdminApiSession(request);
  if (session instanceof NextResponse) return session;

  const payload = (await request.json().catch(() => null)) as
    | { artistSlug?: ArtistSlug; orderedIds?: number[] }
    | null;

  if (!payload?.artistSlug || !Array.isArray(payload.orderedIds)) {
    return NextResponse.json(
      { error: "artistSlug and orderedIds are required." },
      { status: 400 }
    );
  }

  try {
    const gallery = await reorderGalleryImages({
      artistSlug: payload.artistSlug,
      orderedIds: payload.orderedIds,
    });
    return NextResponse.json({ gallery });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not reorder gallery.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
