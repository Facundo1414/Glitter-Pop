import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Authentication against required environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.",
        },
        { status: 500 },
      );
    }

    if (username === adminUsername && password === adminPassword) {
      // Create response with auth token in cookie
      const response = NextResponse.json(
        { success: true, message: "Logged in successfully" },
        { status: 200 },
      );

      // Set auth cookie
      response.cookies.set({
        name: "admin_auth",
        value: "authenticated",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
