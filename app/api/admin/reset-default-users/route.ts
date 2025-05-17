import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { query } from "@/lib/db"

// This is an admin-only endpoint to reset the default users
export async function POST(request: Request) {
  try {
    // In a real app, you would check for admin authentication here
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    if (token !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Reset admin user
    const adminPassword = await hash("admin123", 10)
    await query("UPDATE users SET password = ? WHERE email = ?", [adminPassword, "admin@example.com"])

    // Reset regular user
    const userPassword = await hash("password123", 10)
    await query("UPDATE users SET password = ? WHERE email = ?", [userPassword, "user@example.com"])

    return NextResponse.json({ success: true, message: "Default users reset successfully" })
  } catch (error) {
    console.error("Error resetting default users:", error)
    return NextResponse.json({ error: "Failed to reset default users" }, { status: 500 })
  }
}
