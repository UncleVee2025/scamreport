import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { exportMeTooPDF } from "@/lib/pdf-generator"

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    // This would be implemented with your auth system

    // Get me too data with scam details
    const meTooData = await query(
      `SELECT s.id as scam_id, s.title as scam_title, 
        COUNT(m.id) as count,
        MAX(m.created_at) as last_updated
       FROM scams s
       JOIN me_too m ON s.id = m.scam_id
       GROUP BY s.id, s.title
       ORDER BY count DESC`,
    )

    // Generate PDF
    const doc = exportMeTooPDF(meTooData)

    // Convert to base64
    const pdfBase64 = doc.output("datauristring")

    return NextResponse.json({
      success: true,
      data: pdfBase64,
    })
  } catch (error) {
    console.error("Error exporting me too data:", error)
    return NextResponse.json({ success: false, error: "Failed to export me too data" }, { status: 500 })
  }
}
