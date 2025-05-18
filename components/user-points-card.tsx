"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, TrendingUp, Shield, Flag, MessageSquare, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface UserPointsCardProps {
  points: number
  level: number
  nextLevelPoints: number
  recentActivities: {
    type: "report" | "comment" | "me-too" | "verification" | "like" | "flag"
    points: number
    description: string
    date: string
  }[]
}

export function UserPointsCard({ points, level, nextLevelPoints, recentActivities }: UserPointsCardProps) {
  const [showActivities, setShowActivities] = useState(false)

  const progress = Math.min(100, (points / nextLevelPoints) * 100)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "report":
        return <Flag className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "me-too":
        return <TrendingUp className="h-4 w-4 text-purple-500" />
      case "verification":
        return <Shield className="h-4 w-4 text-green-500" />
      case "like":
        return <ThumbsUp className="h-4 w-4 text-amber-500" />
      case "flag":
        return <Flag className="h-4 w-4 text-orange-500" />
      default:
        return <Award className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Reputation</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                  <Award className="h-4 w-4" />
                  <span>Level {level}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current reputation level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Earn points by contributing to the community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{points} points</span>
            <span className="text-muted-foreground">
              {nextLevelPoints} points to Level {level + 1}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">3</div>
            <div className="text-xs text-muted-foreground">Reports</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950 p-2 rounded-lg">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">12</div>
            <div className="text-xs text-muted-foreground">Comments</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950 p-2 rounded-lg">
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">5</div>
            <div className="text-xs text-muted-foreground">Me Too</div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={() => setShowActivities(!showActivities)}>
          {showActivities ? "Hide" : "Show"} Recent Activities
        </Button>

        {showActivities && (
          <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-muted">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <div className="font-medium">{activity.description}</div>
                  <div className="text-xs text-muted-foreground">{activity.date}</div>
                </div>
                <div className="text-green-600 font-medium">+{activity.points}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
