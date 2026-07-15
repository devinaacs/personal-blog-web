import { NextRequest, NextResponse } from "next/server";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import { Tag } from "@/types/taxonomy";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as unknown;

  try {
    const tag = await adminApiFetch<Tag>("/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data: tag });
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
