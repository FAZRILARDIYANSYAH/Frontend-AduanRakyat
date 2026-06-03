import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token =
      req.nextauth.token;

    const path =
      req.nextUrl.pathname;

    // BELUM LOGIN
    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/auth/login",
          req.url
        )
      );
    }

    const role =
      token.role as string;

    // ================= USER =================
    if (role === "user") {
      // user gaboleh admin/superadmin
      if (
        path.startsWith(
          "/admin"
        ) ||
        path.startsWith(
          "/superadmin"
        )
      ) {
        return NextResponse.redirect(
          new URL(
            "/homepage",
            req.url
          )
        );
      }
    }

    // ================= ADMIN =================
    if (role === "admin") {
      // admin gaboleh homepage
      if (
        path.startsWith(
          "/homepage"
        )
      ) {
        return NextResponse.redirect(
          new URL(
            "/admin/dashboard",
            req.url
          )
        );
      }

      // admin gaboleh superadmin
      if (
        path.startsWith(
          "/superadmin"
        )
      ) {
        return NextResponse.redirect(
          new URL(
            "/admin/dashboard",
            req.url
          )
        );
      }
    }

    // ================= SUPERADMIN =================
    if (
      role === "superadmin"
    ) {
      // superadmin gaboleh homepage
      if (
        path.startsWith(
          "/homepage"
        )
      ) {
        return NextResponse.redirect(
          new URL(
            "/superadmin/dashboard",
            req.url
          )
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/homepage/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/superadmin/:path*",
  ],
};