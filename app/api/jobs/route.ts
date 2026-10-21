import { NextRequest, NextResponse } from "next/server";
import { startJob, listJobs } from "@/lib/pipeline";

export async function GET() {
  const jobs = await listJobs();
  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    youtubeUrl?: string;
    uploadPath?: string;
    fileName?: string;
  };

  const id = crypto.randomUUID();

  if (body.youtubeUrl) {
    await startJob(id, { type: "youtube", url: body.youtubeUrl });
  } else if (body.uploadPath) {
    await startJob(id, {
      type: "upload",
      uploadPath: body.uploadPath,
      fileName: body.fileName,
    });
  } else {
    return NextResponse.json(
      { error: "youtubeUrl o uploadPath richiesti" },
      { status: 400 }
    );
  }

  return NextResponse.json({ id });
}
