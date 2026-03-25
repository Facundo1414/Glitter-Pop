import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  const authCookie = _request.cookies.get("admin_auth");

  if (authCookie?.value === "authenticated") {
    return NextResponse.json(
      { isAuthenticated: true, username: "admin" },
      { status: 200 },
    );
  }

  return NextResponse.json({ isAuthenticated: false }, { status: 401 });
}
