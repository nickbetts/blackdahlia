import { NextResponse } from "next/server";
import { getGalleryImageBinary } from "@/lib/admin-db";

export const runtime = "nodejs";

type RouteProps = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteProps) {
  const { id } = await params;
  const imageId = Number.parseInt(id, 10);

  if (!Number.isFinite(imageId)) {
    return NextResponse.json({ error: "Invalid image ID." }, { status: 400 });
  }

  try {
    const image = await getGalleryImageBinary(imageId);
    if (!image) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    return new NextResponse(Buffer.from(image.content), {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": String(image.byteSize),
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
