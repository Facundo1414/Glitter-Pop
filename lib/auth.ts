import { NextRequest } from "next/server";

export function isAdminAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get("admin_auth");
  return authCookie?.value === "authenticated";
}

export function sanitizeOrder(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function sanitizeString(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.trim();
}
