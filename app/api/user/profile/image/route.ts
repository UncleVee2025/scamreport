import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { query } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const userId = formData.get("userId") as string
    const image = formData.get("image") as File

    if (!userId || !image) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Create a unique filename
    const fileExtension = image.name.split(".").pop()
    const fileName = `user-${userId}-${Date.now()}.${fileExtension}`
    const filePath = `/images/profiles/${fileName}`
    const fullPath = join(process.cwd(), "public", filePath)

    // Convert the file to an ArrayBuffer
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save the file to the public directory
    await writeFile(fullPath, buffer)

    // Update the user's avatar in the database
    await query(
      `UPDATE users 
       SET avatar = ?
       WHERE id = ?`,
      [filePath, userId],
    )

    return NextResponse.json({
      success: true,
      message: "Profile image updated successfully",
      imageUrl: filePath,
    })
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return NextResponse.json({ success: false, message: "Failed to upload profile image" }, { status: 500 })
  }
}
