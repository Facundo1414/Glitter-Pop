import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureDatabase, getPackages } from "@/lib/db";
import {
  isAdminAuthenticated,
  sanitizeOrder,
  sanitizeString,
} from "@/lib/auth";

export async function GET() {
  try {
    const packages = await getPackages();
    return NextResponse.json({
      packages: packages.map((item) => ({
        id: String(item.id),
        name: item.name,
        price: String(item.price),
        duration: item.duration,
        features: item.features,
        ideal: item.ideal_for,
        popular: item.popular,
        displayOrder: item.display_order,
      })),
    });
  } catch (error) {
    console.error("GET /api/packages error:", error);
    return NextResponse.json(
      { message: "Error loading packages" },
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

    const result = await sql<{
      id: number;
      name: string;
      price: number;
      duration: string;
      features: string[];
      ideal_for: string;
      popular: boolean;
      display_order: number;
    }>`
      INSERT INTO packages (name, price, duration, features, ideal_for, popular, display_order)
      VALUES (${name}, ${price}, ${duration}, ${JSON.stringify(features)}::jsonb, ${ideal}, ${popular}, ${displayOrder})
      RETURNING id, name, price, duration, features, ideal_for, popular, display_order
    `;

    return NextResponse.json({
      package: {
        id: String(result.rows[0].id),
        name: result.rows[0].name,
        price: String(result.rows[0].price),
        duration: result.rows[0].duration,
        features: result.rows[0].features,
        ideal: result.rows[0].ideal_for,
        popular: result.rows[0].popular,
        displayOrder: result.rows[0].display_order,
      },
    });
  } catch (error) {
    console.error("POST /api/packages error:", error);
    return NextResponse.json(
      { message: "Error creating package" },
      { status: 500 },
    );
  }
}
