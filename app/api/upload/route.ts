import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { ensureDatabase } from "@/lib/db";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 },
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Formato inválido. Permitidos: JPEG, PNG, WebP." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Archivo demasiado grande. Máximo 5MB." },
        { status: 400 },
      );
    }

    await ensureDatabase();

    const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
    const contentBase64 = Buffer.from(await file.arrayBuffer()).toString(
      "base64",
    );
    const mediaId = crypto.randomUUID();

    await sql`
      INSERT INTO media_assets (id, filename, mime_type, content)
      VALUES (${mediaId}, ${safeName}, ${file.type}, decode(${contentBase64}, 'base64'))
    `;

    return NextResponse.json({
      id: mediaId,
      url: `/api/media/${mediaId}`,
    });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
