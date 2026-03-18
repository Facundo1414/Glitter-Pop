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
    const packageId = Number(id);

    if (!Number.isFinite(packageId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const name = sanitizeString(body.name);
    const price = Number(body.price);
    const duration = sanitizeString(body.duration);
    const ideal = sanitizeString(body.ideal);
    const popular = Boolean(body.popular);
    const displayOrder = sanitizeOrder(body.displayOrder);
    const features = Array.isArray(body.features)
      ? body.features.map((f: unknown) => sanitizeString(f)).filter(Boolean)
      : [];

    if (!name || !Number.isFinite(price)) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await sql`
      UPDATE packages
      SET
        name = ${name},
        price = ${price},
        duration = ${duration},
        features = ${JSON.stringify(features)}::jsonb,
        ideal_for = ${ideal},
        popular = ${popular},
        display_order = ${displayOrder}
      WHERE id = ${packageId}
    `;

    return NextResponse.json({ message: "Package updated" });
  } catch (error) {
    console.error("PUT /api/packages/[id] error:", error);
    return NextResponse.json(
      { message: "Error updating package" },
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
    const packageId = Number(id);

    if (!Number.isFinite(packageId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    await sql`DELETE FROM packages WHERE id = ${packageId}`;
    return NextResponse.json({ message: "Package deleted" });
  } catch (error) {
    console.error("DELETE /api/packages/[id] error:", error);
    return NextResponse.json(
      { message: "Error deleting package" },
      { status: 500 },
    );
  }
}
