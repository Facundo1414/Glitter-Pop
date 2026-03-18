import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureDatabase, getFaqs } from "@/lib/db";
import {
  isAdminAuthenticated,
  sanitizeOrder,
  sanitizeString,
} from "@/lib/auth";

export async function GET() {
  try {
    const faqs = await getFaqs();
    return NextResponse.json({
      faqs: faqs.map((item) => ({
        id: String(item.id),
        question: item.question,
        answer: item.answer,
        displayOrder: item.display_order,
      })),
    });
  } catch (error) {
    console.error("GET /api/faqs error:", error);
    return NextResponse.json(
      { message: "Error loading faqs" },
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
    const question = sanitizeString(body.question);
    const answer = sanitizeString(body.answer);
    const displayOrder = sanitizeOrder(body.displayOrder);

    if (!question || !answer) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql<{
      id: number;
      question: string;
      answer: string;
      display_order: number;
    }>`
      INSERT INTO faqs (question, answer, display_order)
      VALUES (${question}, ${answer}, ${displayOrder})
      RETURNING id, question, answer, display_order
    `;

    return NextResponse.json({
      faq: {
        id: String(result.rows[0].id),
        question: result.rows[0].question,
        answer: result.rows[0].answer,
        displayOrder: result.rows[0].display_order,
      },
    });
  } catch (error) {
    console.error("POST /api/faqs error:", error);
    return NextResponse.json(
      { message: "Error creating faq" },
      { status: 500 },
    );
  }
}
