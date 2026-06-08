import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SESSION_COOKIE = "token";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // ── Admin login page — always public ──────────────────────────────
  if (pathname === "/admin/login") {
    if (token) {
      try {
        const decoded = jwt.decode(token) as { role?: string } | null;
        if (decoded?.role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {}
    }
    return NextResponse.next();
  }

  // ── Admin dashboard — admin role required ─────────────────────────
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const decoded = jwt.decode(token) as { role?: string } | null;
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ── Regular protected routes ──────────────────────────────────────
  const protectedRoutes = ["/dashboard"];

  const isProtected = protectedRoutes.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
