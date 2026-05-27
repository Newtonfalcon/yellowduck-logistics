import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "ydk-auth-session";

const PROTECTED_PATHS = ["/dashboard", "/admin"];
const AUTH_ROUTES = ["/auth/login", "/auth/register", "/auth"];

function isProtectedRoute(pathname) {
  return PROTECTED_PATHS.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isAuthRoute(pathname) {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request) {
  const { nextUrl, cookies } = request;
  const { pathname } = nextUrl;

  const authToken = cookies.get(AUTH_COOKIE_NAME)?.value;

  if (authToken && isAuthRoute(pathname)) {
    const dashboardUrl = nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  if (!authToken) {
    const loginUrl = nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*", "/auth"],
};
