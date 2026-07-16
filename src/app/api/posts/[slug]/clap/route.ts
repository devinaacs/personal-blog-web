import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { getOrCreateReaderId, getReaderId } from "@/lib/reader-session";

type ClapResult = {
  readerClapCount: number;
  postClapCount: number;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const readerId = await getReaderId();
  const query = readerId ? `?readerId=${encodeURIComponent(readerId)}` : "";

  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/posts/${slug}/claps${query}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    return NextResponse.json(
      { success: false, message: "Failed to load clap status" },
      { status: response.status },
    );
  }

  const body = (await response.json()) as { data: ClapResult };

  return NextResponse.json({ success: true, data: body.data });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const readerId = await getOrCreateReaderId();
  const requestBody = (await request.json()) as { increment?: number };
  const increment = requestBody.increment ?? 1;
  const userAgent = request.headers.get("user-agent");

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/${slug}/claps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(userAgent ? { "User-Agent": userAgent } : {}),
    },
    body: JSON.stringify({ readerId, increment }),
    cache: "no-store",
  });

  const responseBody = (await response.json()) as {
    success: boolean;
    data?: ClapResult;
    error?: { message?: string | string[] };
  };

  if (!response.ok || !responseBody.success) {
    const message = responseBody.error?.message;

    return NextResponse.json(
      {
        success: false,
        message: Array.isArray(message)
          ? message.join(", ")
          : (message ?? "Failed to clap"),
      },
      { status: response.status },
    );
  }

  return NextResponse.json({ success: true, data: responseBody.data });
}
