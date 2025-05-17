import { NextResponse } from "next/server"
import { createAdvertisement, getAllAdvertisements } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const advertisements = await getAllAdvertisements()
    return NextResponse.json({ advertisements })
  } catch (error) {
    console.error("Error fetching advertisements:", error)
    return NextResponse.json({ error: "Failed to fetch advertisements" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const result = await createAdvertisement(data)

    return NextResponse.json({
      message: "Advertisement created successfully",
      id: result.insertId,
    })
  } catch (error) {
    console.error("Error creating advertisement:", error)
    return NextResponse.json({ error: "Failed to create advertisement" }, { status: 500 })
  }
}
