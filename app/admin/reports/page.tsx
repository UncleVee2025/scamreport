"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Filter, Search, Download, Eye, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Sample data
  const reports = [
    {
      id: 1,
      title: "FNB Account Suspension Scam",
      type: "Phishing",
      date: "2023-05-15",
      status: "verified",
      reporter: "john.doe@example.com",
      meTooCount: 12,
      commentsCount: 5,
    },
    {
      id: 2,
      title: "Fake Job Offer - Mining Company",
      type: "Employment",
      date: "2023-05-10",
      status: "pending",
      reporter: "sarah.smith@example.com",
      meTooCount: 3,
      commentsCount: 2,
    },
    {
      id: 3,
      title: "WhatsApp Investment Group Scam",
      type: "Investment",
      date: "2023-05-08",
      status: "verified",
      reporter: "michael.brown@example.com",
      meTooCount: 8,
      commentsCount: 7,
    },
    {
      id: 4,
      title: "Fake Property Rental in Windhoek",
      type: "Property",
      date: "2023-05-05",
      status: "rejected",
      reporter: "lisa.johnson@example.com",
      meTooCount: 1,
      commentsCount: 3,
    },
    {
      id: 5,
      title: "Cryptocurrency Mining Investment",
      type: "Investment",
      date: "2023-05-01",
      status: "pending",
      reporter: "david.williams@example.com",
      meTooCount: 5,
      commentsCount: 4,
    },
  ]

  // Filter reports based on search query and status filter
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || report.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Scam Reports</h1>
          <p className="text-gray-500">Manage and review reported scams</p>
        </div>
        <Button className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          <span className="text-base">Export Reports</span>
        </Button>
      </div>

      <Card className="border-2 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle>Filter Reports</CardTitle>
          <CardDescription>Search and filter scam reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by title, type, or reporter"
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
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 border-2 border-gray-200 p-1 bg-white">
          <TabsTrigger
            value="all"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            All Reports
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Pending Review
          </TabsTrigger>
          <TabsTrigger
            value="verified"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Verified
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>Showing {filteredReports.length} reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-10">
                    <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No reports found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden border-2 border-gray-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-2/3 p-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-gray-800">{report.title}</h3>
                              <Badge
                                className={`text-white border-0 ${
                                  report.status === "verified"
                                    ? "bg-green-600"
                                    : report.status === "pending"
                                      ? "bg-amber-500"
                                      : "bg-red-600"
                                }`}
                              >
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                              <span className="bg-gray-100 px-2 py-1 rounded">Type: {report.type}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">Date: {report.date}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">Reporter: {report.reporter}</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className="flex items-center text-blue-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {report.meTooCount} Me Too
                              </span>
                              <span className="flex items-center text-blue-600">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {report.commentsCount} Comments
                              </span>
                            </div>
                          </div>
                          <div className="w-full md:w-1/3 bg-gray-50 p-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-gray-200">
                            <div className="flex flex-col gap-2 w-full">
                              <Button className="w-full bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700">
                                <Eye className="mr-2 h-4 w-4" />
                                <span className="text-base">View Details</span>
                              </Button>
                              {report.status === "pending" && (
                                <>
                                  <Button className="w-full bg-green-600 text-white border-2 border-green-700 hover:bg-green-700">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    <span className="text-base">Verify Report</span>
                                  </Button>
                                  <Button className="w-full bg-red-600 text-white border-2 border-red-700 hover:bg-red-700">
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    <span className="text-base">Reject Report</span>
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Reports awaiting verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports
                  .filter((report) => report.status === "pending")
                  .map((report) => (
                    <Card key={report.id} className="overflow-hidden border-2 border-gray-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-2/3 p-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-gray-800">{report.title}</h3>
                              <Badge className="bg-amber-500 text-white border-0">Pending</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                              <span className="bg-gray-100 px-2 py-1 rounded">Type: {report.type}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">Date: {report.date}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">Reporter: {report.reporter}</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className="flex items-center text-blue-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {report.meTooCount} Me Too
                              </span>
                              <span className="flex items-center text-blue-600">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {report.commentsCount} Comments
                              </span>
                            </div>
                          </div>
                          <div className="w-full md:w-1/3 bg-gray-50 p-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-gray-200">
                            <div className="flex flex-col gap-2 w-full">
                              <Button className="w-full bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700">
                                <Eye className="mr-2 h-4 w-4" />
                                <span className="text-base">View Details</span>
                              </Button>
                              <Button className="w-full bg-green-600 text-white border-2 border-green-700 hover:bg-green-700">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span className="text-base">Verify Report</span>
                              </Button>
                              <Button className="w-full bg-red-600 text-white border-2 border-red-700 hover:bg-red-700">
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                <span className="text-base">Reject Report</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Verified Reports</CardTitle>
              <CardDescription>Confirmed scam reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports
                  .filter((report) => report.status === "verified")
                  .map((report) => (
                    <Card key={report.id} className="overflow-hidden border-2 border-gray-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-2/3 p-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-gray-800">{report.title}</h3>
                              <Badge className="bg-green-600 text-white border-0">Verified</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                              <span className="bg-gray-100 px-2 py-1 rounded">Type: {report.type}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">Date: {report.date}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">Reporter: {report.reporter}</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className="flex items-center text-blue-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {report.meTooCount} Me Too
                              </span>
                              <span className="flex items-center text-blue-600">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {report.commentsCount} Comments
                              </span>
                            </div>
                          </div>
                          <div className="w-full md:w-1/3 bg-gray-50 p-4 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l border-gray-200">
                            <div className="flex flex-col gap-2 w-full">
                              <Button className="w-full bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700">
                                <Eye className="mr-2 h-4 w-4" />
                                <span className="text-base">View Details</span>
                              </Button>
                            </div>
                          </div>
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
