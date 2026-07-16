import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getOrCreateReaderId } from "@/lib/reader-session";

type ShareResult = {
  postShareCount: number;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const readerId = await getOrCreateReaderId();
  const requestBody = (await request.json()) as { platform?: string };
  const userAgent = request.headers.get("user-agent");

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/${slug}/shares`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(userAgent ? { "User-Agent": userAgent } : {}),
    },
    body: JSON.stringify({ readerId, platform: requestBody.platform }),
    cache: "no-store",
  });

  const responseBody = (await response.json()) as {
    success: boolean;
    data?: ShareResult;
    error?: { message?: string | string[] };
  };

  if (!response.ok || !responseBody.success) {
    const message = responseBody.error?.message;

    return NextResponse.json(
      {
        success: false,
        message: Array.isArray(message)
          ? message.join(", ")
          : (message ?? "Failed to share"),
      },
      { status: response.status },
    );
  }

  return NextResponse.json({ success: true, data: responseBody.data });
}
