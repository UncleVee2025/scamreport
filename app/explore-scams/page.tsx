"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScamCard } from "@/components/scam-card"
import { AdSpace } from "@/components/ad-space"
import { Search, Filter, AlertTriangle, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ExploreScamsPage() {
  const [scams, setScams] = useState([])
  const [displayItems, setDisplayItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [isAISearching, setIsAISearching] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastScamElementRef = useCallback(
    (node) => {
      if (isLoading || isFetchingMore) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreScams()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading, isFetchingMore, hasMore],
  )

  useEffect(() => {
    fetchScams()
  }, [activeTab])

  // Process scams and insert ads after every 10 items
  useEffect(() => {
    const items = []
    scams.forEach((scam, index) => {
      items.push({ type: "scam", data: scam })
      // Insert ad after every 10 scams
      if ((index + 1) % 10 === 0) {
        items.push({ type: "ad", data: null })
      }
    })
    setDisplayItems(items)
  }, [scams])

  const fetchScams = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/scams?page=1&limit=10&type=${activeTab === "all" ? "" : activeTab}`)
      const data = await response.json()

      if (data.scams) {
        setScams(data.scams)
        setHasMore(data.scams.length === 10)
        setPage(1)
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

  const loadMoreScams = async () => {
    if (isFetchingMore || !hasMore) return

    setIsFetchingMore(true)
    try {
      const nextPage = page + 1
      const response = await fetch(`/api/scams?page=${nextPage}&limit=10&type=${activeTab === "all" ? "" : activeTab}`)
      const data = await response.json()

      if (data.scams && data.scams.length > 0) {
        setScams((prevScams) => [...prevScams, ...data.scams])
        setHasMore(data.scams.length === 10)
        setPage(nextPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more scams:", error)
    } finally {
      setIsFetchingMore(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsAISearching(true)
    try {
      // First try regular search
      const response = await fetch(`/api/scams/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (data.scams && data.scams.length > 0) {
        setScams(data.scams)
      } else {
        // If no results, try AI-powered search
        const aiResponse = await fetch(`/api/ai/search?query=${encodeURIComponent(searchQuery)}`)
        const aiData = await aiResponse.json()

        if (aiData.scams && aiData.scams.length > 0) {
          setScams(aiData.scams)
          toast({
            title: "AI Search Results",
            description: "We used AI to find semantically similar scams based on your query.",
            duration: 5000,
          })
        } else {
          setScams([])
          toast({
            title: "No results found",
            description: `No scams matching "${searchQuery}" were found.`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAISearching(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Explore Scam Reports</h1>
          <p className="text-gray-500">Browse and search through reported scams</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="search"
          placeholder="Search scam reports..."
          className="pl-10 pr-16 py-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 flex items-center gap-1"
          disabled={isAISearching || !searchQuery.trim()}
        >
          {isAISearching ? (
            <LoadingSpinner size="xs" />
          ) : (
            <>
              <Sparkles className="h-3 w-3" />
              <span>AI Search</span>
            </>
          )}
        </Button>
      </form>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="phishing">Phishing</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : displayItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No scams found</h3>
                <p className="text-gray-500 mt-1">
                  {searchQuery
                    ? `No results found for "${searchQuery}"`
                    : "There are no scam reports in this category yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {displayItems.map((item, index) => {
                if (item.type === "ad") {
                  return <AdSpace key={`ad-${index}`} variant="card" showDemo={true} />
                }

                const scam = item.data
                if (displayItems.length === index + 1) {
                  return (
                    <div ref={lastScamElementRef} key={scam.id}>
                      <ScamCard scam={scam} />
                    </div>
                  )
                } else {
                  return <ScamCard key={scam.id} scam={scam} />
                }
              })}
              {isFetchingMore && (
                <div className="flex justify-center py-4">
                  <LoadingSpinner size="md" />
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
