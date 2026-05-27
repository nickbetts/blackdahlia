import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateEnquiry } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { ArtistSlug } from "@/content/studio";
import type { EnquiryStatus } from "@/lib/admin-types";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const session = requireAdminApiSession(request);

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const enquiryId = Number.parseInt(id, 10);

  if (!Number.isFinite(enquiryId)) {
    return NextResponse.json({ error: "Invalid enquiry ID." }, { status: 400 });
  }

  const payload = (await request.json().catch(() => null)) as
    | {
        status?: EnquiryStatus;
        assignedArtistSlug?: ArtistSlug | null;
        adminNotes?: string;
      }
    | null;

  if (!payload?.status) {
    return NextResponse.json({ error: "Status is required." }, { status: 400 });
  }

  try {
    const enquiry = await updateEnquiry(enquiryId, {
      status: payload.status,
      assignedArtistSlug: payload.assignedArtistSlug || null,
      adminNotes: payload.adminNotes || "",
    });

    return NextResponse.json({ enquiry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update enquiry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
