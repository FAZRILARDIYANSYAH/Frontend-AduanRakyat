import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route yang butuh login
const PROTECTED = ["/user", "/admin", "/superadmin"];

// Route yang TIDAK boleh diakses kalau sudah login
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Kalau belum login dan akses halaman protected → redirect ke /login
  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kalau sudah login dan akses /login atau /register → redirect ke homepage
  const isAuthRoute = AUTH_ROUTES.some((path) => pathname.startsWith(path));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/user/homepage", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/admin/:path*",
    "/superadmin/:path*",
    "/login",
    "/register",
  ],
};