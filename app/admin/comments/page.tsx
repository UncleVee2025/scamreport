"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, XCircle, AlertTriangle, Search, RefreshCw } from "lucide-react"
import { handleApiError } from "@/lib/error-handler"
import { logger, trackAdminAction } from "@/lib/logger"
import { useNewComments } from "@/lib/socket-service"

interface Comment {
  id: number
  report_id: number
  user_id: number
  comment: string
  status: "approved" | "pending" | "flagged" | "rejected"
  sentiment_score: number
  ai_moderated: boolean
  created_at: string
  updated_at: string
  user_name?: string
  report_title?: string
}

export default function AdminCommentsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { newComments, resetCounter } = useNewComments()

  // State
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComments, setSelectedComments] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [page, setPage] = useState(Number.parseInt(searchParams.get("page") || "1", 10))
  const [totalPages, setTotalPages] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)

        // Build query parameters
        const params = new URLSearchParams()
        if (statusFilter !== "all") params.append("status", statusFilter)
        if (searchQuery) params.append("q", searchQuery)
        params.append("page", page.toString())

        const response = await fetch(`/api/admin/comments?${params.toString()}`)

        if (!response.ok) {
          await handleApiError(response)
          return
        }

        const data = await response.json()
        setComments(data.comments)
        setTotalPages(data.totalPages || 1)

        // Reset new comments counter when we fetch
        resetCounter()

        logger.info("Fetched admin comments", "admin-comments", {
          count: data.comments.length,
          filter: statusFilter,
          search: searchQuery,
          page,
        })
      } catch (error) {
        logger.error("Failed to fetch comments", "admin-comments", undefined, error as Error)
        toast({
          title: "Error",
          description: "Failed to load comments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [statusFilter, page, searchQuery, refreshKey, resetCounter])

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setPage(1)
    updateUrl(value, searchQuery, 1)
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    updateUrl(statusFilter, searchQuery, 1)
  }

  // Update URL with filters
  const updateUrl = (status: string, query: string, currentPage: number) => {
    const params = new URLSearchParams()
    if (status !== "all") params.set("status", status)
    if (query) params.set("q", query)
    if (currentPage > 1) params.set("page", currentPage.toString())

    const newUrl = `/admin/comments${params.toString() ? `?${params.toString()}` : ""}`
    router.push(newUrl)
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedComments([])
    } else {
      setSelectedComments(comments.map((comment) => comment.id))
    }
    setSelectAll(!selectAll)
  }

  // Handle individual selection
  const handleSelectComment = (id: number) => {
    if (selectedComments.includes(id)) {
      setSelectedComments(selectedComments.filter((commentId) => commentId !== id))
      setSelectAll(false)
    } else {
      setSelectedComments([...selectedComments, id])
      if (selectedComments.length + 1 === comments.length) {
        setSelectAll(true)
      }
    }
  }

  // Handle bulk approve
  const handleBulkApprove = async () => {
    if (selectedComments.length === 0) return

    try {
      setLoading(true)

      const response = await fetch("/api/admin/comments/bulk-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIds: selectedComments,
          status: "approved",
        }),
      })

      if (!response.ok) {
        await handleApiError(response)
        return
      }

      toast({
        title: "Success",
        description: `${selectedComments.length} comments approved`,
      })

      // Track admin action
      trackAdminAction("bulk_approve_comments", "admin", {
        count: selectedComments.length,
        commentIds: selectedComments,
      })

      // Reset selection and refresh
      setSelectedComments([])
      setSelectAll(false)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      logger.error(
        "Failed to bulk approve comments",
        "admin-comments",
        {
          commentIds: selectedComments,
        },
        error as Error,
      )

      toast({
        title: "Error",
        description: "Failed to approve comments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle bulk reject
  const handleBulkReject = async () => {
    if (selectedComments.length === 0) return

    try {
      setLoading(true)

      const response = await fetch("/api/admin/comments/bulk-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIds: selectedComments,
          status: "rejected",
        }),
      })

      if (!response.ok) {
        await handleApiError(response)
        return
      }

      toast({
        title: "Success",
        description: `${selectedComments.length} comments rejected`,
      })

      // Track admin action
      trackAdminAction("bulk_reject_comments", "admin", {
        count: selectedComments.length,
        commentIds: selectedComments,
      })

      // Reset selection and refresh
      setSelectedComments([])
      setSelectAll(false)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      logger.error(
        "Failed to bulk reject comments",
        "admin-comments",
        {
          commentIds: selectedComments,
        },
        error as Error,
      )

      toast({
        title: "Error",
        description: "Failed to reject comments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center text-red-600">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </div>
        )
      case "flagged":
        return (
          <div className="flex items-center text-amber-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Flagged
          </div>
        )
      default:
        return (
          <div className="flex items-center text-gray-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Pending
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Comment Moderation</CardTitle>
              <CardDescription>
                Manage and moderate user comments
                {newComments > 0 && (
                  <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{newComments} new</span>
                )}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search comments..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Comments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedComments.length > 0 && (
            <div className="bg-muted p-3 rounded-md mb-4 flex items-center justify-between">
              <span>{selectedComments.length} comments selected</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkApprove} disabled={loading}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve All
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkReject} disabled={loading}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject All
                </Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No comments found matching your criteria</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all comments"
                      />
                    </th>
                    <th className="py-2 px-4 text-left">Comment</th>
                    <th className="py-2 px-4 text-left">Report</th>
                    <th className="py-2 px-4 text-left">User</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedComments.includes(comment.id)}
                          onCheckedChange={() => handleSelectComment(comment.id)}
                          aria-label={`Select comment ${comment.id}`}
                        />
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">{comment.comment}</td>
                      <td className="py-3 px-4">{comment.report_title || `Report #${comment.report_id}`}</td>
                      <td className="py-3 px-4">{comment.user_name || `User #${comment.user_id}`}</td>
                      <td className="py-3 px-4">{renderStatusBadge(comment.status)}</td>
                      <td className="py-3 px-4">{new Date(comment.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/comments/${comment.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">{comments.length > 0 && `Showing ${comments.length} comments`}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage(Math.max(1, page - 1))
                updateUrl(statusFilter, searchQuery, Math.max(1, page - 1))
              }}
              disabled={page <= 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage(Math.min(totalPages, page + 1))
                updateUrl(statusFilter, searchQuery, Math.min(totalPages, page + 1))
              }}
              disabled={page >= totalPages || loading}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
