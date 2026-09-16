import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createGalleryImage, listGalleryImages } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { ArtistSlug } from "@/content/studio";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const session = requireAdminApiSession(request);
  if (session instanceof NextResponse) return session;

  const artistSlug = request.nextUrl.searchParams.get("artist");

  try {
    const gallery = await listGalleryImages(
      artistSlug ? (artistSlug as ArtistSlug) : undefined
    );
    return NextResponse.json({ gallery });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load gallery.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const session = requireAdminApiSession(request);
  if (session instanceof NextResponse) return session;

  let payload: {
    artistSlug?: ArtistSlug;
    alt?: string;
    mimeType?: string;
    byteSize?: number;
    base64Data?: string;
    width?: number | null;
    height?: number | null;
  } | null = null;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload?.artistSlug || !payload.mimeType || !payload.base64Data || !payload.byteSize) {
    return NextResponse.json(
      { error: "Missing required fields: artistSlug, mimeType, byteSize, base64Data." },
      { status: 400 }
    );
  }

  if (payload.byteSize > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Image is larger than the 8MB limit." },
      { status: 413 }
    );
  }

  try {
    const image = await createGalleryImage({
      artistSlug: payload.artistSlug,
      alt: payload.alt,
      mimeType: payload.mimeType,
      byteSize: payload.byteSize,
      base64Data: payload.base64Data,
      width: payload.width ?? null,
      height: payload.height ?? null,
    });
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save image.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
