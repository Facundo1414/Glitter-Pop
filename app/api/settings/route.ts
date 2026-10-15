import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { isAdminAuthenticated, sanitizeString } from "@/lib/auth";
import { getSettingsMap, ensureDatabase } from "@/lib/db";
import { parseInstagramPostUrl } from "@/lib/instagram";

const HERO_DESKTOP_VARIANTS = new Set([
  "desktop_v1",
  "desktop_v2",
  "desktop_v3",
]);
const HERO_MOBILE_VARIANTS = new Set(["mobile_v1", "mobile_v2"]);

function normalizeSettingValue(key: string, rawValue: unknown): string | null {
  const value = sanitizeString(rawValue);

  if (key === "hero_desktop_variant") {
    return HERO_DESKTOP_VARIANTS.has(value) ? value : null;
  }

  if (key === "hero_mobile_variant") {
    return HERO_MOBILE_VARIANTS.has(value) ? value : null;
  }

  if (key === "instagram_posts") {
    const links = value.split(/\r?\n/).map((link) => link.trim()).filter(Boolean);
    if (links.length > 12 || links.some((link) => !/^https:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/[A-Za-z0-9_-]+\/?(?:\?[^\s]*)?$/.test(link))) return null;
    return links.join("\n");
  }

  if (key === "hero_video_url") {
    return parseInstagramPostUrl(value)?.url ?? null;
  }

  return value;
}

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
      const normalizedEntries: Array<[string, string]> = [];
      for (const [key, value] of entries) {
        if (!key) continue;
        const normalizedValue = normalizeSettingValue(key, value);
        if (normalizedValue === null) {
          return NextResponse.json(
            { message: `Invalid value for ${key}` },
            { status: 400 },
          );
        }
        normalizedEntries.push([key, normalizedValue]);
      }

      for (const [key, normalizedValue] of normalizedEntries) {
        await sql`
          INSERT INTO settings (key, value)
          VALUES (${key}, ${normalizedValue})
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        `;
      }
      return NextResponse.json({ message: "Settings updated" });
    }

    const key = sanitizeString(body.key);
    const value = normalizeSettingValue(key, body.value);
    if (!key) {
      return NextResponse.json({ message: "Invalid key" }, { status: 400 });
    }

    if (value === null) {
      return NextResponse.json(
        { message: `Invalid value for ${key}` },
        { status: 400 },
      );
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
