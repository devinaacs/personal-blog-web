import { NextResponse } from "next/server";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  try {
    await adminApiFetch<void>(`/posts/${id}`, { method: "DELETE" });

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
