import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { exportCommentsToPDF } from "@/lib/pdf-generator"

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    // This would be implemented with your auth system

    // Get comments with user and scam details
    const comments = await query(
      `SELECT c.*, u.name as user_name, s.title as scam_title
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       JOIN scams s ON c.scam_id = s.id
       ORDER BY c.created_at DESC`,
    )

    // Generate PDF
    const doc = exportCommentsToPDF(comments)

    // Convert to base64
    const pdfBase64 = doc.output("datauristring")

    return NextResponse.json({
      success: true,
      data: pdfBase64,
    })
  } catch (error) {
    console.error("Error exporting comments:", error)
    return NextResponse.json({ success: false, error: "Failed to export comments" }, { status: 500 })
  }
}
