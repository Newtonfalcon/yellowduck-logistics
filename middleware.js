import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "ydk-auth-session";

const PROTECTED_PATHS = ["/dashboard", "/admin"];

function isProtectedRoute(pathname) {
  return PROTECTED_PATHS.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function middleware(request) {
  const { nextUrl, cookies } = request;
  const { pathname } = nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const authToken = cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!authToken) {
    const loginUrl = nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
