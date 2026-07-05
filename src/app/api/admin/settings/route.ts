import { NextRequest, NextResponse } from "next/server";

import { adminApiFetch, AdminApiError } from "@/lib/admin-api";
import { SiteSettings } from "@/types/settings";

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as unknown;

  try {
    const settings = await adminApiFetch<SiteSettings>("/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data: settings });
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
