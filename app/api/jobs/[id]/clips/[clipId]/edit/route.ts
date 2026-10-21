import { NextRequest, NextResponse } from "next/server";
import { editClip } from "@/lib/pipeline";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; clipId: string }> }
) {
  const { id, clipId } = await params;
  const body = (await req.json().catch(() => ({}))) as { instruction?: string };

  if (!body.instruction || !body.instruction.trim()) {
    return NextResponse.json(
      { error: "Descrivi la modifica che vuoi applicare" },
      { status: 400 }
    );
  }

  try {
    const result = await editClip(id, clipId, body.instruction.trim());
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore durante la modifica" },
      { status: 500 }
    );
  }
}
