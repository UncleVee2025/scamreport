import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let statusFilter = ""
    if (status !== "all") {
      statusFilter = `AND c.status = '${status}'`
    }

    const comments = await query(
      `
      SELECT 
        c.id, 
        c.comment, 
        c.created_at,
        c.status,
        c.report_id,
        c.user_id,
        CASE WHEN u.role = 'admin' THEN TRUE ELSE FALSE END as is_official,
        CASE WHEN u.id IS NULL THEN 'Deleted User' ELSE u.full_name END as user_name,
        sr.title as report_title
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN scam_reports sr ON c.report_id = sr.id
      WHERE 1=1 ${statusFilter}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [limit, offset],
    )

    // Get total count for pagination
    const countResult = await query(
      `
      SELECT COUNT(*) as total
      FROM comments c
      WHERE 1=1 ${statusFilter}
    `,
    )

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        total: countResult[0].total,
        page,
        limit,
        pages: Math.ceil(countResult[0].total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch comments" }, { status: 500 })
  }
}
