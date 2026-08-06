import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getEnquiryImageBinary } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{ id: string; imageId: string }>;
};

export async function GET(request: NextRequest, { params }: RouteProps) {
  const session = requireAdminApiSession(request);

  if (session instanceof NextResponse) {
    return session;
  }

  const { id, imageId } = await params;
  const enquiryId = Number.parseInt(id, 10);
  const parsedImageId = Number.parseInt(imageId, 10);

  if (!Number.isFinite(enquiryId) || !Number.isFinite(parsedImageId)) {
    return NextResponse.json({ error: "Invalid enquiry image reference." }, { status: 400 });
  }

  try {
    const image = await getEnquiryImageBinary(enquiryId, parsedImageId);

    return new NextResponse(image.content, {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "private, max-age=600",
        "Content-Disposition": `inline; filename="${image.fileName}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load enquiry image.";

    if (message.toLowerCase().includes("not found")) {
      return NextResponse.json({ error: "Enquiry image not found." }, { status: 404 });
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
