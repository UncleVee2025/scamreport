import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// List of public paths that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/reset-password",
  "/new-password",
  "/otp-verification",
  "/auth",
  "/api/auth",
  "/api/register",
  "/api/health",
  "/offline",
  "/favicon.ico",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
]

// List of paths that start with these prefixes and are public
const publicPathPrefixes = ["/_next", "/images", "/fonts", "/icons"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle cron job for checking expiring advertisements
  if (pathname === "/api/cron/check-expiring-ads") {
    // Verify cron job secret
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || token !== cronSecret) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return NextResponse.next()
  }

  // Check if the path is public
  const isPublicPath =
    publicPaths.some((path) => pathname === path) || publicPathPrefixes.some((prefix) => pathname.startsWith(prefix))

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // For API routes, return 401 Unauthorized instead of redirecting
  if (pathname.startsWith("/api/")) {
    // Check for authentication token in the request
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.next()
  }

  // For non-API routes, check for authentication and redirect to login if not authenticated
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If user is not authenticated, redirect to login page
  if (!session) {
    const url = new URL("/auth", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Update the matcher to include all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image).*)",
  ],
}
