"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, AlertTriangle, Phone, Mail, User, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading-spinner"
import { BottomNavigation } from "@/components/bottom-navigation"
import Link from "next/link"

// Demo scam data
const DEMO_SCAMS = [
  {
    id: "scam1",
    title: "Fake Job Offer Scam",
    category: "Employment",
    date: "2023-05-15",
    description: "Scammers offering fake job opportunities and requesting payment for training or equipment.",
    contact: {
      type: "email",
      value: "jobs@fakecareers.com",
    },
    reportCount: 24,
    status: "Verified",
  },
  {
    id: "scam2",
    title: "Banking SMS Phishing",
    category: "Banking",
    date: "2023-06-02",
    description: "SMS messages claiming to be from banks requesting verification of account details.",
    contact: {
      type: "phone",
      value: "081234567",
    },
    reportCount: 56,
    status: "Verified",
  },
  {
    id: "scam3",
    title: "Online Shopping Scam",
    category: "E-commerce",
    date: "2023-06-10",
    description: "Fake online store collecting payments without delivering products.",
    contact: {
      type: "website",
      value: "amazingdeals.fake.com",
    },
    reportCount: 18,
    status: "Under Review",
  },
  {
    id: "scam4",
    title: "Cryptocurrency Investment Fraud",
    category: "Investment",
    date: "2023-06-15",
    description: "Fraudulent investment scheme promising unrealistic returns on cryptocurrency investments.",
    contact: {
      type: "name",
      value: "John Scammer",
    },
    reportCount: 42,
    status: "Verified",
  },
  {
    id: "scam5",
    title: "Rental Property Scam",
    category: "Real Estate",
    date: "2023-06-20",
    description: "Fake rental listings requesting deposits for properties that don't exist or aren't available.",
    contact: {
      type: "phone",
      value: "0812345678",
    },
    reportCount: 15,
    status: "Verified",
  },
  {
    id: "scam6",
    title: "Tech Support Scam",
    category: "Technology",
    date: "2023-06-25",
    description: "Callers claiming to be from tech companies offering to fix non-existent computer problems.",
    contact: {
      type: "phone",
      value: "0811234567",
    },
    reportCount: 31,
    status: "Verified",
  },
]

export default function ExploreScamsPage() {
  const [scams, setScams] = useState(DEMO_SCAMS)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter and sort scams
  const filteredScams = scams
    .filter((scam) => {
      // Apply category filter
      if (categoryFilter !== "all" && scam.category !== categoryFilter) {
        return false
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          scam.title.toLowerCase().includes(query) ||
          scam.description.toLowerCase().includes(query) ||
          scam.contact.value.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "reports") {
        return b.reportCount - a.reportCount
      }
      return 0
    })

  const categories = ["Employment", "Banking", "E-commerce", "Investment", "Real Estate", "Technology"]

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-center mb-6">Explore Reported Scams</h1>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scams..."
                  className="pl-10 border-2 border-gray-300 h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="border-2 border-gray-300 h-12">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-2 border-gray-300 h-12">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Most Recent</SelectItem>
                      <SelectItem value="reports">Most Reported</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center my-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredScams.length > 0 ? (
              <>
                <p className="text-gray-600 mb-4">{filteredScams.length} scams found</p>
                {filteredScams.map((scam) => (
                  <ScamCard key={scam.id} scam={scam} />
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Scams Found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNavigation />
      </div>
    </div>
  )
}

function ScamCard({ scam }: { scam: any }) {
  const getContactIcon = () => {
    switch (scam.contact.type) {
      case "phone":
        return <Phone className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "name":
        return <User className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <Link href={`/dashboard/scam/${scam.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{scam.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">{scam.category}</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                  {scam.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{scam.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  {getContactIcon()}
                  <span>{scam.contact.value}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(scam.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{scam.reportCount} reports</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
