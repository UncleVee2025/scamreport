import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { userId, fullName, email, phone, location } = data

    if (!userId || !fullName || !email) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Update user profile in database
    await query(
      `UPDATE users 
       SET full_name = ?, email = ?, phone = ?, location = ?
       WHERE id = ?`,
      [fullName, email, phone || null, location || null, userId],
    )

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: { id: userId, fullName, email, phone, location },
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    const users = await query(
      `SELECT id, full_name, email, phone, location, role, created_at
       FROM users
       WHERE id = ?`,
      [userId],
    )

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: users[0],
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch profile" }, { status: 500 })
  }
}
