import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: "Token and password are required" }, { status: 400 })
    }

    // Check if token exists and is not expired
    const users = await query("SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?", [
      token,
      new Date(),
    ])

    if (!users || users.length === 0) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10)

    // Update the user's password and clear the reset token
    await query("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?", [
      hashedPassword,
      token,
    ])

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json({ message: "Failed to update password" }, { status: 500 })
  }
}
