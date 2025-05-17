import { NextResponse } from "next/server"
import { hash } from "bcryptjs" // Changed from bcrypt to bcryptjs
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await query("SELECT * FROM users WHERE email = ?", [email])
    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Insert user into database
    await query("INSERT INTO users (name, email, password, role, verified) VALUES (?, ?, ?, ?, ?)", [
      name,
      email,
      hashedPassword,
      "user",
      false,
    ])

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
