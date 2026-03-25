import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username =
      typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Credenciales invalidas" },
        { status: 400 },
      );
    }

    // Authentication against required environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error("Admin credentials are missing in server environment");
      return NextResponse.json(
        { success: false, message: "Servicio de autenticacion no disponible" },
        { status: 503 },
      );
    }

    if (username === adminUsername && password === adminPassword) {
      const response = NextResponse.json(
        { success: true, message: "Autenticacion correcta" },
        { status: 200 },
      );

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
      { success: false, message: "Credenciales invalidas" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "No fue posible iniciar sesion" },
      { status: 500 },
    );
  }
}
