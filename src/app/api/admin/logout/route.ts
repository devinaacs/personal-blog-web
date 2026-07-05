import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
} from "@/lib/admin-session-constants";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_ACCESS_TOKEN_COOKIE);
  cookieStore.delete(ADMIN_REFRESH_TOKEN_COOKIE);

  return NextResponse.json({ success: true });
}
