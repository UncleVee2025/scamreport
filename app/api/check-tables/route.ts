import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // Check if comments table exists
    const tables = await query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `,
      [process.env.DB_NAME],
    )

    return NextResponse.json({
      success: true,
      tables: tables.map((t) => t.table_name),
    })
  } catch (error) {
    console.error("Error checking tables:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check tables",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
