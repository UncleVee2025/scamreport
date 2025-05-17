"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Search, Filter, CheckCircle, X, Eye, MessageSquare, Flag, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CommentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState([])

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setComments([
        {
          id: 1,
          content:
            "I received the same scam email yesterday. They asked for my bank details claiming my account was suspended.",
          reportTitle: "FNB Account Suspension Scam",
          reportId: 101,
          user: {
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          date: "2023-05-15T14:30:00",
          status: "approved",
          likes: 8,
          flags: 0,
        },
        {
          id: 2,
          content: "This is definitely a scam. I lost N$5,000 to these people last month. Everyone should be careful!",
          reportTitle: "Namibia Mining Investment Scam",
          reportId: 102,
          user: {
            name: "Sarah Smith",
            email: "sarah.smith@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          date: "2023-05-14T09:15:00",
          status: "approved",
          likes: 15,
          flags: 0,
        },
        {
          id: 3,
          content:
            "This comment contains inappropriate language and personal attacks that violate our community guidelines.",
          reportTitle: "WhatsApp Investment Group Scam",
          reportId: 103,
          user: {
            name: "Michael Brown",
            email: "michael.brown@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          date: "2023-05-13T16:45:00",
          status: "flagged",
          likes: 2,
          flags: 5,
        },
        {
          id: 4,
          content: "I think this might be a legitimate business. I've worked with them before without any issues.",
          reportTitle: "Fake Property Rental in Windhoek",
          reportId: 104,
          user: {
            name: "Lisa Johnson",
            email: "lisa.johnson@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          date: "2023-05-12T11:20:00",
          status: "pending",
          likes: 1,
          flags: 3,
        },
        {
          id: 5,
          content: "This is spam advertising another service. Not relevant to the scam report.",
          reportTitle: "Cryptocurrency Mining Investment",
          reportId: 105,
          user: {
            name: "David Williams",
            email: "david.williams@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          date: "2023-05-11T08:30:00",
          status: "rejected",
          likes: 0,
          flags: 7,
        },
        {
          id: 6,
          content: "I can confirm this is a scam. They also contacted me via WhatsApp with the same offer.",
          reportTitle: "FNB Account Suspension Scam",
          reportId: 101,
          user: {
            name: "Emma Wilson",
            email: "emma.wilson@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          date: "2023-05-10T15:40:00",
          status: "approved",
          likes: 12,
          flags: 0,
        },
        {
          id: 7,
          content: "Thanks for reporting this. I almost fell for it but saw your post just in time.",
          reportTitle: "Namibia Mining Investment Scam",
          reportId: 102,
          user: {
            name: "James Taylor",
            email: "james.taylor@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
          },
          date: "2023-05-09T13:10:00",
          status: "approved",
          likes: 18,
          flags: 0,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter comments based on search query and status filter
  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.reportTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || comment.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleStatusChange = (commentId, newStatus) => {
    setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, status: newStatus } : comment)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Comments Management</h1>
          <p className="text-gray-500">Review and moderate user comments</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span className="text-base">Comment Settings</span>
          </Button>
        </div>
      </div>

      <Card className="border-2 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle>Filter Comments</CardTitle>
          <CardDescription>Search and filter user comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by content, report, or user"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 border-2 border-gray-300"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="border-2 border-gray-300 py-6">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Status: {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Comments</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4 border-2 border-gray-200 p-1 bg-white">
          <TabsTrigger
            value="all"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="flagged"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Flagged
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Approved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>All Comments</CardTitle>
              <CardDescription>Showing {filteredComments.length} comments</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : filteredComments.length === 0 ? (
                <div className="text-center py-10">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No comments found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComments.map((comment) => (
                    <Card key={comment.id} className="overflow-hidden border-2 border-gray-200">
                      <CardContent className="p-0">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                              <AvatarFallback>
                                {comment.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-800">{comment.user.name}</div>
                              <div className="text-xs text-gray-500">{comment.user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`text-white border-0 ${
                                comment.status === "approved"
                                  ? "bg-green-600"
                                  : comment.status === "pending"
                                    ? "bg-amber-500"
                                    : comment.status === "flagged"
                                      ? "bg-red-500"
                                      : "bg-gray-600"
                              }`}
                            >
                              {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                            </Badge>
                            <div className="text-xs text-gray-500">{formatDate(comment.date)}</div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-2 text-sm text-gray-500">
                            On report:{" "}
                            <a href={`/admin/reports/${comment.reportId}`} className="text-blue-600 hover:underline">
                              {comment.reportTitle}
                            </a>
                          </div>
                          <p className="text-gray-800">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{comment.likes} likes</span>
                            </div>
                            <div className="flex items-center">
                              <Flag className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{comment.flags} flags</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-300 text-gray-700"
                            onClick={() => window.open(`/dashboard/scam/${comment.reportId}`, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="text-sm">View in Context</span>
                          </Button>
                          {comment.status !== "approved" && (
                            <Button
                              size="sm"
                              className="bg-green-600 text-white border-2 border-green-700 hover:bg-green-700"
                              onClick={() => handleStatusChange(comment.id, "approved")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Approve</span>
                            </Button>
                          )}
                          {comment.status !== "rejected" && (
                            <Button
                              size="sm"
                              className="bg-red-600 text-white border-2 border-red-700 hover:bg-red-700"
                              onClick={() => handleStatusChange(comment.id, "rejected")}
                            >
                              <X className="h-4 w-4 mr-1" />
                              <span className="text-sm">Reject</span>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Flagged Comments</CardTitle>
              <CardDescription>Comments that have been flagged by users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredComments
                  .filter((comment) => comment.status === "flagged")
                  .map((comment) => (
                    <Card key={comment.id} className="overflow-hidden border-2 border-gray-200">
                      <CardContent className="p-0">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                              <AvatarFallback>
                                {comment.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-800">{comment.user.name}</div>
                              <div className="text-xs text-gray-500">{comment.user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-500 text-white border-0">Flagged</Badge>
                            <div className="text-xs text-gray-500">{formatDate(comment.date)}</div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-2 text-sm text-gray-500">
                            On report:{" "}
                            <a href={`/admin/reports/${comment.reportId}`} className="text-blue-600 hover:underline">
                              {comment.reportTitle}
                            </a>
                          </div>
                          <p className="text-gray-800">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{comment.likes} likes</span>
                            </div>
                            <div className="flex items-center">
                              <Flag className="h-4 w-4 mr-1 text-red-500" />
                              <span className="text-red-500 font-medium">{comment.flags} flags</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-300 text-gray-700"
                            onClick={() => window.open(`/dashboard/scam/${comment.reportId}`, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="text-sm">View in Context</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 text-white border-2 border-green-700 hover:bg-green-700"
                            onClick={() => handleStatusChange(comment.id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 text-white border-2 border-red-700 hover:bg-red-700"
                            onClick={() => handleStatusChange(comment.id, "rejected")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            <span className="text-sm">Reject</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Pending Comments</CardTitle>
              <CardDescription>Comments awaiting moderation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredComments
                  .filter((comment) => comment.status === "pending")
                  .map((comment) => (
                    <Card key={comment.id} className="overflow-hidden border-2 border-gray-200">
                      <CardContent className="p-0">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                              <AvatarFallback>
                                {comment.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-800">{comment.user.name}</div>
                              <div className="text-xs text-gray-500">{comment.user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-500 text-white border-0">Pending</Badge>
                            <div className="text-xs text-gray-500">{formatDate(comment.date)}</div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-2 text-sm text-gray-500">
                            On report:{" "}
                            <a href={`/admin/reports/${comment.reportId}`} className="text-blue-600 hover:underline">
                              {comment.reportTitle}
                            </a>
                          </div>
                          <p className="text-gray-800">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{comment.likes} likes</span>
                            </div>
                            <div className="flex items-center">
                              <Flag className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{comment.flags} flags</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-300 text-gray-700"
                            onClick={() => window.open(`/dashboard/scam/${comment.reportId}`, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="text-sm">View in Context</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 text-white border-2 border-green-700 hover:bg-green-700"
                            onClick={() => handleStatusChange(comment.id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Approve</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 text-white border-2 border-red-700 hover:bg-red-700"
                            onClick={() => handleStatusChange(comment.id, "rejected")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            <span className="text-sm">Reject</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Approved Comments</CardTitle>
              <CardDescription>Comments that have been approved by moderators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredComments
                  .filter((comment) => comment.status === "approved")
                  .map((comment) => (
                    <Card key={comment.id} className="overflow-hidden border-2 border-gray-200">
                      <CardContent className="p-0">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                              <AvatarFallback>
                                {comment.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-800">{comment.user.name}</div>
                              <div className="text-xs text-gray-500">{comment.user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600 text-white border-0">Approved</Badge>
                            <div className="text-xs text-gray-500">{formatDate(comment.date)}</div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="mb-2 text-sm text-gray-500">
                            On report:{" "}
                            <a href={`/admin/reports/${comment.reportId}`} className="text-blue-600 hover:underline">
                              {comment.reportTitle}
                            </a>
                          </div>
                          <p className="text-gray-800">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{comment.likes} likes</span>
                            </div>
                            <div className="flex items-center">
                              <Flag className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{comment.flags} flags</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-gray-300 text-gray-700"
                            onClick={() => window.open(`/dashboard/scam/${comment.reportId}`, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="text-sm">View in Context</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 text-white border-2 border-red-700 hover:bg-red-700"
                            onClick={() => handleStatusChange(comment.id, "rejected")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            <span className="text-sm">Reject</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
