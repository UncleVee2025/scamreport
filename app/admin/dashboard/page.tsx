"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bell, MessageSquare, Users, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { initializeSocket, useNewReports, useNewComments, useAdminNotifications } from "@/lib/socket-service"
import { logger } from "@/lib/logger"

export default function AdminDashboard() {
  const { newReports, resetCounter: resetReportsCounter } = useNewReports()
  const { newComments, resetCounter: resetCommentsCounter } = useNewComments()
  const { notifications } = useAdminNotifications()

  // Initialize socket connection when component mounts
  useEffect(() => {
    const socket = initializeSocket()

    // Join admin room for admin-specific events
    socket.emit("join-admin")

    logger.info("Admin joined dashboard", "admin-dashboard")

    return () => {
      // No need to disconnect the socket here as it's a singleton
      // and should persist across the admin area
    }
  }, [])

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">12</div>
              {newReports > 0 && (
                <Badge variant="destructive" className="ml-2">
                  +{newReports} new
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Reports awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">24</div>
              {newComments > 0 && (
                <Badge variant="destructive" className="ml-2">
                  +{newComments} new
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Comments awaiting moderation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scam Reports</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest reports and comments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reports">
              <TabsList className="mb-4">
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>
              <TabsContent value="reports" className="space-y-4">
                {/* Reports list would go here */}
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Phishing Email Scam</div>
                    <Badge>pending</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Submitted by John Doe • 2 hours ago</div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Phone Call Scam</div>
                    <Badge variant="outline">verified</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">Submitted by Jane Smith • 5 hours ago</div>
                </div>
                <Button variant="outline" className="w-full">
                  View All Reports
                </Button>
              </TabsContent>
              <TabsContent value="comments" className="space-y-4">
                {/* Comments list would go here */}
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">I got the same email yesterday!</div>
                    <Badge>pending</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    By Alice Johnson on "Phishing Email Scam" • 1 hour ago
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Thanks for reporting this. I almost fell for it.</div>
                    <Badge variant="secondary">approved</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    By Bob Williams on "Phone Call Scam" • 3 hours ago
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View All Comments
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Real-time system notifications</CardDescription>
            </div>
            <Bell className="ml-auto h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-md border p-4">
                    {notification.type === "comment" ? (
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    ) : notification.type === "report" ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                </div>
              )}

              {/* Sample notification for UI demonstration */}
              <div className="flex items-start gap-4 rounded-md border p-4">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New comment on "Phone Call Scam"</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md border p-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New scam report submitted</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                View All Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
