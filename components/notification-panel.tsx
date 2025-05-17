"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Bell, Settings, User, Zap } from "lucide-react"

interface NotificationPanelProps {
  onClose: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="absolute top-16 right-0 z-50 w-full max-w-sm"
    >
      <Card className="bg-gray-900 border-gray-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Notifications</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-auto">
          <div className="space-y-4">
            <NotificationItem
              icon={<Zap className="h-5 w-5 text-amber-500" />}
              title="New Feature Available"
              description="Try out our new AI-powered analytics dashboard."
              time="Just now"
              isNew
            />
            <NotificationItem
              icon={<User className="h-5 w-5 text-blue-500" />}
              title="New Follower"
              description="Alex Johnson started following you."
              time="2 hours ago"
              isNew
            />
            <NotificationItem
              icon={<Bell className="h-5 w-5 text-purple-500" />}
              title="Reminder"
              description="Your subscription will renew in 3 days."
              time="5 hours ago"
            />
            <NotificationItem
              icon={<Zap className="h-5 w-5 text-green-500" />}
              title="Task Completed"
              description="Your file export has been completed."
              time="Yesterday"
            />
            <NotificationItem
              icon={<User className="h-5 w-5 text-blue-500" />}
              title="New Connection"
              description="Sarah Miller accepted your connection request."
              time="2 days ago"
            />
          </div>

          <Button variant="ghost" className="w-full mt-4 text-violet-400 hover:text-violet-300">
            View All Notifications
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface NotificationItemProps {
  icon: React.ReactNode
  title: string
  description: string
  time: string
  isNew?: boolean
}

function NotificationItem({ icon, title, description, time, isNew }: NotificationItemProps) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{title}</h4>
          {isNew && <span className="w-2 h-2 bg-violet-500 rounded-full"></span>}
        </div>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
        <span className="text-xs text-gray-500 mt-1">{time}</span>
      </div>
    </div>
  )
}
