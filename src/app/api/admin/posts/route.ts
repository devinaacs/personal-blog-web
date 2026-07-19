import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import { Post } from "@/types/post";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as unknown;

  try {
    const post = await adminApiFetch<Post>("/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    revalidateTag("posts", "max");

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    if (error instanceof AdminApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }

    throw error;
  }
}
