import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Demo access gate for hackathon evaluation — NOT a real auth system. A single
// shared username/password (env-configurable, defaults below) protects every
// route except the public landing page and the login flow itself. Remove this
// file (or just change/unset the env vars on the host) once evaluation is
// done to revoke access instantly without a code change.
// ---------------------------------------------------------------------------

const COOKIE_NAME = "procureai_auth";
const PUBLIC_PATHS = ["/login", "/api/login", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|fbx|glb|txt|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  const authed = request.cookies.get(COOKIE_NAME)?.value === "1";
  if (!authed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
