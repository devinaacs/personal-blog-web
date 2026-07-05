import { cookies } from "next/headers";

import { env } from "@/lib/env";
import { ADMIN_ACCESS_TOKEN_COOKIE } from "@/lib/admin-session-constants";

export class AdminApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function adminApiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    throw new AdminApiError(401, "Not authenticated");
  }

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: { message?: string | string[] };
    } | null;
    const message = body?.error?.message;

    throw new AdminApiError(
      response.status,
      Array.isArray(message)
        ? message.join(", ")
        : (message ?? "Request failed"),
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json()) as { data: T };

  return body.data;
}
