import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// Get content by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const contentId = Number.parseInt(params.id)

    if (isNaN(contentId)) {
      return NextResponse.json({ success: false, message: "Invalid content ID" }, { status: 400 })
    }

    const content = await query("SELECT * FROM content WHERE id = ?", [contentId])

    if (content.length === 0) {
      return NextResponse.json({ success: false, message: "Content not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: content[0] })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch content" }, { status: 500 })
  }
}

// Update content
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const contentId = Number.parseInt(params.id)
    const data = await request.json()
    const { title, slug, type, content, status, author } = data

    if (isNaN(contentId)) {
      return NextResponse.json({ success: false, message: "Invalid content ID" }, { status: 400 })
    }

    // Validate required fields
    if (!title || !slug || !type || !content) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Check if slug already exists for other content
    const existingContent = await query("SELECT id FROM content WHERE slug = ? AND id != ?", [slug, contentId])
    if (existingContent.length > 0) {
      return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 400 })
    }

    // Update content
    await query(
      `UPDATE content 
       SET title = ?, slug = ?, type = ?, content = ?, status = ?, author = ?, updated_at = NOW()
       WHERE id = ?`,
      [title, slug, type, content, status || "draft", author || "Admin", contentId],
    )

    return NextResponse.json({
      success: true,
      message: "Content updated successfully",
    })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ success: false, message: "Failed to update content" }, { status: 500 })
  }
}

// Delete content
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const contentId = Number.parseInt(params.id)

    if (isNaN(contentId)) {
      return NextResponse.json({ success: false, message: "Invalid content ID" }, { status: 400 })
    }

    // Check if content exists
    const content = await query("SELECT id FROM content WHERE id = ?", [contentId])
    if (content.length === 0) {
      return NextResponse.json({ success: false, message: "Content not found" }, { status: 404 })
    }

    // Delete content
    await query("DELETE FROM content WHERE id = ?", [contentId])

    return NextResponse.json({
      success: true,
      message: "Content deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting content:", error)
    return NextResponse.json({ success: false, message: "Failed to delete content" }, { status: 500 })
  }
}
