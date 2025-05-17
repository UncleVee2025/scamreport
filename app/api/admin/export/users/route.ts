import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { exportUsersToPDF } from "@/lib/pdf-generator"

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    // This would be implemented with your auth system

    // Get all users
    const users = await query(`SELECT * FROM users ORDER BY created_at DESC`)

    // Generate PDF
    const doc = exportUsersToPDF(users)

    // Convert to base64
    const pdfBase64 = doc.output("datauristring")

    return NextResponse.json({
      success: true,
      data: pdfBase64,
    })
  } catch (error) {
    console.error("Error exporting users:", error)
    return NextResponse.json({ success: false, error: "Failed to export users" }, { status: 500 })
  }
}
