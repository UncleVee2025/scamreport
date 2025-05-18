import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Basic search implementation
    const scams = await db.query(
      `
      SELECT * FROM scam_reports 
      WHERE 
        (title LIKE ? OR description LIKE ? OR perpetrator_info LIKE ?) 
        AND status = 'verified'
      ORDER BY created_at DESC
      LIMIT 20
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`],
    )

    return NextResponse.json({ scams })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "An error occurred during search" }, { status: 500 })
  }
}
