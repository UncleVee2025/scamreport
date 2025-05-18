import { NextResponse } from "next/server"
import { executeTransaction } from "@/lib/db-service"
import { createErrorResponse, ErrorType, ErrorCode } from "@/lib/error-handler"
import { logger } from "@/lib/logger"
import { getSocket } from "@/lib/socket-service"

export async function POST(request: Request) {
  try {
    const { commentIds, status } = await request.json()

    // Validate input
    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return createErrorResponse(
        "Comment IDs are required and must be an array",
        ErrorType.VALIDATION,
        ErrorCode.INVALID_INPUT,
        400,
      )
    }

    if (!status || !["approved", "pending", "flagged", "rejected"].includes(status)) {
      return createErrorResponse(
        "Status is required and must be one of: approved, pending, flagged, rejected",
        ErrorType.VALIDATION,
        ErrorCode.INVALID_INPUT,
        400,
      )
    }

    // Prepare queries for transaction
    const updateQueries = commentIds.map((id) => ({
      query: "UPDATE comments SET status = ?, updated_at = NOW() WHERE id = ?",
      params: [status, id],
    }))

    // Execute transaction
    await executeTransaction(updateQueries)

    // Log the action
    logger.info("Bulk comment status update", "admin-comments", {
      commentIds,
      status,
      count: commentIds.length,
    })

    // Emit socket event for real-time updates
    const io = getSocket()
    if (io) {
      io.to("admin-room").emit("comments-updated", {
        commentIds,
        status,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      message: `${commentIds.length} comments updated to ${status}`,
      updatedCount: commentIds.length,
    })
  } catch (error) {
    logger.error("Error updating comment status in bulk", "admin-comments", undefined, error as Error)

    return createErrorResponse(
      "Failed to update comment status",
      ErrorType.SERVER,
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
    )
  }
}
