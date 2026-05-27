import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ArtistSlug } from "@/content/studio";
import { createBooking, listBookings } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { BookingStatus, CreateBookingInput } from "@/lib/admin-types";

export const runtime = "nodejs";

function parseCreateBookingInput(payload: unknown): CreateBookingInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body is invalid.");
  }

  const body = payload as Record<string, unknown>;

  const artistSlug = String(body.artistSlug || "").trim();
  const clientName = String(body.clientName || "").trim();
  const clientEmail = String(body.clientEmail || "").trim();
  const startAt = String(body.startAt || "").trim();
  const endAt = String(body.endAt || "").trim();

  if (!artistSlug || !clientName || !clientEmail || !startAt || !endAt) {
    throw new Error("Missing required booking fields.");
  }

  const enquiryIdRaw = body.enquiryId;

  return {
    artistSlug: artistSlug as ArtistSlug,
    clientName,
    clientEmail,
    startAt,
    endAt,
    enquiryId:
      typeof enquiryIdRaw === "number"
        ? enquiryIdRaw
        : typeof enquiryIdRaw === "string" && enquiryIdRaw
          ? Number.parseInt(enquiryIdRaw, 10)
          : null,
    status: body.status ? (String(body.status) as BookingStatus) : "scheduled",
    notes: String(body.notes || "").trim(),
  };
}

export async function GET(request: NextRequest) {
  const session = requireAdminApiSession(request);

  if (session instanceof NextResponse) {
    return session;
  }

  const url = new URL(request.url);
  const artistSlug = url.searchParams.get("artistSlug") || undefined;
  const startAt = url.searchParams.get("startAt") || undefined;
  const endAt = url.searchParams.get("endAt") || undefined;

  try {
    const bookings = await listBookings({
      artistSlug: artistSlug as ArtistSlug | undefined,
      startAt,
      endAt,
      limit: 500,
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load bookings.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const session = requireAdminApiSession(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const payload = await request.json();
    const booking = await createBooking(parseCreateBookingInput(payload));
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create booking.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
