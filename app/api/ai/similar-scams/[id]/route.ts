import { NextResponse } from "next/server"
import { findSimilarScams } from "@/lib/ai-service"
import { query } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, message: "Invalid scam ID" }, { status: 400 })
    }

    // Get the target scam description
    const targetScamResult = (await query("SELECT description FROM scam_reports WHERE id = ?", [id])) as any[]

    if (!targetScamResult.length) {
      return NextResponse.json({ success: false, message: "Scam not found" }, { status: 404 })
    }

    const targetDescription = targetScamResult[0].description

    // Get other scams (limit to 10 for performance)
    const otherScamsResult = (await query("SELECT id, description FROM scam_reports WHERE id != ? LIMIT 10", [
      id,
    ])) as any[]

    // Find similar scams
    const similarScams = await findSimilarScams(targetDescription, otherScamsResult)

    // Get full details of similar scams
    const scamIds = similarScams.map((s) => s.id)

    let matchingScams = []
    if (scamIds.length > 0) {
      const placeholders = scamIds.map(() => "?").join(",")
      matchingScams = await query(
        `SELECT id, title, description, type, status, created_at, 
         (SELECT COUNT(*) FROM me_too WHERE report_id = scam_reports.id) as me_too_count
         FROM scam_reports 
         WHERE id IN (${placeholders})
         ORDER BY FIELD(id, ${placeholders})`,
        [...scamIds, ...scamIds],
      )
    }

    return NextResponse.json({
      success: true,
      data: matchingScams,
    })
  } catch (error) {
    console.error("Error finding similar scams:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to find similar scams",
      },
      { status: 500 },
    )
  }
}
