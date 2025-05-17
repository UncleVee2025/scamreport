import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// Toggle "Me Too" for a scam report
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const reportId = Number.parseInt(params.id)

    if (!userId || isNaN(reportId)) {
      return NextResponse.json({ success: false, message: "Invalid user ID or report ID" }, { status: 400 })
    }

    // Check if user already clicked "Me Too"
    const existingMeToo: any[] = await query("SELECT id FROM me_too WHERE report_id = ? AND user_id = ?", [
      reportId,
      userId,
    ])

    if (existingMeToo.length > 0) {
      // User already clicked "Me Too", so remove it
      await query("DELETE FROM me_too WHERE report_id = ? AND user_id = ?", [reportId, userId])

      // Get updated count
      const countResult: any[] = await query("SELECT COUNT(*) as count FROM me_too WHERE report_id = ?", [reportId])

      return NextResponse.json({
        success: true,
        action: "removed",
        count: countResult[0].count,
      })
    } else {
      // User hasn't clicked "Me Too" yet, so add it
      await query("INSERT INTO me_too (report_id, user_id) VALUES (?, ?)", [reportId, userId])

      // Create notification for the report owner
      const reportInfo: any[] = await query("SELECT user_id FROM scam_reports WHERE id = ?", [reportId])

      if (reportInfo.length > 0 && reportInfo[0].user_id !== userId) {
        await query(
          `INSERT INTO notifications (user_id, type, message, related_id) 
           VALUES (?, 'me_too', 'Someone clicked "Me Too" on your scam report', ?)`,
          [reportInfo[0].user_id, reportId],
        )
      }

      // Get updated count
      const countResult: any[] = await query("SELECT COUNT(*) as count FROM me_too WHERE report_id = ?", [reportId])

      return NextResponse.json({
        success: true,
        action: "added",
        count: countResult[0].count,
      })
    }
  } catch (error) {
    console.error("Error toggling Me Too:", error)
    return NextResponse.json({ success: false, message: "Failed to toggle Me Too" }, { status: 500 })
  }
}

// Get "Me Too" count for a scam report
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const reportId = Number.parseInt(params.id)

    if (isNaN(reportId)) {
      return NextResponse.json({ success: false, message: "Invalid report ID" }, { status: 400 })
    }

    const result: any[] = await query("SELECT COUNT(*) as count FROM me_too WHERE report_id = ?", [reportId])

    return NextResponse.json({
      success: true,
      count: result[0].count,
    })
  } catch (error) {
    console.error("Error getting Me Too count:", error)
    return NextResponse.json({ success: false, message: "Failed to get Me Too count" }, { status: 500 })
  }
}
