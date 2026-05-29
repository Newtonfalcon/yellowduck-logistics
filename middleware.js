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

// 1. Rename or map your function to standard Next.js 'middleware'
export function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname } = nextUrl;

  const authToken = cookies.get(AUTH_COOKIE_NAME)?.value;

  // If logged in and trying to access login/register, redirect to dashboard
  if (authToken && isAuthRoute(pathname)) {
    const dashboardUrl = nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // If it's a public route, let them pass
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  // If it's a protected route and they aren't logged in, redirect to login
  if (!authToken) {
    const loginUrl = nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 2. Your matcher config ensures this middleware only runs on these specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*", "/auth"],
};