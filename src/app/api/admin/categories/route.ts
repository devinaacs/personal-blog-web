import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import { Category } from "@/types/taxonomy";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as unknown;

  try {
    const category = await adminApiFetch<Category>("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    revalidateTag("categories", "max");

    return NextResponse.json({ success: true, data: category });
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
