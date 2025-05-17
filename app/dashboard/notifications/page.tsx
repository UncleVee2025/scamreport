"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, AlertTriangle, MessageSquare, ThumbsUp, CheckCircle, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)

  // Initial load of notifications
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Real-time updates simulation
  useEffect(() => {
    if (!isRealTimeEnabled) return

    // Simulate real-time updates with WebSocket
    const interval = setInterval(() => {
      const shouldAddNew = Math.random() > 0.7 // 30% chance of new notification

      if (shouldAddNew) {
        const newNotificationTypes = ["comment", "me-too", "verification", "system"]
        const randomType = newNotificationTypes[Math.floor(Math.random() * newNotificationTypes.length)]

        const newNotification = {
          id: Date.now(),
          type: randomType,
          title: getNotificationTitle(randomType),
          message: getNotificationMessage(randomType),
          time: "Just now",
          read: false,
          relatedId: Math.floor(Math.random() * 5) + 1,
          user:
            randomType === "comment"
              ? {
                  name: ["John Doe", "Sarah Smith", "Michael Johnson", "Emma Wilson"][Math.floor(Math.random() * 4)],
                  avatar: `/placeholder.svg?height=40&width=40&text=${["JD", "SS", "MJ", "EW"][Math.floor(Math.random() * 4)]}`,
                }
              : null,
        }

        setNotifications((prev) => [newNotification, ...prev])

        toast({
          title: "New notification",
          description: newNotification.title,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleMarkAsRead(newNotification.id)
                if (newNotification.relatedId) {
                  router.push(`/dashboard/scam/${newNotification.relatedId}`)
                }
              }}
            >
              View
            </Button>
          ),
        })
      }
    }, 20000) // Check every 20 seconds

    return () => clearInterval(interval)
  }, [isRealTimeEnabled, router])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to fetch notifications
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotifications([
        {
          id: 1,
          type: "comment",
          title: "New Comment",
          message: "Sarah Johnson commented on your scam report: 'FNB Account Suspension'",
          time: "2 hours ago",
          read: false,
          relatedId: 1,
          user: {
            name: "Sarah Johnson",
            avatar: "/placeholder.svg?height=40&width=40&text=SJ",
          },
        },
        {
          id: 2,
          type: "me-too",
          title: "New Me Too",
          message: "3 people marked 'Me Too' on your scam report: 'FNB Account Suspension'",
          time: "Yesterday",
          read: false,
          relatedId: 1,
        },
        {
          id: 3,
          type: "verification",
          title: "Report Verified",
          message: "Your scam report 'FNB Account Suspension' has been verified by our team",
          time: "2 days ago",
          read: true,
          relatedId: 1,
        },
        {
          id: 4,
          type: "system",
          title: "Welcome to ScamReport",
          message: "Thank you for joining ScamReport Namibia. Start reporting scams to help others stay safe.",
          time: "1 week ago",
          read: true,
        },
      ])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case "comment":
        return "New Comment"
      case "me-too":
        return "New Me Too"
      case "verification":
        return "Report Verified"
      case "system":
        return "System Notification"
      default:
        return "New Notification"
    }
  }

  const getNotificationMessage = (type: string) => {
    switch (type) {
      case "comment":
        return "Someone commented on your scam report"
      case "me-too":
        return "Someone marked 'Me Too' on your scam report"
      case "verification":
        return "Your scam report has been verified by our team"
      case "system":
        return "Important system update from ScamReport Namibia"
      default:
        return "You have a new notification"
    }
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "All notifications marked as read",
    })
  }

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
    toast({
      title: "Notification deleted",
    })
  }

  const handleViewNotification = (notification: any) => {
    handleMarkAsRead(notification.id)
    if (notification.relatedId) {
      router.push(`/dashboard/scam/${notification.relatedId}`)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "me-too":
        return <ThumbsUp className="h-5 w-5 text-green-500" />
      case "verification":
        return <CheckCircle className="h-5 w-5 text-primary" />
      case "system":
        return <Bell className="h-5 w-5 text-purple-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
    }
  }

  const toggleRealTime = () => {
    setIsRealTimeEnabled(!isRealTimeEnabled)
    toast({
      title: isRealTimeEnabled ? "Real-time updates disabled" : "Real-time updates enabled",
    })
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Notifications</h1>
          <p className="text-gray-500">Stay updated on your reports and activities</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={isRealTimeEnabled ? "bg-primary text-white" : "text-primary"}
            onClick={toggleRealTime}
          >
            {isRealTimeEnabled ? "Real-time: ON" : "Real-time: OFF"}
          </Button>
          <Button
            variant="outline"
            className="text-primary"
            onClick={handleMarkAllAsRead}
            disabled={notifications.every((n) => n.read)}
          >
            Mark all as read
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Bell className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No notifications</h3>
            <p className="text-gray-500 mt-1">You're all caught up!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={`card-hover relative overflow-hidden ${notification.read ? "bg-white" : "bg-blue-50"} cursor-pointer`}
                onClick={() => handleViewNotification(notification)}
              >
                {!notification.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="bg-white p-2 rounded-full shadow-sm">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          {!notification.read && <Badge className="bg-primary text-white">New</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNotification(notification.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {notification.user && (
                      <div className="flex items-center gap-2 mt-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={notification.user.avatar || "/placeholder.svg"}
                            alt={notification.user.name}
                          />
                          <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{notification.user.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
