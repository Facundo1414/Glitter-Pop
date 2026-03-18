import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getServices, ensureDatabase } from "@/lib/db";
import {
  isAdminAuthenticated,
  sanitizeOrder,
  sanitizeString,
} from "@/lib/auth";

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({
      services: services.map((item) => ({
        id: String(item.id),
        title: item.title,
        description: item.description,
        image: item.image_url,
        duration: item.duration,
        icon: item.icon,
        displayOrder: item.display_order,
      })),
    });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json(
      { message: "Error loading services" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await ensureDatabase();
    const body = await request.json();

    const title = sanitizeString(body.title);
    const description = sanitizeString(body.description);
    const image = sanitizeString(body.image);
    const duration = sanitizeString(body.duration);
    const icon = sanitizeString(body.icon, "✨");
    const displayOrder = sanitizeOrder(body.displayOrder);

    if (!title || !description || !duration) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql<{
      id: number;
      title: string;
      description: string;
      image_url: string;
      duration: string;
      icon: string;
      display_order: number;
    }>`
      INSERT INTO services (title, description, image_url, duration, icon, display_order)
      VALUES (${title}, ${description}, ${image || "/images/service-glitter.jpg"}, ${duration}, ${icon}, ${displayOrder})
      RETURNING id, title, description, image_url, duration, icon, display_order
    `;

    return NextResponse.json({
      service: {
        id: String(result.rows[0].id),
        title: result.rows[0].title,
        description: result.rows[0].description,
        image: result.rows[0].image_url,
        duration: result.rows[0].duration,
        icon: result.rows[0].icon,
        displayOrder: result.rows[0].display_order,
      },
    });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json(
      { message: "Error creating service" },
      { status: 500 },
    );
  }
}
