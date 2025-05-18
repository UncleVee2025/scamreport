import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Get the first scam report ID
    const reports = await query("SELECT id FROM scam_reports LIMIT 1")

    if (reports.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No scam reports found",
        },
        { status: 404 },
      )
    }

    const reportId = reports[0].id

    // Add a test comment
    const result = await query(
      "INSERT INTO comments (report_id, user_id, comment, status) VALUES (?, 1, 'This is a test comment', 'approved')",
      [reportId],
    )

    return NextResponse.json({
      success: true,
      message: "Test comment added successfully",
      commentId: result.insertId,
      reportId: reportId,
    })
  } catch (error) {
    console.error("Error adding test comment:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add test comment",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
