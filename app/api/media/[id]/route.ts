import { NextRequest } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureDatabase } from "@/lib/db";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await ensureDatabase();
    const { id } = await params;

    if (!id) {
      return new Response("Missing id", { status: 400 });
    }

    const result = await sql<{
      mime_type: string;
      content_base64: string;
    }>`
      SELECT mime_type, encode(content, 'base64') AS content_base64
      FROM media_assets
      WHERE id = ${id}
      LIMIT 1
    `;

    if (result.rowCount === 0) {
      return new Response("Not found", { status: 404 });
    }

    const row = result.rows[0];
    const bytes = Buffer.from(row.content_base64, "base64");

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": row.mime_type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET /api/media/[id] error:", error);
    return new Response("Error loading media", { status: 500 });
  }
}
