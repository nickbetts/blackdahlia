import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { deleteGalleryImage, updateGalleryImage } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { ArtistSlug } from "@/content/studio";

export const runtime = "nodejs";

type RouteProps = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const id = Number.parseInt(raw, 10);
  return Number.isFinite(id) ? id : null;
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const session = requireAdminApiSession(request);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const imageId = parseId(id);
  if (!imageId) {
    return NextResponse.json({ error: "Invalid image ID." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { alt?: string; position?: number; artistSlug?: ArtistSlug }
    | null;

  if (!payload) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    const image = await updateGalleryImage(imageId, {
      alt: payload.alt,
      position: payload.position,
      artistSlug: payload.artistSlug,
    });
    return NextResponse.json({ image });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update image.";
    const status = message.toLowerCase().includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  const session = requireAdminApiSession(request);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const imageId = parseId(id);
  if (!imageId) {
    return NextResponse.json({ error: "Invalid image ID." }, { status: 400 });
  }

  try {
    await deleteGalleryImage(imageId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete image.";
    const status = message.toLowerCase().includes("not found") ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
