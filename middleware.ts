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
    const isParentPage = req.nextUrl.pathname.startsWith("/students");
    const isAdmin = token && ["STAFF", "SUPER_STAFF"].includes(token.role);
    const isParent = token && token.role === "PARENT";

    // ログインしていない場合、
    if (!isAuth) {
      if (isAuthPage) {
        // ログインページにアクセスしている場合、そのまま表示
        return null;
      } else {
        // ログインページ以外にアクセスしている場合、ログインページにリダイレクト
        let from = req.nextUrl.pathname;
        if (req.nextUrl.search) {
          from += req.nextUrl.search;
        }

        return NextResponse.redirect(
          new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
        );
      }
    }

    // 職員としてログインしている場合、
    if (isAdmin) {
      if (isAdminPage) {
        // 管理者ページにアクセスしている場合、そのまま表示
        return null;
      } else if (isParentPage) {
        // 児童ページにアクセスしている場合、そのまま表示
        return null;
      } else if (isAuthPage) {
        // ログインページにアクセスしている場合、管理者ページにリダイレクト
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        // その他の場合、管理者ページにリダイレクト
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    // 親としてログインしている場合、
    if (isParent) {
      if (isAdminPage) {
        // 管理者ページにアクセスしている場合、児童ページにリダイレクト
        return NextResponse.redirect(new URL("/students", req.url));
      } else if (isParentPage) {
        // 児童ページにアクセスしている場合、そのまま表示
        return null;
      } else if (isAuthPage) {
        // ログインページにアクセスしている場合、児童ページにリダイレクト
        return NextResponse.redirect(new URL("/students", req.url));
      } else {
        // その他の場合、児童ページにリダイレクト
        return NextResponse.redirect(new URL("/students", req.url));
      }
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
  matcher: ["/", "/admin/:path*", "/students/:path*", "/login", "/register"],
};
