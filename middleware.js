import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request) {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("accessToken");
  const userToken = cookieStore.get("userId");
  const roleToken = cookieStore.get("role");
  const token = tokenCookie?.value;
  const userId = userToken?.value;
  const role = roleToken?.value;

  const { pathname } = request.nextUrl;


  if (!token || !userId) {
    // Redirect to login if token or userId is not present
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check user role and restrict access based on role
  if (pathname.startsWith("/user") && role !== "USER") {
    // Redirect to unauthorized page for non-user users trying to access user paths
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check user role and restrict access based on role
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    // Redirect to unauthorized page for non-user users trying to access user paths
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to the dashboard
  return NextResponse.next();
}

export const config = {
  // Match any route starting with '/user/' or '/admin/dashboard/'
  matcher: ["/user/:path*", "/admin/:path*"],
};
