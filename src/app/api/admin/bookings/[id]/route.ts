import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateBooking } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { BookingStatus, UpdateBookingInput } from "@/lib/admin-types";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{ id: string }>;
};

function parseUpdateBookingInput(payload: unknown): UpdateBookingInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body is invalid.");
  }

  const body = payload as Record<string, unknown>;
  const update: UpdateBookingInput = {};

  if (typeof body.startAt === "string" && body.startAt.trim().length > 0) {
    update.startAt = body.startAt.trim();
  }

  if (typeof body.endAt === "string" && body.endAt.trim().length > 0) {
    update.endAt = body.endAt.trim();
  }

  if (typeof body.status === "string" && body.status.trim().length > 0) {
    update.status = body.status.trim() as BookingStatus;
  }

  if (typeof body.notes === "string") {
    update.notes = body.notes;
  }

  if (Object.keys(update).length === 0) {
    throw new Error("At least one booking field is required.");
  }

  return update;
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const session = requireAdminApiSession(request);

  if (session instanceof NextResponse) {
    return session;
  }

  const { id } = await params;
  const bookingId = Number.parseInt(id, 10);

  if (!Number.isFinite(bookingId)) {
    return NextResponse.json({ error: "Invalid booking ID." }, { status: 400 });
  }

  try {
    const payload = await request.json().catch(() => null);
    const booking = await updateBooking(bookingId, parseUpdateBookingInput(payload));
    return NextResponse.json({ booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update booking.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
