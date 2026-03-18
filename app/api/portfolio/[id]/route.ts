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
    const itemId = Number(id);

    if (!Number.isFinite(itemId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const title = sanitizeString(body.title);
    const image = sanitizeString(body.image);
    const category = sanitizeString(body.category, "special");
    const displayOrder = sanitizeOrder(body.displayOrder);

    if (!title || !image) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await sql`
      UPDATE portfolio_items
      SET title = ${title}, image_url = ${image}, category = ${category}, display_order = ${displayOrder}
      WHERE id = ${itemId}
    `;

    return NextResponse.json({ message: "Portfolio item updated" });
  } catch (error) {
    console.error("PUT /api/portfolio/[id] error:", error);
    return NextResponse.json(
      { message: "Error updating portfolio item" },
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
    const itemId = Number(id);

    if (!Number.isFinite(itemId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    await sql`DELETE FROM portfolio_items WHERE id = ${itemId}`;
    return NextResponse.json({ message: "Portfolio item deleted" });
  } catch (error) {
    console.error("DELETE /api/portfolio/[id] error:", error);
    return NextResponse.json(
      { message: "Error deleting portfolio item" },
      { status: 500 },
    );
  }
}
