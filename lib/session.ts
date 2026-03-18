import { SessionOptions } from "iron-session";

export interface SessionData {
  isLoggedIn?: boolean;
  username?: string;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.IRON_SESSION_PASSWORD ||
    "complex_password_at_least_32_characters_long_!!!",
  cookieName: "glitter_pop_admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60, // 24 hours
    sameSite: "lax",
  },
};

export async function getSession(
  request: Request,
): Promise<SessionData | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parseCookies(cookieHeader);

  // For demo purposes, just check if we have a valid session cookie
  // In production, you'd decrypt the session
  if (cookies.glitter_pop_admin?.includes("authenticated")) {
    return { isLoggedIn: true, username: "admin" };
  }

  return null;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
}
