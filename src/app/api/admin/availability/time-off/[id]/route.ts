import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { deleteTimeOff } from "@/lib/admin-db";
import { requireAdminApiSession } from "@/lib/admin-session";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  const session = requireAdminApiSession(request);
  if (session instanceof NextResponse) return session;

  const { id } = await params;
  const periodId = Number.parseInt(id, 10);

  if (!Number.isFinite(periodId)) {
    return NextResponse.json({ error: "Invalid time-off ID." }, { status: 400 });
  }

  try {
    await deleteTimeOff(periodId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not delete time-off period.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
