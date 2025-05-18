import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(request: Request) {
  try {
    // Get the token from the request
    const token = await getToken({
      req: request as any,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If no token, return unauthorized
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return success with user info
    return NextResponse.json({
      authenticated: true,
      user: {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 })
  }
}
