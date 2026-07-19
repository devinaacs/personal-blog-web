import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import { Category } from "@/types/taxonomy";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body = (await request.json()) as unknown;

  try {
    const category = await adminApiFetch<Category>(`/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    revalidateTag("categories", "max");
    revalidateTag("posts", "max");

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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  try {
    await adminApiFetch<void>(`/categories/${id}`, { method: "DELETE" });

    revalidateTag("categories", "max");
    revalidateTag("posts", "max");

    return NextResponse.json({ success: true });
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
