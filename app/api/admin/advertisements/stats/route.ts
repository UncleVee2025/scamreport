import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { format, addDays } from "date-fns"

export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const today = format(new Date(), "yyyy-MM-dd")
    const thirtyDaysFromNow = format(addDays(new Date(), 30), "yyyy-MM-dd")

    // Get total count
    const [totalResult] = await pool.execute("SELECT COUNT(*) as total FROM advertisements")
    const total = totalResult[0].total

    // Get active count
    const [activeResult] = await pool.execute(
      `SELECT COUNT(*) as active FROM advertisements 
       WHERE is_active = TRUE 
       AND start_date <= ? 
       AND end_date >= ?`,
      [today, today],
    )
    const active = activeResult[0].active

    // Get expiring soon count
    const [expiringSoonResult] = await pool.execute(
      `SELECT COUNT(*) as expiringSoon FROM advertisements 
       WHERE is_active = TRUE 
       AND end_date > ? 
       AND end_date <= ?`,
      [today, thirtyDaysFromNow],
    )
    const expiringSoon = expiringSoonResult[0].expiringSoon

    // Get expired count
    const [expiredResult] = await pool.execute(
      `SELECT COUNT(*) as expired FROM advertisements 
       WHERE end_date < ?`,
      [today],
    )
    const expired = expiredResult[0].expired

    // Calculate estimated revenue (simplified calculation)
    // Assuming different rates for different package durations
    const [revenueResult] = await pool.execute(
      `SELECT 
         SUM(CASE 
           WHEN package_duration = '3months' THEN 1500
           WHEN package_duration = '6months' THEN 2700
           WHEN package_duration = '9months' THEN 3800
           WHEN package_duration = '12months' THEN 4800
           ELSE 0
         END) as revenue
       FROM advertisements
       WHERE is_active = TRUE 
       AND start_date <= ? 
       AND end_date >= ?`,
      [today, today],
    )
    const revenue = revenueResult[0].revenue || 0

    return NextResponse.json({
      stats: {
        total,
        active,
        expiringSoon,
        expired,
        revenue,
      },
    })
  } catch (error) {
    console.error("Error fetching advertisement stats:", error)
    return NextResponse.json({ error: "Failed to fetch advertisement stats" }, { status: 500 })
  }
}
