import { NextRequest, NextResponse } from "next/server";
import { readStatus } from "@/lib/pipeline";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const status = await readStatus(id);
  if (!status) {
    return NextResponse.json({ error: "Job non trovato" }, { status: 404 });
  }
  return NextResponse.json(status);
}
