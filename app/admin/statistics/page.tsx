"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { BarChart, LineChart, PieChart, Download, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalReports: 0,
    verifiedReports: 0,
    pendingReports: 0,
    rejectedReports: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalComments: 0,
    totalMeToo: 0,
  })

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setStats({
        totalReports: 1248,
        verifiedReports: 876,
        pendingReports: 42,
        rejectedReports: 330,
        totalUsers: 5280,
        activeUsers: 3421,
        totalComments: 4752,
        totalMeToo: 8965,
      })
      setIsLoading(false)
    }, 1000)
  }, [timeRange])

  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
    setIsLoading(true)
  }

  // Sample data for charts
  const reportsByCategory = [
    { category: "Phishing", count: 456, percentage: 36.5 },
    { category: "Investment", count: 312, percentage: 25 },
    { category: "Online Shopping", count: 225, percentage: 18 },
    { category: "Romance", count: 150, percentage: 12 },
    { category: "Others", count: 105, percentage: 8.5 },
  ]

  const reportsByMonth = [
    { month: "Jan", count: 85 },
    { month: "Feb", count: 92 },
    { month: "Mar", count: 105 },
    { month: "Apr", count: 110 },
    { month: "May", count: 125 },
    { month: "Jun", count: 118 },
    { month: "Jul", count: 132 },
    { month: "Aug", count: 145 },
    { month: "Sep", count: 138 },
    { month: "Oct", count: 152 },
    { month: "Nov", count: 160 },
    { month: "Dec", count: 168 },
  ]

  const userGrowth = [
    { month: "Jan", count: 320 },
    { month: "Feb", count: 380 },
    { month: "Mar", count: 450 },
    { month: "Apr", count: 520 },
    { month: "May", count: 580 },
    { month: "Jun", count: 650 },
    { month: "Jul", count: 720 },
    { month: "Aug", count: 800 },
    { month: "Sep", count: 880 },
    { month: "Oct", count: 950 },
    { month: "Nov", count: 1050 },
    { month: "Dec", count: 1150 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Statistics</h1>
          <p className="text-gray-500">Analytics and insights about scam reports and user activity</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px] border-2 border-gray-300">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-base">
                  {timeRange === "week"
                    ? "Past Week"
                    : timeRange === "month"
                      ? "Past Month"
                      : timeRange === "quarter"
                        ? "Past Quarter"
                        : "Past Year"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            <span className="text-base">Export Data</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="h-24 animate-pulse bg-gray-200 rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Reports</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stats.totalReports}</p>
                  <div className="flex items-center text-xs mt-1 text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12% from last {timeRange}</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                  <BarChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stats.activeUsers}</p>
                  <div className="flex items-center text-xs mt-1 text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+8% from last {timeRange}</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-500">
                  <LineChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Verified Scams</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stats.verifiedReports}</p>
                  <div className="flex items-center text-xs mt-1 text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+15% from last {timeRange}</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                  <PieChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">{stats.pendingReports}</p>
                  <div className="flex items-center text-xs mt-1 text-red-500">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    <span>-5% from last {timeRange}</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-500">
                  <BarChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 border-2 border-gray-200 p-1 bg-white">
          <TabsTrigger
            value="reports"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Report Statistics
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            User Activity
          </TabsTrigger>
          <TabsTrigger
            value="engagement"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Engagement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Reports by Category</CardTitle>
                <CardDescription>Distribution of scam types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportsByCategory.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">{category.category}</span>
                        <span className="font-medium text-gray-800">{category.percentage}%</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                      <div className="text-xs text-gray-500">{category.count} reports</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Reports Over Time</CardTitle>
                <CardDescription>Monthly report submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between">
                  {reportsByMonth.map((month) => (
                    <div key={month.month} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-blue-500 rounded-t-md"
                        style={{ height: `${(month.count / 170) * 250}px` }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-500">{month.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Report Status Distribution</CardTitle>
              <CardDescription>Breakdown of report verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="relative w-48 h-48">
                  <div className="w-48 h-48 rounded-full border-8 border-gray-100"></div>
                  <div
                    className="absolute top-0 left-0 w-48 h-48 rounded-full border-8 border-transparent border-t-blue-500 border-r-blue-500"
                    style={{ transform: "rotate(45deg)" }}
                  ></div>
                  <div
                    className="absolute top-0 left-0 w-48 h-48 rounded-full border-8 border-transparent border-b-green-500 border-l-green-500"
                    style={{ transform: "rotate(45deg)" }}
                  ></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-2xl font-bold text-gray-800">{stats.totalReports}</div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-100">
                    <div className="text-xl font-bold text-blue-600">{stats.verifiedReports}</div>
                    <div className="text-sm text-blue-600">Verified</div>
                    <div className="text-xs text-blue-500 mt-1">
                      {Math.round((stats.verifiedReports / stats.totalReports) * 100)}%
                    </div>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg border-2 border-amber-100">
                    <div className="text-xl font-bold text-amber-600">{stats.pendingReports}</div>
                    <div className="text-sm text-amber-600">Pending</div>
                    <div className="text-xs text-amber-500 mt-1">
                      {Math.round((stats.pendingReports / stats.totalReports) * 100)}%
                    </div>
                  </div>

                  <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg border-2 border-red-100">
                    <div className="text-xl font-bold text-red-600">{stats.rejectedReports}</div>
                    <div className="text-sm text-red-600">Rejected</div>
                    <div className="text-xs text-red-500 mt-1">
                      {Math.round((stats.rejectedReports / stats.totalReports) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly new user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between">
                  {userGrowth.map((month) => (
                    <div key={month.month} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-green-500 rounded-t-md"
                        style={{ height: `${(month.count / 1200) * 250}px` }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-500">{month.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>User engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Active Users</span>
                      <span className="text-sm font-medium text-gray-800">
                        {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                      </span>
                    </div>
                    <Progress value={(stats.activeUsers / stats.totalUsers) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{stats.activeUsers} active users</span>
                      <span>out of {stats.totalUsers} total users</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Reports per User</span>
                      <span className="text-sm font-medium text-gray-800">
                        {(stats.totalReports / stats.activeUsers).toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min((stats.totalReports / stats.activeUsers / 5) * 100, 100)}
                      className="h-2"
                    />
                    <div className="text-xs text-gray-500">Average number of reports submitted per active user</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Comments per User</span>
                      <span className="text-sm font-medium text-gray-800">
                        {(stats.totalComments / stats.activeUsers).toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min((stats.totalComments / stats.activeUsers / 5) * 100, 100)}
                      className="h-2"
                    />
                    <div className="text-xs text-gray-500">Average number of comments posted per active user</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Me Too per User</span>
                      <span className="text-sm font-medium text-gray-800">
                        {(stats.totalMeToo / stats.activeUsers).toFixed(1)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min((stats.totalMeToo / stats.activeUsers / 10) * 100, 100)}
                      className="h-2"
                    />
                    <div className="text-xs text-gray-500">Average number of Me Too clicks per active user</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>User Retention</CardTitle>
              <CardDescription>Monthly user retention rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between">
                {[
                  { month: "Jan", rate: 78 },
                  { month: "Feb", rate: 80 },
                  { month: "Mar", rate: 75 },
                  { month: "Apr", rate: 82 },
                  { month: "May", rate: 85 },
                  { month: "Jun", rate: 88 },
                  { month: "Jul", rate: 86 },
                  { month: "Aug", rate: 90 },
                  { month: "Sep", rate: 92 },
                  { month: "Oct", rate: 89 },
                  { month: "Nov", rate: 91 },
                  { month: "Dec", rate: 94 },
                ].map((month) => (
                  <div key={month.month} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-purple-500 rounded-t-md"
                      style={{ height: `${(month.rate / 100) * 250}px` }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">{month.month}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Comments Activity</CardTitle>
                <CardDescription>Monthly comment trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between">
                  {[
                    { month: "Jan", count: 285 },
                    { month: "Feb", count: 310 },
                    { month: "Mar", count: 342 },
                    { month: "Apr", count: 365 },
                    { month: "May", count: 390 },
                    { month: "Jun", count: 420 },
                    { month: "Jul", count: 405 },
                    { month: "Aug", count: 438 },
                    { month: "Sep", count: 462 },
                    { month: "Oct", count: 485 },
                    { month: "Nov", count: 510 },
                    { month: "Dec", count: 540 },
                  ].map((month) => (
                    <div key={month.month} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-amber-500 rounded-t-md"
                        style={{ height: `${(month.count / 550) * 250}px` }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-500">{month.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Me Too Activity</CardTitle>
                <CardDescription>Monthly Me Too trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between">
                  {[
                    { month: "Jan", count: 520 },
                    { month: "Feb", count: 580 },
                    { month: "Mar", count: 620 },
                    { month: "Apr", count: 680 },
                    { month: "May", count: 720 },
                    { month: "Jun", count: 760 },
                    { month: "Jul", count: 740 },
                    { month: "Aug", count: 790 },
                    { month: "Sep", count: 830 },
                    { month: "Oct", count: 870 },
                    { month: "Nov", count: 910 },
                    { month: "Dec", count: 950 },
                  ].map((month) => (
                    <div key={month.month} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-red-500 rounded-t-md"
                        style={{ height: `${(month.count / 1000) * 250}px` }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-500">{month.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Engagement by Report Category</CardTitle>
              <CardDescription>Comments and Me Too by scam type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { category: "Phishing", comments: 1850, meToo: 3420 },
                  { category: "Investment", comments: 1240, meToo: 2380 },
                  { category: "Online Shopping", comments: 920, meToo: 1650 },
                  { category: "Romance", comments: 580, meToo: 1120 },
                  { category: "Others", comments: 420, meToo: 780 },
                ].map((item) => (
                  <div key={item.category} className="flex flex-col p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">{item.category}</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Comments</span>
                          <span className="font-medium text-gray-700">{item.comments}</span>
                        </div>
                        <Progress value={(item.comments / 2000) * 100} className="h-1 mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Me Too</span>
                          <span className="font-medium text-gray-700">{item.meToo}</span>
                        </div>
                        <Progress value={(item.meToo / 4000) * 100} className="h-1 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
