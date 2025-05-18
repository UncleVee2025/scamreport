import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const commentId = Number.parseInt(params.id)

    if (isNaN(commentId)) {
      return NextResponse.json({ success: false, message: "Invalid comment ID" }, { status: 400 })
    }

    if (!["approved", "pending", "flagged", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 })
    }

    // Update the comment status
    await query("UPDATE comments SET status = ? WHERE id = ?", [status, commentId])

    // Get the updated comment
    const updatedComment = await query(
      `
      SELECT 
        c.id, 
        c.comment, 
        c.created_at,
        c.status,
        c.report_id,
        c.user_id,
        CASE WHEN u.role = 'admin' THEN TRUE ELSE FALSE END as is_official,
        u.full_name as user_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `,
      [commentId],
    )

    if (updatedComment.length === 0) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 })
    }

    // Create notification for the comment owner
    if (updatedComment[0].user_id) {
      let message = ""
      switch (status) {
        case "approved":
          message = "Your comment has been approved"
          break
        case "rejected":
          message = "Your comment has been rejected"
          break
        case "flagged":
          message = "Your comment has been flagged for review"
          break
      }

      if (message) {
        await query(
          `INSERT INTO notifications (user_id, type, message, related_id) 
           VALUES (?, 'comment_status', ?, ?)`,
          [updatedComment[0].user_id, message, commentId],
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: `Comment status updated to ${status}`,
      data: updatedComment[0],
    })
  } catch (error) {
    console.error("Error updating comment status:", error)
    return NextResponse.json({ success: false, message: "Failed to update comment status" }, { status: 500 })
  }
}
