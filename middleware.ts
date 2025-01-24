import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    if (isAuthPage) {
      if (isAuth) {
        if (["STAFF", "SUPER_STAFF"].includes(token.role)) {
          return NextResponse.redirect(new URL("/admin", req.url));
        } else {
          return NextResponse.redirect(new URL("/students", req.url));
        }
      }

      return null;
    }

    if (isAdminPage) {
      if (isAuth && ["STAFF", "SUPER_STAFF"].includes(token.role)) {
        return null;
      }

      return NextResponse.redirect(new URL("/students", req.url));
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/students/:path*", "/login", "/register"],
};
