import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dreams",
  "/symbols",
  "/coach",
  "/backup",
  "/biorhythm",
  "/calendar",
  "/analytics",
  "/settings",
  "/help",
  "/admin",
];

// API routes that require authentication (checked by prefix)
const protectedApiPrefixes = [
  "/api/dreams",
  "/api/interpret",
  "/api/export",
  "/api/backup",
  "/api/biorhythm",
  "/api/dream-coach",
  "/api/symbols",
  "/api/usage",
  "/api/settings",
  "/api/transcribe",
  "/api/notifications/subscribe",
  "/api/notifications/test",
  "/api/admin",
];

// Public API routes (webhooks, auth, etc.)
const publicApiRoutes = [
  "/api/auth",
  "/api/register",
  "/api/stripe/webhook",
  "/api/notifications/vapid-key",
  "/api/notifications/send-reminders",
  "/api/maintenance",
];

/** Add security headers to every response */
function addSecurityHeaders(response: NextResponse) {
  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  // Prevent MIME-type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Restrict browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(self), geolocation=(), payment=()"
  );
  // XSS protection (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // Strict Transport Security (HTTPS only)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public static routes — still add security headers
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/pricing" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/cgv" ||
    pathname === "/mentions-legales" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return addSecurityHeaders(NextResponse.next());
  }

  // Skip public API routes
  for (const route of publicApiRoutes) {
    if (pathname.startsWith(route)) {
      return addSecurityHeaders(NextResponse.next());
    }
  }

  // Check protected pages
  const isProtectedPage = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check protected API routes
  const isProtectedApi = protectedApiPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedPage || isProtectedApi) {
    // Use JWT token check (Edge-compatible, no Prisma needed)
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      if (isProtectedApi) {
        return addSecurityHeaders(
          NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        );
      }

      // Redirect to login for pages
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }
  }

  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
