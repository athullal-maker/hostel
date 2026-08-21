import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, public API routes, and public paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/seed") ||
    pathname.startsWith("/api/hostels") ||
    pathname.includes(".") ||
    pathname === "/admin/login" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/style-guide" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 2. Read and decode JWT token (using NEXTAUTH_SECRET)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "kerala_hostel_default_secret_dev_mode",
  });

  const userRole = token?.role;

  // 3. Protection for SuperAdmin routes (/superadmin/*)
  if (pathname.startsWith("/superadmin")) {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "unauthenticated");
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "superadmin") {
      // Forbidden: Redirect non-superadmin users away
      const redirectUrl = new URL(
        userRole === "admin" ? "/admin/dashboard" : "/",
        request.url
      );
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  // 4. Protection for Admin routes (/admin/*, excluding /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "unauthenticated");
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "admin" && userRole !== "superadmin") {
      // User is authenticated but is a regular tenant/student (role: 'user')
      const redirectUrl = new URL("/admin/login", request.url);
      redirectUrl.searchParams.set("error", "unauthorized_role");
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/admin/:path*",
    "/superadmin/:path*",
  ],
};
