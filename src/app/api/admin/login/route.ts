import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
} from "@/lib/admin-session-constants";
import { AuthResponse } from "@/types/auth";

const ONE_DAY_SECONDS = 60 * 60 * 24;
const SEVEN_DAYS_SECONDS = ONE_DAY_SECONDS * 7;

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required" },
      { status: 400 },
    );
  }

  const loginResponse = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!loginResponse.ok) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 },
    );
  }

  const body = (await loginResponse.json()) as { data: AuthResponse };
  const { accessToken, refreshToken, user } = body.data;

  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "This account does not have admin access" },
      { status: 403 },
    );
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  cookieStore.set(ADMIN_ACCESS_TOKEN_COOKIE, accessToken, {
    ...cookieOptions,
    maxAge: ONE_DAY_SECONDS,
  });
  cookieStore.set(ADMIN_REFRESH_TOKEN_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: SEVEN_DAYS_SECONDS,
  });

  return NextResponse.json({ success: true });
}
