import { NextRequest, NextResponse } from "next/server";

import { ADMIN_ACCESS_TOKEN_COOKIE } from "@/lib/admin-session-constants";

export function proxy(request: NextRequest): NextResponse {
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";
  const hasSessionCookie = request.cookies.has(ADMIN_ACCESS_TOKEN_COOKIE);

  if (!isLoginRoute && !hasSessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
