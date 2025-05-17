import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// Get comments for a scam report
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const reportId = Number.parseInt(params.id)

    if (isNaN(reportId)) {
      return NextResponse.json({ success: false, message: "Invalid report ID" }, { status: 400 })
    }

    const comments = await query(
      `
      SELECT 
        c.id, 
        c.comment, 
        c.created_at,
        c.user_id,
        CASE WHEN u.role = 'admin' THEN TRUE ELSE FALSE END as is_official,
        CASE WHEN u.id IS NULL THEN 'Deleted User' ELSE u.full_name END as user_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.report_id = ?
      ORDER BY c.created_at DESC
    `,
      [reportId],
    )

    return NextResponse.json({ success: true, data: comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch comments" }, { status: 500 })
  }
}

// Add a comment to a scam report
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId, comment } = await request.json()
    const reportId = Number.parseInt(params.id)

    if (!comment || isNaN(reportId)) {
      return NextResponse.json({ success: false, message: "Invalid comment or report ID" }, { status: 400 })
    }

    // Check if comments are allowed for this report
    const reportInfo: any[] = await query("SELECT allow_comments, user_id FROM scam_reports WHERE id = ?", [reportId])

    if (reportInfo.length === 0) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 })
    }

    if (!reportInfo[0].allow_comments) {
      return NextResponse.json({ success: false, message: "Comments are disabled for this report" }, { status: 403 })
    }

    // Add the comment
    const result: any = await query("INSERT INTO comments (report_id, user_id, comment) VALUES (?, ?, ?)", [
      reportId,
      userId,
      comment,
    ])

    // Create notification for the report owner (if not the same user)
    if (reportInfo[0].user_id && reportInfo[0].user_id !== userId) {
      await query(
        `INSERT INTO notifications (user_id, type, message, related_id) 
         VALUES (?, 'comment', 'Someone commented on your scam report', ?)`,
        [reportInfo[0].user_id, reportId],
      )
    }

    // Get the newly created comment with user info
    const newComment = await query(
      `
      SELECT 
        c.id, 
        c.comment, 
        c.created_at,
        c.user_id,
        CASE WHEN u.role = 'admin' THEN TRUE ELSE FALSE END as is_official,
        u.full_name as user_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `,
      [result.insertId],
    )

    return NextResponse.json({
      success: true,
      message: "Comment added successfully",
      data: newComment[0],
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ success: false, message: "Failed to add comment" }, { status: 500 })
  }
}
