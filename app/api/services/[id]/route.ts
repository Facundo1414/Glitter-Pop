import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureDatabase } from "@/lib/db";
import {
  isAdminAuthenticated,
  sanitizeOrder,
  sanitizeString,
} from "@/lib/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await ensureDatabase();
    const { id } = await params;
    const serviceId = Number(id);

    if (!Number.isFinite(serviceId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

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

    await sql`
      UPDATE services
      SET
        title = ${title},
        description = ${description},
        image_url = ${image || "/images/service-glitter.jpg"},
        duration = ${duration},
        icon = ${icon},
        display_order = ${displayOrder}
      WHERE id = ${serviceId}
    `;

    return NextResponse.json({ message: "Service updated" });
  } catch (error) {
    console.error("PUT /api/services/[id] error:", error);
    return NextResponse.json(
      { message: "Error updating service" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await ensureDatabase();
    const { id } = await params;
    const serviceId = Number(id);

    if (!Number.isFinite(serviceId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    await sql`DELETE FROM services WHERE id = ${serviceId}`;
    return NextResponse.json({ message: "Service deleted" });
  } catch (error) {
    console.error("DELETE /api/services/[id] error:", error);
    return NextResponse.json(
      { message: "Error deleting service" },
      { status: 500 },
    );
  }
}
