import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { canAccessPath } from "@/lib/constants/roles";
import { UserRole } from "@/types/auth.types";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role as UserRole | undefined;
    const pathname = req.nextUrl.pathname;

    if (!canAccessPath(role, pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token?.accessToken && !!token?.role,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protect everything under the dashboard route group; leave (auth) pages public.
export const config = {
  matcher: ["/dashboard/:path*", "/patients/:path*", "/appointments/:path*", "/staff/:path*",
    "/emr/:path*", "/billing/:path*", "/pharmacy/:path*", "/laboratory/:path*",
    "/ward/:path*", "/inventory/:path*", "/reports/:path*"],
};
