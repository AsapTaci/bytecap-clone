import { NextRequest, NextResponse } from "next/server";
import { completeViaApiKey, completeViaClaudeCode } from "@/lib/claude-client";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    mode?: "subscription" | "apikey";
  };

  const req_ = {
    system: "You are a terse test responder.",
    userMessage: "Reply with exactly the single word: PONG",
    maxTokens: 20,
  };

  try {
    const text =
      body.mode === "subscription"
        ? await completeViaClaudeCode(req_)
        : await completeViaApiKey(req_);
    return NextResponse.json({ ok: true, reply: text });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Errore" },
      { status: 500 }
    );
  }
}
