"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScamCard } from "@/components/scam-card"
import { FeatureCard } from "@/components/feature-card"
import { AdSpace } from "@/components/ad-space"
import { Bell, Shield, TrendingUp, AlertTriangle, FileText, Users, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [recentScams, setRecentScams] = useState([])
  const [trendingScams, setTrendingScams] = useState([])

  useEffect(() => {
    const fetchScams = async () => {
      try {
        const response = await fetch("/api/scams")
        const data = await response.json()

        if (data.scams) {
          // Sort by date for recent
          const recent = [...data.scams].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          )

          // Sort by me_too_count for trending
          const trending = [...data.scams].sort((a, b) => b.me_too_count - a.me_too_count)

          setRecentScams(recent.slice(0, 5))
          setTrendingScams(trending.slice(0, 5))
        }
      } catch (error) {
        console.error("Error fetching scams:", error)
        toast({
          title: "Error",
          description: "Failed to load scams. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchScams()
  }, [])

  const features = [
    {
      title: "Report a Scam",
      description: "Submit details about a scam you've encountered",
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      link: "/dashboard/report",
    },
    {
      title: "My Reports",
      description: "View and manage your submitted reports",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      link: "/dashboard/my-reports",
    },
    {
      title: "Explore Scams",
      description: "Browse reported scams in your area",
      icon: Search,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      link: "/explore-scams",
    },
    {
      title: "Emergency Contacts",
      description: "Quick access to emergency services",
      icon: Shield,
      color: "text-red-500",
      bgColor: "bg-red-100",
      link: "/emergency",
    },
  ]

  const stats = [
    {
      title: "Reported Scams",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      description: "from last month",
      iconName: "AlertTriangle",
    },
    {
      title: "Active Users",
      value: "5,678",
      change: "+8%",
      changeType: "increase",
      description: "from last month",
      iconName: "Users",
    },
    {
      title: "Scam Alerts",
      value: "42",
      change: "+24%",
      changeType: "increase",
      description: "from last month",
      iconName: "Bell",
    },
    {
      title: "Trending Scams",
      value: "7",
      change: "-3%",
      changeType: "decrease",
      description: "from last month",
      iconName: "TrendingUp",
    },
  ]

  // Function to render the appropriate icon based on name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "AlertTriangle":
        return <AlertTriangle className="h-4 w-4 text-gray-400" />
      case "Users":
        return <Users className="h-4 w-4 text-gray-400" />
      case "Bell":
        return <Bell className="h-4 w-4 text-gray-400" />
      case "TrendingUp":
        return <TrendingUp className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-gray-500">Welcome back to ScamReport Namibia</p>
        </div>
        <Button onClick={() => router.push("/dashboard/report")} className="bg-primary text-white hover:bg-primary/90">
          Report a Scam
        </Button>
      </div>

      {/* Ad Space - Banner */}
      <AdSpace variant="banner" showDemo={true} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            iconColor={feature.color}
            iconBgColor={feature.bgColor}
            onClick={() => router.push(feature.link)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="recent">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Scam Reports</h2>
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="recent" className="space-y-4">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>)
              ) : recentScams.length > 0 ? (
                recentScams.map((scam) => <ScamCard key={scam.id} scam={scam} />)
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">No recent scams reported yet.</p>
                  </CardContent>
                </Card>
              )}
              <div className="text-center">
                <Button variant="outline" onClick={() => router.push("/explore-scams")}>
                  View All Reports
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>)
              ) : trendingScams.length > 0 ? (
                trendingScams.map((scam) => <ScamCard key={scam.id} scam={scam} />)
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">No trending scams at the moment.</p>
                  </CardContent>
                </Card>
              )}
              <div className="text-center">
                <Button variant="outline" onClick={() => router.push("/explore-scams")}>
                  View All Reports
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 mb-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Verify Contact Information</h2>
              <p className="text-gray-600 mb-4">
                Check if a phone number, email, or name has been reported for scam activities.
              </p>
              <Link href="/search">
                <Button className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search Database
                </Button>
              </Link>
            </div>
          </div>

          {/* Ad Space - Card */}
          <AdSpace variant="card" showDemo={true} />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                    {renderIcon(stat.iconName)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs font-medium ${
                        stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Safety Tips</CardTitle>
              <CardDescription>Stay safe from scams with these tips</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                    <Shield className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm">Never share your banking PINs or passwords with anyone</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                    <Shield className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm">Be cautious of unexpected calls asking for personal information</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                    <Shield className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm">
                    Verify the identity of anyone claiming to be from an official organization
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
                    <Shield className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-sm">Report suspicious activities immediately to authorities</span>
                </li>
              </ul>
              <Button
                variant="link"
                className="mt-2 p-0 h-auto text-primary"
                onClick={() => router.push("/dashboard/resources")}
              >
                View all safety resources
              </Button>
            </CardContent>
          </Card>

          {/* Ad Space - Sidebar */}
          <AdSpace variant="sidebar" showDemo={true} />
        </div>
      </div>
    </div>
  )
}
