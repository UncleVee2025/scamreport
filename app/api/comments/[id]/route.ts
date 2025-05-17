import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// Delete a comment
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const commentId = Number.parseInt(params.id)

    if (isNaN(commentId)) {
      return NextResponse.json({ success: false, message: "Invalid comment ID" }, { status: 400 })
    }

    // Check if the comment exists
    const commentInfo: any[] = await query("SELECT id FROM comments WHERE id = ?", [commentId])

    if (commentInfo.length === 0) {
      return NextResponse.json({ success: false, message: "Comment not found" }, { status: 404 })
    }

    // Delete the comment
    await query("DELETE FROM comments WHERE id = ?", [commentId])

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ success: false, message: "Failed to delete comment" }, { status: 500 })
  }
}
