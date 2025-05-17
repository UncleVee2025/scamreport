import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { query } from "@/lib/db"
import { sign } from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // DEMO MODE: Allow any credentials
    // In a production environment, you would remove this and use proper authentication
    const isDemoMode = true // Set to false when going to production

    if (isDemoMode) {
      // Generate a demo token
      const token = sign(
        {
          id: 999,
          email: email,
          role: email.includes("admin") ? "admin" : "user",
        },
        process.env.NEXTAUTH_SECRET || "your-fallback-secret",
        { expiresIn: "7d" },
      )

      // Return demo user info
      return NextResponse.json({
        success: true,
        user: {
          id: 999,
          name: email.split("@")[0],
          email: email,
          role: email.includes("admin") ? "admin" : "user",
        },
        token: token,
      })
    }

    // PRODUCTION MODE: Below is the normal authentication logic
    // Find user
    const users = await query("SELECT * FROM users WHERE email = ?", [email])
    if ((users as any[]).length === 0) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    const user = (users as any[])[0]

    // Special case for default users with hardcoded credentials
    let passwordMatch = false

    if (
      (email === "admin@example.com" && password === "admin123") ||
      (email === "user@example.com" && password === "password123")
    ) {
      passwordMatch = true
    } else {
      // Regular password comparison for other users
      passwordMatch = await compare(password, user.password)
    }

    if (!passwordMatch) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Create token
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET || "your-fallback-secret",
      { expiresIn: "7d" },
    )

    // Return user info and token
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 })
  }
}
