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
    const faqId = Number(id);

    if (!Number.isFinite(faqId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const question = sanitizeString(body.question);
    const answer = sanitizeString(body.answer);
    const displayOrder = sanitizeOrder(body.displayOrder);

    if (!question || !answer) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await sql`
      UPDATE faqs
      SET question = ${question}, answer = ${answer}, display_order = ${displayOrder}
      WHERE id = ${faqId}
    `;

    return NextResponse.json({ message: "FAQ updated" });
  } catch (error) {
    console.error("PUT /api/faqs/[id] error:", error);
    return NextResponse.json(
      { message: "Error updating faq" },
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
    const faqId = Number(id);

    if (!Number.isFinite(faqId)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    await sql`DELETE FROM faqs WHERE id = ${faqId}`;
    return NextResponse.json({ message: "FAQ deleted" });
  } catch (error) {
    console.error("DELETE /api/faqs/[id] error:", error);
    return NextResponse.json(
      { message: "Error deleting faq" },
      { status: 500 },
    );
  }
}
