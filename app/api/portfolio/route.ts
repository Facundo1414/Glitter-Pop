import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureDatabase, getPortfolioItems } from "@/lib/db";
import {
  isAdminAuthenticated,
  sanitizeOrder,
  sanitizeString,
} from "@/lib/auth";

export async function GET() {
  try {
    const portfolio = await getPortfolioItems();
    return NextResponse.json({
      portfolio: portfolio.map((item) => ({
        id: String(item.id),
        title: item.title,
        image: item.image_url,
        category: item.category,
        displayOrder: item.display_order,
      })),
    });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json(
      { message: "Error loading portfolio" },
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
    const image = sanitizeString(body.image);
    const category = sanitizeString(body.category, "special");
    const displayOrder = sanitizeOrder(body.displayOrder);

    if (!title || !image) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql<{
      id: number;
      title: string;
      image_url: string;
      category: string;
      display_order: number;
    }>`
      INSERT INTO portfolio_items (title, image_url, category, display_order)
      VALUES (${title}, ${image}, ${category}, ${displayOrder})
      RETURNING id, title, image_url, category, display_order
    `;

    return NextResponse.json({
      item: {
        id: String(result.rows[0].id),
        title: result.rows[0].title,
        image: result.rows[0].image_url,
        category: result.rows[0].category,
        displayOrder: result.rows[0].display_order,
      },
    });
  } catch (error) {
    console.error("POST /api/portfolio error:", error);
    return NextResponse.json(
      { message: "Error creating portfolio item" },
      { status: 500 },
    );
  }
}
