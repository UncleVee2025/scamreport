import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { exportScamReportsToPDF } from "@/lib/pdf-generator"

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    // This would be implemented with your auth system

    // Get all scam reports
    const reports = await query(
      `SELECT s.*, 
        (SELECT COUNT(*) FROM me_too WHERE scam_id = s.id) as me_too_count
       FROM scams s
       ORDER BY s.created_at DESC`,
    )

    // Generate PDF
    const doc = exportScamReportsToPDF(reports)

    // Convert to base64
    const pdfBase64 = doc.output("datauristring")

    return NextResponse.json({
      success: true,
      data: pdfBase64,
    })
  } catch (error) {
    console.error("Error exporting scam reports:", error)
    return NextResponse.json({ success: false, error: "Failed to export scam reports" }, { status: 500 })
  }
}
