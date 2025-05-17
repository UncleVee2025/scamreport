"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, AlertTriangle, CheckCircle, Phone, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<any>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/search?type=${searchType}&query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResult(data)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResult({ success: false, message: "An error occurred during search" })
    } finally {
      setIsLoading(false)
    }
  }

  const getPlaceholder = () => {
    switch (searchType) {
      case "phone":
        return "Enter phone number (e.g., 081234567)"
      case "email":
        return "Enter email address"
      case "name":
        return "Enter name"
      default:
        return "Search..."
    }
  }

  const getIcon = () => {
    switch (searchType) {
      case "phone":
        return <Phone className="h-5 w-5 text-gray-500" />
      case "email":
        return <Mail className="h-5 w-5 text-gray-500" />
      case "name":
        return <User className="h-5 w-5 text-gray-500" />
      default:
        return <Search className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-center mb-6">Scam Verification Search</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <Tabs defaultValue="phone" onValueChange={setSearchType} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="phone" className="text-sm">
                  Phone Number
                </TabsTrigger>
                <TabsTrigger value="email" className="text-sm">
                  Email
                </TabsTrigger>
                <TabsTrigger value="name" className="text-sm">
                  Name
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {getIcon()}
                  </div>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="pl-10 border-2 border-gray-300 h-12"
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading || !searchQuery.trim()}>
                  {isLoading ? <LoadingSpinner size="sm" /> : "Search"}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          hasSearched && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {searchResult?.success ? (
                <SearchResultCard result={searchResult} searchType={searchType} />
              ) : (
                <NotReportedCard searchType={searchType} query={searchQuery} />
              )}

              <div className="mt-8">
                <CautionMessage />
              </div>
            </motion.div>
          )
        )}
      </motion.div>

      {/* Add the bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNavigation />
      </div>
    </div>
  )
}

function SearchResultCard({ result, searchType }: { result: any; searchType: string }) {
  const { data } = result

  return (
    <Card className="border-2 border-red-500">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              {searchType === "phone" ? "Phone Number" : searchType === "email" ? "Email Address" : "Name"} Reported!
            </h2>
            <p className="text-gray-700 mb-4">
              This {searchType} has been reported {data.reportCount} {data.reportCount === 1 ? "time" : "times"} for
              scam activities.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Report Details:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="font-medium">Category:</span> {data.category}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium">Last Reported:</span> {data.lastReported}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                    {data.status}
                  </span>
                </li>
              </ul>
            </div>

            <Button className="w-full">View All Reports</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NotReportedCard({ searchType, query }: { searchType: string; query: string }) {
  return (
    <Card className="border-2 border-green-500">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-green-600 mb-2">Not Reported</h2>
            <p className="text-gray-700 mb-4">
              Good news! The {searchType} <span className="font-medium">{query}</span> has not been reported in our
              database.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <div className="mt-1">
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-sm text-blue-700">
                  While this {searchType} hasn't been reported, always exercise caution when dealing with unknown
                  contacts.
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Report This {searchType === "phone" ? "Number" : searchType === "email" ? "Email" : "Person"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CautionMessage() {
  return (
    <Card className="border-2 border-yellow-400">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-bold text-yellow-700 mb-2">Important Caution</h3>
            <p className="text-gray-700 text-sm">
              Our database relies on user reports. A clean result doesn't guarantee safety. Always:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
              <li>Verify identities through official channels</li>
              <li>Never share sensitive information with unknown contacts</li>
              <li>Be wary of deals that seem too good to be true</li>
              <li>Report suspicious activities to help protect others</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
