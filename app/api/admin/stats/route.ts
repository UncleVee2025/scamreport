import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db-service"
import { createErrorResponse, ErrorType, ErrorCode } from "@/lib/error-handler"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    // Get counts for different entities
    const [
      pendingReportsResult,
      pendingCommentsResult,
      totalUsersResult,
      totalReportsResult,
      recentReportsResult,
      recentCommentsResult,
    ] = await Promise.all([
      // Pending reports count
      executeQuery<{ count: number }>("SELECT COUNT(*) as count FROM scam_reports WHERE status = ?", ["pending"]),

      // Pending comments count
      executeQuery<{ count: number }>("SELECT COUNT(*) as count FROM comments WHERE status = ?", ["pending"]),

      // Total users count
      executeQuery<{ count: number }>("SELECT COUNT(*) as count FROM users"),

      // Total reports count
      executeQuery<{ count: number }>("SELECT COUNT(*) as count FROM scam_reports"),

      // Recent reports (last 5)
      executeQuery(
        `SELECT sr.id, sr.title, sr.status, sr.created_at, u.full_name as user_name
         FROM scam_reports sr
         LEFT JOIN users u ON sr.user_id = u.id
         ORDER BY sr.created_at DESC
         LIMIT 5`,
      ),

      // Recent comments (last 5)
      executeQuery(
        `SELECT c.id, c.comment, c.status, c.created_at, 
                u.full_name as user_name, sr.title as report_title, sr.id as report_id
         FROM comments c
         LEFT JOIN users u ON c.user_id = u.id
         LEFT JOIN scam_reports sr ON c.report_id = sr.id
         ORDER BY c.created_at DESC
         LIMIT 5`,
      ),
    ])

    // Calculate growth percentages (mock data for now)
    const userGrowth = 12 // 12% growth
    const reportGrowth = 18 // 18% growth

    // Compile stats
    const stats = {
      counts: {
        pendingReports: pendingReportsResult[0]?.count || 0,
        pendingComments: pendingCommentsResult[0]?.count || 0,
        totalUsers: totalUsersResult[0]?.count || 0,
        totalReports: totalReportsResult[0]?.count || 0,
      },
      growth: {
        users: userGrowth,
        reports: reportGrowth,
      },
      recent: {
        reports: recentReportsResult,
        comments: recentCommentsResult,
      },
    }

    logger.info("Admin stats fetched", "admin-stats")

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    logger.error("Error fetching admin stats", "admin-stats", undefined, error as Error)

    return createErrorResponse(
      "Failed to fetch admin statistics",
      ErrorType.SERVER,
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
    )
  }
}
