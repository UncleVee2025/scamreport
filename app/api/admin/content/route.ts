import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// Get all content
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    let sql = `
      SELECT * FROM content
      WHERE 1=1
    `

    const params: any[] = []

    if (type && type !== "all") {
      sql += " AND type = ?"
      params.push(type)
    }

    if (status && status !== "all") {
      sql += " AND status = ?"
      params.push(status)
    }

    sql += " ORDER BY created_at DESC"

    const results = await query(sql, params)

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch content" }, { status: 500 })
  }
}

// Create new content
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { title, slug, type, content, status, author } = data

    // Validate required fields
    if (!title || !slug || !type || !content) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Check if slug already exists
    const existingContent = await query("SELECT id FROM content WHERE slug = ?", [slug])
    if (existingContent.length > 0) {
      return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 400 })
    }

    // Insert into database
    const result: any = await query(
      `INSERT INTO content (title, slug, type, content, status, author, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, slug, type, content, status || "draft", author || "Admin"],
    )

    return NextResponse.json({
      success: true,
      message: "Content created successfully",
      data: { id: result.insertId },
    })
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json({ success: false, message: "Failed to create content" }, { status: 500 })
  }
}

// Let's create the content table if it doesn't exist
export async function initContentTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        type VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        status ENUM('published', 'draft', 'archived') DEFAULT 'draft',
        author VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log("Content table initialized")
    return true
  } catch (error) {
    console.error("Error initializing content table:", error)
    throw error
  }
}

// Initialize the content table when the module is loaded
initContentTable().catch(console.error)
