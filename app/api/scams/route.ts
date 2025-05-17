import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// Get all scams
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let sql = `
      SELECT 
        sr.id, 
        sr.category, 
        sr.title, 
        sr.description, 
        sr.scammer_name,
        sr.date_of_incident, 
        sr.location, 
        sr.status, 
        sr.created_at,
        sr.is_anonymous,
        CASE WHEN sr.is_anonymous = 1 THEN 'Anonymous' ELSE u.full_name END as reporter_name,
        (SELECT COUNT(*) FROM me_too WHERE report_id = sr.id) as me_too_count,
        (SELECT COUNT(*) FROM comments WHERE report_id = sr.id) as comment_count
      FROM scam_reports sr
      LEFT JOIN users u ON sr.user_id = u.id
      WHERE 1=1
    `

    const params: any[] = []

    if (category) {
      sql += " AND sr.category = ?"
      params.push(category)
    }

    if (status) {
      sql += " AND sr.status = ?"
      params.push(status)
    }

    sql += " ORDER BY sr.created_at DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const results = await query(sql, params)

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error("Error fetching scams:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch scams" }, { status: 500 })
  }
}

// Create a new scam report
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      userId,
      category,
      title,
      description,
      scammerName,
      dateOfIncident,
      location,
      moneyInvolved,
      amountScammed,
      whatWasScammed,
      policeCase,
      isAnonymous,
      allowComments,
    } = data

    // Validate required fields
    if (!userId || !category || !title || !description || !scammerName) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const sql = `
      INSERT INTO scam_reports (
        user_id, 
        category, 
        title, 
        description, 
        scammer_name, 
        date_of_incident, 
        location, 
        money_involved, 
        amount_scammed, 
        what_was_scammed, 
        police_case, 
        is_anonymous, 
        allow_comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      userId,
      category,
      title,
      description,
      scammerName,
      dateOfIncident || null,
      location || null,
      moneyInvolved ? 1 : 0,
      amountScammed || null,
      whatWasScammed || null,
      policeCase || null,
      isAnonymous ? 1 : 0,
      allowComments ? 1 : 0,
    ]

    const result: any = await query(sql, params)

    return NextResponse.json({
      success: true,
      message: "Scam report created successfully",
      data: { id: result.insertId },
    })
  } catch (error) {
    console.error("Error creating scam report:", error)
    return NextResponse.json({ success: false, message: "Failed to create scam report" }, { status: 500 })
  }
}
