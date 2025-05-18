import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ valid: false, message: "Token is required" }, { status: 400 })
    }

    // Check if token exists and is not expired
    const users = await query("SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?", [
      token,
      new Date(),
    ])

    if (!users || users.length === 0) {
      return NextResponse.json({ valid: false, message: "Invalid or expired token" })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ valid: false, message: "Failed to verify token" }, { status: 500 })
  }
}
