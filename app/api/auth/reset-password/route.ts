import { NextResponse } from "next/server"
import { hash } from "bcryptjs" // Changed from bcrypt to bcryptjs
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    // Validate input
    if (!token || !password) {
      return NextResponse.json({ error: "Missing token or password" }, { status: 400 })
    }

    // Find reset token
    const tokens = await query("SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()", [token])

    if ((tokens as any[]).length === 0) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    const resetToken = (tokens as any[])[0]

    // Hash new password
    const hashedPassword = await hash(password, 10)

    // Update user password
    await query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, resetToken.email])

    // Delete used token
    await query("DELETE FROM password_resets WHERE token = ?", [token])

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "An error occurred during password reset" }, { status: 500 })
  }
}
