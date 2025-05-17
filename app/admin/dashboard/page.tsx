"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Users, CheckCircle, Clock, BarChart, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ScamCard } from "@/components/scam-card"
import { AdvertisementStats } from "./components/advertisement-stats"
import { ExportData } from "../components/export-data"

export default function AdminDashboard() {
  const [loaded, setLoaded] = useState(false)
  const [scams, setScams] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setLoaded(true)

    // Fetch scams from API
    fetchScams()
  }, [])

  const fetchScams = async () => {
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/admin/scams/recent')
      // const data = await response.json()

      // Simulate API response
      setTimeout(() => {
        setScams([
          {
            id: 1,
            type: "Phishing Email",
            title: "FNB Account Suspension",
            description: "Email claiming FNB account suspension, requesting personal details",
            date: "2 hours ago",
            status: "Verified",
            meToo: 12,
            comments: 5,
            isVerified: true,
          },
          {
            id: 2,
            type: "Fake Investment",
            title: "Namibia Mining Investment Scam",
            description: "Fraudulent investment scheme promising high returns from mining operations",
            date: "Yesterday",
            status: "Under Review",
            meToo: 8,
            comments: 3,
            isVerified: false,
          },
          {
            id: 3,
            type: "Property Rental Scam",
            title: "Windhoek Apartment Scam",
            description: "Fake rental listing for apartment in Windhoek, requesting deposit",
            date: "2 days ago",
            status: "Verified",
            meToo: 4,
            comments: 7,
            isVerified: true,
          },
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching scams:", error)
      setIsLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Reports",
      value: "1,248",
      icon: AlertTriangle,
      color: "text-blue-500",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Active Users",
      value: "3,421",
      icon: Users,
      color: "text-blue-500",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Verified Scams",
      value: "876",
      icon: CheckCircle,
      color: "text-blue-500",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Pending Reviews",
      value: "42",
      icon: Clock,
      color: "text-amber-500",
      trend: "-5%",
      trendUp: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          onClick={() => (window.location.href = "/admin/reports")}
        >
          <Eye className="mr-2 h-4 w-4" />
          View All Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div
                      className={`flex items-center text-xs mt-1 ${stat.trendUp ? "text-green-500" : "text-red-500"}`}
                    >
                      {stat.trendUp ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      <span>{stat.trend} from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-blue-100 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Scam Reports</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View All
                </Button>
              </div>
              <CardDescription>Latest scams reported in Namibia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                scams.map((scam) => <ScamCard key={scam.id} scam={scam} />)
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full">
                Load More
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="space-y-6">
            <AdvertisementStats />

            <ExportData />

            <Card>
              <CardHeader>
                <CardTitle>Report Categories</CardTitle>
                <CardDescription>Distribution of scam types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phishing Emails</span>
                      <span className="font-medium">38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Investment Scams</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Online Marketplace</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <Progress value={18} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Romance Scams</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Others</span>
                      <span className="font-medium">7%</span>
                    </div>
                    <Progress value={7} className="h-2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <BarChart className="h-4 w-4 mr-2" />
                  View Detailed Statistics
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-700">Database Status</p>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Last backup: 2 hours ago</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-700">API Status</p>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Response time: 120ms</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-700">Storage Usage</p>
                    <span className="text-xs font-medium text-blue-700">68%</span>
                  </div>
                  <Progress value={68} className="h-1 mt-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  System Maintenance
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
