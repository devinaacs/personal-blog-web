import { cookies } from "next/headers";

import { READER_ID_COOKIE } from "@/lib/reader-session-constants";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export async function getReaderId(): Promise<string | undefined> {
  const cookieStore = await cookies();

  return cookieStore.get(READER_ID_COOKIE)?.value;
}

export async function getOrCreateReaderId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(READER_ID_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const readerId = crypto.randomUUID();

  cookieStore.set(READER_ID_COOKIE, readerId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: ONE_YEAR_IN_SECONDS,
    path: "/",
  });

  return readerId;
}
