import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to /admin/login without authentication
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for authentication cookie on other /admin routes
    const authCookie = request.cookies.get("admin_auth");

    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
