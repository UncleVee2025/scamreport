import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    const connection = await pool.getConnection()

    // Check if comments table has the right structure
    try {
      await connection.query(`
        SELECT id, report_id, user_id, comment, status, created_at 
        FROM comments LIMIT 1
      `)
    } catch (error) {
      // If error, table might be missing or have wrong structure
      console.log("Attempting to fix comments table...")

      // Check if table exists
      const [tables] = await connection.query(`
        SHOW TABLES LIKE 'comments'
      `)

      if (Array.isArray(tables) && tables.length === 0) {
        // Create table if it doesn't exist
        await connection.query(`
          CREATE TABLE comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            report_id INT NOT NULL,
            user_id INT NOT NULL,
            comment TEXT NOT NULL,
            status ENUM('approved', 'pending', 'flagged', 'rejected') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `)
      } else {
        // Table exists but might be missing columns
        try {
          await connection.query(
            `ALTER TABLE comments ADD COLUMN status ENUM('approved', 'pending', 'flagged', 'rejected') DEFAULT 'pending'`,
          )
          console.log("Added status column to comments table")
        } catch (e) {
          console.log("Status column might already exist")
        }
      }
    }

    connection.release()

    return NextResponse.json({
      success: true,
      message: "Schema check completed",
    })
  } catch (error) {
    console.error("Schema check error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Schema check failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
