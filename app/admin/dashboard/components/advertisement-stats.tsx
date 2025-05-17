"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

export function AdvertisementStats() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0,
    revenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/advertisements/stats")
        const data = await response.json()

        if (data.stats) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Error fetching advertisement stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-gray-200 h-6 w-3/4 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-20 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advertisement Overview</CardTitle>
        <CardDescription>Summary of all advertisements on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Total Ads</span>
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.total}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600">Active</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.active}</p>
            <Badge variant="outline" className="mt-2 text-green-600 border-green-200">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
            </Badge>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-amber-600">Expiring Soon</span>
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats.expiringSoon}</p>
            <Badge variant="outline" className="mt-2 text-amber-600 border-amber-200">
              Next 30 days
            </Badge>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600">Est. Revenue</span>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold mt-2">N${stats.revenue.toLocaleString()}</p>
            <Badge variant="outline" className="mt-2 text-blue-600 border-blue-200">
              From active ads
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
