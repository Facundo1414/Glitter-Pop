import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureDatabase, getTeamMembers } from "@/lib/db";
import {
  isAdminAuthenticated,
  sanitizeOrder,
  sanitizeString,
} from "@/lib/auth";

export async function GET() {
  try {
    const team = await getTeamMembers();
    return NextResponse.json({
      team: team.map((member) => ({
        id: String(member.id),
        name: member.name,
        role: member.role,
        description: member.description,
        image: member.image_url,
        displayOrder: member.display_order,
      })),
    });
  } catch (error) {
    console.error("GET /api/team error:", error);
    return NextResponse.json(
      { message: "Error loading team" },
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
    const role = sanitizeString(body.role);
    const description = sanitizeString(body.description);
    const image = sanitizeString(body.image);
    const displayOrder = sanitizeOrder(body.displayOrder);

    if (!name || !role || !description || !image) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await sql<{
      id: number;
      name: string;
      role: string;
      description: string;
      image_url: string;
      display_order: number;
    }>`
      INSERT INTO team_members (name, role, description, image_url, display_order)
      VALUES (${name}, ${role}, ${description}, ${image}, ${displayOrder})
      RETURNING id, name, role, description, image_url, display_order
    `;

    return NextResponse.json({
      member: {
        id: String(result.rows[0].id),
        name: result.rows[0].name,
        role: result.rows[0].role,
        description: result.rows[0].description,
        image: result.rows[0].image_url,
        displayOrder: result.rows[0].display_order,
      },
    });
  } catch (error) {
    console.error("POST /api/team error:", error);
    return NextResponse.json(
      { message: "Error creating team member" },
      { status: 500 },
    );
  }
}
