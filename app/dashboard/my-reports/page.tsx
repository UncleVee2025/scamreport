"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScamCard } from "@/components/scam-card"
import { AlertTriangle, Search } from "lucide-react"

export default function MyReportsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [myReports, setMyReports] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate API call to fetch user's reports
    setIsLoading(true)
    setTimeout(() => {
      setMyReports([
        {
          id: 1,
          type: "Phishing Email",
          title: "FNB Account Suspension",
          description: "Email claiming FNB account suspension, requesting personal details",
          date: "2 days ago",
          status: "Verified",
          meToo: 12,
          comments: 5,
          isVerified: true,
        },
        {
          id: 2,
          type: "SMS Scam",
          title: "Fake Prize Notification",
          description: "SMS claiming I won a prize and need to call a number to claim it",
          date: "1 week ago",
          status: "Under Review",
          meToo: 8,
          comments: 3,
          isVerified: false,
        },
        {
          id: 3,
          type: "Investment Fraud",
          title: "Cryptocurrency Investment Scheme",
          description: "Website promising 300% returns on cryptocurrency investments in 30 days",
          date: "2 weeks ago",
          status: "Verified",
          meToo: 24,
          comments: 12,
          isVerified: true,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredReports = myReports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">My Reports</h1>
          <p className="text-gray-500">View and manage your submitted scam reports</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/dashboard/report")}>
          <AlertTriangle className="mr-2 h-4 w-4" />
          Report New Scam
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search your reports..."
          className="pl-10 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="pending">Under Review</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-full h-32 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No reports found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or report a new scam</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((scam, index) => (
                <ScamCard key={scam.id} scam={scam} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="verified" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="w-full h-32 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports
                .filter((report) => report.status === "Verified")
                .map((scam) => (
                  <ScamCard key={scam.id} scam={scam} />
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Card className="w-full h-32 animate-pulse bg-gray-100" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports
                .filter((report) => report.status === "Under Review")
                .map((scam) => (
                  <ScamCard key={scam.id} scam={scam} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
