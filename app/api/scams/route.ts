import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { writeFile } from "fs/promises"
import { join } from "path"

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
    // Handle form data for file uploads
    const formData = await request.formData()

    // Extract data from form
    const userId = formData.get("userId") || "1" // Default to user 1 for demo
    const reportType = formData.get("reportType") as string
    const category = formData.get("category") as string
    const title = formData.get("scammerName") as string // Use scammer name as title
    const description = formData.get("description") as string
    const scammerName = formData.get("scammerName") as string
    const dateOfIncident = formData.get("date") as string
    const location = formData.get("location") as string
    const moneyInvolved = formData.get("moneyInvolved") === "yes"
    const amountScammed = formData.get("amountScammed") as string
    const whatWasScammed = formData.get("whatWasScammed") as string
    const policeCase = formData.get("policeCase") as string
    const isAnonymous = formData.get("isAnonymous") === "true"
    const allowComments = formData.get("allowComments") === "true"
    const evidence = formData.get("evidence") as File | null

    // Validate required fields
    if (!category || !title || !description || !scammerName) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Handle file upload if evidence is provided
    let evidenceUrl = null
    if (evidence) {
      const fileExtension = evidence.name.split(".").pop()
      const fileName = `evidence-${Date.now()}.${fileExtension}`
      const filePath = `/uploads/evidence/${fileName}`
      const fullPath = join(process.cwd(), "public", filePath)

      // Convert the file to an ArrayBuffer
      const bytes = await evidence.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Save the file
      await writeFile(fullPath, buffer)
      evidenceUrl = filePath
    }

    // Insert into database
    const sql = `
      INSERT INTO scam_reports (
        user_id, 
        title, 
        description, 
        type, 
        category,
        scammer_name, 
        date_occurred, 
        location, 
        money_involved, 
        amount_lost, 
        what_was_scammed, 
        police_case, 
        evidence_url,
        is_anonymous, 
        allow_comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      userId,
      title,
      description,
      reportType,
      category,
      scammerName,
      dateOfIncident || null,
      location || null,
      moneyInvolved ? 1 : 0,
      amountScammed || null,
      whatWasScammed || null,
      policeCase || null,
      evidenceUrl,
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
