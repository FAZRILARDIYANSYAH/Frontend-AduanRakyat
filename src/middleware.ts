import {NextResponse} from "next/server";

import type {NextRequest} from "next/server";

export function middleware(request: NextRequest) {
  const {
    pathname,
  } = request.nextUrl;

  const token =
    request.cookies.get(
      "token"
    )?.value;

  const role =
    request.cookies.get(
      "role"
    )?.value;

  // ── PROTECTED ROUTE ──
  const protectedRoutes =
    [
      "/homepage",
      "/profile",
      "/admin",
      "/superadmin",
    ];

  const isProtected =
    protectedRoutes.some(
      (path) =>
        pathname.startsWith(
          path
        )
    );

  // belum login
  if (
    isProtected &&
    !token
  ) {
    return NextResponse.redirect(
      new URL(
        "/auth/login",
        request.url
      )
    );
  }

  // ── AUTH ROUTE ──
  const authRoutes =
    [
      "/auth/login",
      "/auth/register",
    ];

  const isAuthRoute =
    authRoutes.some(
      (path) =>
        pathname.startsWith(
          path
        )
    );

  // kalau sudah login
  if (
    isAuthRoute &&
    token
  ) {
    // redirect sesuai role
    if (
      role ===
      "superadmin"
    ) {
      return NextResponse.redirect(
        new URL(
          "/superadmin/dashboard",
          request.url
        )
      );
    }

    if (
      role ===
      "admin"
    ) {
      return NextResponse.redirect(
        new URL(
          "/admin/dashboard",
          request.url
        )
      );
    }

    return NextResponse.redirect(
      new URL(
        "/homepage",
        request.url
      )
    );
  }

  // ── ADMIN ONLY ──
  if (
    pathname.startsWith(
      "/admin"
    ) &&
    role !==
      "admin"
  ) {
    return NextResponse.redirect(
      new URL(
        "/homepage",
        request.url
      )
    );
  }

  // ── SUPERADMIN ONLY ──
  if (
    pathname.startsWith(
      "/superadmin"
    ) &&
    role !==
      "superadmin"
  ) {
    return NextResponse.redirect(
      new URL(
        "/homepage",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config =
  {
    matcher: [
      "/homepage/:path*",
      "/profile/:path*",
      "/admin/:path*",
      "/superadmin/:path*",
      "/auth/login",
      "/auth/register",
    ],
  };