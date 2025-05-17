import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Simple query to check database connection
    const result = await query("SELECT 1 as test")

    return NextResponse.json({
      status: "ok",
      database: "connected",
      result,
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
