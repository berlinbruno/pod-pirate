import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware to protect routes
 * Redirects unauthenticated users to login page
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes require ADMIN role
    if (pathname.startsWith("/admin")) {
      const userRoles = token?.roles || [];
      if (!userRoles.includes("ADMIN")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Protected route patterns
        const isDashboard = pathname.startsWith("/dashboard");
        const isAdmin = pathname.startsWith("/admin");

        // Allow access if not a protected route
        if (!isDashboard && !isAdmin) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  },
);

/**
 * Matcher configuration
 * Specifies which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files
     * - api routes (except auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*|api/(?!auth)).*)",
  ],
};
