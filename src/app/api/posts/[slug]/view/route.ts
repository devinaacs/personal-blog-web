import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

type ViewResult = {
  postViewCount: number;
};

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/${slug}/views`, {
    method: "POST",
    cache: "no-store",
  });

  const responseBody = (await response.json()) as {
    success: boolean;
    data?: ViewResult;
    error?: { message?: string | string[] };
  };

  if (!response.ok || !responseBody.success) {
    const message = responseBody.error?.message;

    return NextResponse.json(
      {
        success: false,
        message: Array.isArray(message)
          ? message.join(", ")
          : (message ?? "Failed to record view"),
      },
      { status: response.status },
    );
  }

  return NextResponse.json({ success: true, data: responseBody.data });
}
