import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { getAdminUser } from "@/lib/admin-session";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await getAdminUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  const file = request.headers.get("content-type");

  if (!file || !ALLOWED_TYPES.includes(file)) {
    return NextResponse.json(
      { success: false, message: "Unsupported image type" },
      { status: 400 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { success: false, message: "Image is larger than 5MB" },
      { status: 413 },
    );
  }

  const extension = file.split("/")[1] === "jpeg" ? "jpg" : file.split("/")[1];
  const filename = `posts/${crypto.randomUUID()}.${extension}`;

  const blob = await put(filename, request.body!, {
    access: "public",
    contentType: file,
  });

  return NextResponse.json({ success: true, data: { url: blob.url } });
}
