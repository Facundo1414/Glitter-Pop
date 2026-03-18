import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { isAdminAuthenticated, sanitizeString } from "@/lib/auth";
import { getSettingsMap, ensureDatabase } from "@/lib/db";

export async function GET() {
  try {
    const settings = await getSettingsMap();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { message: "Error loading settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await ensureDatabase();
    const body = await request.json();

    if (body.values && typeof body.values === "object") {
      const entries = Object.entries(body.values) as Array<[string, unknown]>;
      for (const [key, value] of entries) {
        if (!key) continue;
        await sql`
          INSERT INTO settings (key, value)
          VALUES (${key}, ${sanitizeString(value)})
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        `;
      }
      return NextResponse.json({ message: "Settings updated" });
    }

    const key = sanitizeString(body.key);
    const value = sanitizeString(body.value);
    if (!key) {
      return NextResponse.json({ message: "Invalid key" }, { status: 400 });
    }

    await sql`
      INSERT INTO settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;

    return NextResponse.json({ message: "Setting updated" });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { message: "Error updating settings" },
      { status: 500 },
    );
  }
}
