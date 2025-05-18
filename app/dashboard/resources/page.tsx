"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkIcon, Search, ExternalLink, ChevronRight } from "lucide-react"
import { URLChecker } from "@/components/url-checker"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ResourcesPage() {
  const [loaded, setLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastResourceElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreResources()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoadingMore, hasMore],
  )

  useEffect(() => {
    setLoaded(true)
  }, [])

  // Simulating loading more resources
  const loadMoreResources = () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    // Simulate API call delay
    setTimeout(() => {
      // Add more resources
      const newResources = [
        {
          id: resources.length + 1,
          title: "Avoiding Tax Scams",
          type: "article",
          description: "How to identify and avoid common tax-related scams",
          date: "July 15, 2023",
          thumbnail: "/placeholder.svg?height=120&width=200",
          url: "#",
        },
        {
          id: resources.length + 2,
          title: "Secure Online Shopping",
          type: "guide",
          description: "Best practices for safe online shopping",
          date: "July 20, 2023",
          thumbnail: "/placeholder.svg?height=120&width=200",
          url: "#",
        },
        {
          id: resources.length + 3,
          title: "Romance Scams Explained",
          type: "video",
          description: "Understanding and avoiding online romance scams",
          date: "July 25, 2023",
          thumbnail: "/placeholder.svg?height=120&width=200",
          duration: "15:30",
          url: "#",
        },
      ]

      setResources((prevResources) => [...prevResources, ...newResources])
      setPage((prevPage) => prevPage + 1)

      // After 3 pages, stop loading more
      if (page >= 3) {
        setHasMore(false)
      }

      setIsLoadingMore(false)
    }, 1500)
  }

  const [resources, setResources] = useState([
    {
      id: 1,
      title: "How to Identify Phishing Emails",
      type: "article",
      description: "Learn the warning signs of phishing emails and how to protect yourself",
      date: "May 10, 2023",
      thumbnail: "/placeholder.svg?height=120&width=200",
      url: "#",
    },
    {
      id: 2,
      title: "Protecting Your Online Banking",
      type: "video",
      description: "Expert tips on securing your online banking accounts from fraud",
      date: "April 22, 2023",
      thumbnail: "/placeholder.svg?height=120&width=200",
      duration: "12:45",
      url: "#",
    },
    {
      id: 3,
      title: "Identity Theft Prevention",
      type: "article",
      description: "Essential steps to protect yourself from identity theft",
      date: "June 5, 2023",
      thumbnail: "/identity_theft.jpg",
      url: "#",
    },
    {
      id: 4,
      title: "Cybersecurity for Small Businesses",
      type: "guide",
      description: "Essential cybersecurity practices for small business owners",
      date: "March 15, 2023",
      thumbnail: "/placeholder.svg?height=120&width=200",
      url: "#",
    },
    {
      id: 5,
      title: "Social Media Safety",
      type: "video",
      description: "How to stay safe on social media platforms and avoid common scams",
      date: "May 28, 2023",
      thumbnail: "/social-media-scams.jpg",
      duration: "18:22",
      url: "#",
    },
    {
      id: 6,
      title: "Recognizing Fake Online Stores",
      type: "guide",
      description: "Tips to identify fraudulent online shopping websites",
      date: "April 10, 2023",
      thumbnail: "/placeholder.svg?height=120&width=200",
      url: "#",
    },
  ])

  const links = [
    {
      title: "Namibian Police Cybercrime Unit",
      url: "https://www.nampol.gov.na",
      description: "Official website of the Namibian Police Cybercrime Unit",
    },
    {
      title: "Bank of Namibia - Fraud Prevention",
      url: "https://www.bon.com.na",
      description: "Resources on preventing banking fraud",
    },
    {
      title: "Communications Regulatory Authority of Namibia",
      url: "https://www.cran.na",
      description: "Regulatory information and consumer protection",
    },
    {
      title: "FNB Namibia Security Center",
      url: "https://www.fnbnamibia.com.na",
      description: "Security resources from FNB Namibia",
    },
    {
      title: "Bank Windhoek Security Tips",
      url: "https://www.bankwindhoek.com.na",
      description: "Security advice from Bank Windhoek",
    },
  ]

  const filteredResources = resources.filter((resource) => {
    if (activeTab !== "all" && resource.type !== activeTab) return false

    if (searchQuery) {
      return (
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return true
  })

  return (
    <div className="space-y-6 container max-w-6xl mx-auto px-4 py-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-gray-500">Educational content to help you stay safe online</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search resources..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="guide">Guides</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              if (filteredResources.length === index + 1) {
                return (
                  <motion.div
                    ref={lastResourceElementRef}
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={loaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ResourceCard resource={resource} />
                  </motion.div>
                )
              } else {
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={loaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ResourceCard resource={resource} />
                  </motion.div>
                )
              }
            })}
          </div>
          {isLoadingMore && (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          )}
        </TabsContent>
        <TabsContent value="article" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="video" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="guide" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI-Powered URL Checker */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-primary mb-6">AI-Powered Safety Tools</h2>
        <URLChecker />

        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Explore More AI Tools</h3>
                  <p className="text-sm text-gray-500">Check out our full range of AI safety tools</p>
                </div>
                <Button asChild>
                  <Link href="/dashboard/ai-tools">View All AI Tools</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="mr-2 h-5 w-5 text-blue-500" />
            Useful Links
          </CardTitle>
          <CardDescription>Official resources and partner websites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {links.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={loaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-blue-600">{link.title}</h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600" asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ResourceCard({ resource }: { resource: any }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32 bg-gray-100">
        <img
          src={resource.thumbnail || "/placeholder.svg"}
          alt={resource.title}
          className="w-full h-full object-cover"
        />
        {resource.type === "video" && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {resource.duration}
          </div>
        )}
        <div className="absolute top-2 left-2">
          <div
            className={`
            text-xs font-medium px-2 py-1 rounded-full
            ${
              resource.type === "article"
                ? "bg-blue-100 text-blue-700"
                : resource.type === "video"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
            }
          `}
          >
            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
          </div>
        </div>
      </div>
      <CardContent className="flex-1 pt-4">
        <h3 className="font-medium text-lg mb-2">{resource.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
        <p className="text-xs text-gray-500">{resource.date}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="ghost"
          className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          asChild
        >
          <a href={resource.url}>
            <span>Read More</span>
            <ChevronRight className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
