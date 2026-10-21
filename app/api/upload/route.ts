import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nessun file ricevuto" }, { status: 400 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const id = crypto.randomUUID();
  const ext = path.extname(file.name) || ".mp4";
  const uploadPath = path.join(UPLOAD_DIR, `${id}${ext}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(uploadPath, buffer);

  return NextResponse.json({ uploadPath, fileName: file.name });
}
