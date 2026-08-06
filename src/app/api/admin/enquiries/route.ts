import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createEnquiry, listEnquiries } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";
import type { CreateEnquiryInput } from "@/lib/admin-types";

export const runtime = "nodejs";

const MAX_ENQUIRY_IMAGES = 6;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_IMAGE_BYTES = 24 * 1024 * 1024;

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

function parseCreateEnquiryInput(payload: unknown): CreateEnquiryInput {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body is invalid.");
  }

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

function normalizeUploadName(file: File, index: number): string {
  const source = file.name?.trim() || `reference-${index + 1}`;
  return source.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 240) || `reference-${index + 1}`;
}

async function parseCreateEnquiryFromMultipart(formData: FormData): Promise<CreateEnquiryInput> {
  const payload: Record<string, unknown> = {
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    instagram: String(formData.get("instagram") || ""),
    pronouns: String(formData.get("pronouns") || ""),
    dateOfBirth: String(formData.get("dateOfBirth") || ""),
    preferredDate: String(formData.get("preferredDate") || ""),
    availabilityWindow: String(formData.get("availabilityWindow") || ""),
    budgetRange: String(formData.get("budgetRange") || ""),
    preferredArtist: String(formData.get("preferredArtist") || ""),
    isCoverUp: String(formData.get("isCoverUp") || "").toLowerCase() === "true",
    styleDirection: String(formData.get("styleDirection") || ""),
    sizeAndPlacement: String(formData.get("sizeAndPlacement") || ""),
    referenceLinks: String(formData.get("referenceLinks") || ""),
    medicalNotes: String(formData.get("medicalNotes") || ""),
    concept: String(formData.get("concept") || ""),
  };

  const imageFiles = formData
    .getAll("referenceImages")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (imageFiles.length > MAX_ENQUIRY_IMAGES) {
    throw new Error(`Please upload up to ${MAX_ENQUIRY_IMAGES} images.`);
  }

  let totalBytes = 0;

  const referenceImages = await Promise.all(
    imageFiles.map(async (file, index) => {
      const mimeType = file.type.trim().toLowerCase();

      if (!allowedImageMimeTypes.has(mimeType)) {
        throw new Error("Only JPEG, PNG, WebP, or HEIC images are supported.");
      }

      if (file.size > MAX_IMAGE_BYTES) {
        throw new Error("Each image must be 8MB or smaller.");
      }

      totalBytes += file.size;

      if (totalBytes > MAX_TOTAL_IMAGE_BYTES) {
        throw new Error("Total image upload size must be 24MB or smaller.");
      }

      const bytes = new Uint8Array(await file.arrayBuffer());

      return {
        fileName: normalizeUploadName(file, index),
        mimeType,
        byteSize: file.size,
        base64Data: Buffer.from(bytes).toString("base64"),
      };
    })
  );

  const parsed = parseCreateEnquiryInput(payload);

  return {
    ...parsed,
    referenceImages,
  };
}

async function parseCreateEnquiryRequest(request: NextRequest): Promise<CreateEnquiryInput> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.toLowerCase().includes("multipart/form-data")) {
    const formData = await request.formData();
    return parseCreateEnquiryFromMultipart(formData);
  }

  const payload = await request.json();
  return parseCreateEnquiryInput(payload);
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
    const enquiry = await createEnquiry(await parseCreateEnquiryRequest(request));
    return NextResponse.json({ enquiry }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit enquiry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
