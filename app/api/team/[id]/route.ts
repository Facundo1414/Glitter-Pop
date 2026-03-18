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
    const memberId = Number(id);

    if (!Number.isFinite(memberId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const name = sanitizeString(body.name);
    const role = sanitizeString(body.role);
    const description = sanitizeString(body.description);
    const image = sanitizeString(body.image, "/images/Marti.webp");
    const displayOrder = sanitizeOrder(body.displayOrder);

    if (!name || !role || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await sql`
      UPDATE team_members
      SET name = ${name}, role = ${role}, description = ${description}, image_url = ${image}, display_order = ${displayOrder}
      WHERE id = ${memberId}
    `;

    return NextResponse.json({ message: "Team member updated" });
  } catch (error) {
    console.error("PUT /api/team/[id] error:", error);
    return NextResponse.json(
      { message: "Error updating team member" },
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
    const memberId = Number(id);

    if (!Number.isFinite(memberId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    await sql`DELETE FROM team_members WHERE id = ${memberId}`;
    return NextResponse.json({ message: "Team member deleted" });
  } catch (error) {
    console.error("DELETE /api/team/[id] error:", error);
    return NextResponse.json(
      { message: "Error deleting team member" },
      { status: 500 },
    );
  }
}
