import { cookies } from "next/headers";

import { env } from "@/lib/env";
import { ADMIN_ACCESS_TOKEN_COOKIE } from "@/lib/admin-session-constants";
import { AuthUser } from "@/types/auth";

export async function getAdminUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as { success: true; data: AuthUser };
  const user = body.data;

  return user.role === "ADMIN" ? user : null;
}
