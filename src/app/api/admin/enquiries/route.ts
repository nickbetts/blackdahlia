import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createEnquiry, listEnquiries } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { CreateEnquiryInput } from "@/lib/admin-types";

export const runtime = "nodejs";

function parseCreateEnquiryInput(payload: unknown): CreateEnquiryInput {
  const body = payload as Record<string, unknown>;

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const instagram = String(body.instagram || "").trim();
  const styleDirection = String(body.styleDirection || "").trim();
  const sizeAndPlacement = String(body.sizeAndPlacement || "").trim();
  const concept = String(body.concept || "").trim();

  if (!firstName || !lastName || !styleDirection || !sizeAndPlacement || !concept) {
    throw new Error("Missing required enquiry fields.");
  }

  if (!email && !phone && !instagram) {
    throw new Error("Please provide at least one contact method: email, phone, or Instagram.");
  }

  return {
    firstName,
    lastName,
    email,
    phone,
    instagram,
    pronouns: String(body.pronouns || "").trim(),
    dateOfBirth: String(body.dateOfBirth || "").trim(),
    preferredDate: String(body.preferredDate || "").trim(),
    availabilityWindow: String(body.availabilityWindow || "").trim(),
    budgetRange: String(body.budgetRange || "").trim(),
    preferredArtist: String(body.preferredArtist || "").trim(),
    isCoverUp: Boolean(body.isCoverUp),
    styleDirection,
    sizeAndPlacement,
    referenceLinks: String(body.referenceLinks || "").trim(),
    medicalNotes: String(body.medicalNotes || "").trim(),
    concept,
  };
}

export async function GET(request: NextRequest) {
  const session = requireAdminApiSession(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const items = await listEnquiries(200);
    return NextResponse.json({ enquiries: items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load enquiries.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const enquiry = await createEnquiry(parseCreateEnquiryInput(payload));
    return NextResponse.json({ enquiry }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit enquiry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
