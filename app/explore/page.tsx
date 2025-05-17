"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeatureCard } from "@/components/feature-card"
import { AdBanner } from "@/components/ad-banner"
import { Search, Filter, TrendingUp } from "lucide-react"

export default function ExplorePage() {
  const [loaded, setLoaded] = useState(false)
  const [features, setFeatures] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setLoaded(true)
    fetchFeatures()
  }, [])

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/content")
      const data = await response.json()
      setFeatures(data.featuredContent)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching features:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="text-gray-500">Discover features and resources</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input className="pl-10 w-[200px] md:w-[300px]" placeholder="Search..." />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* Advertisement Banner */}
      <AdBanner />

      <Tabs defaultValue="featured" className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="featured">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="h-[280px] animate-pulse">
                      <CardContent className="p-0 h-full flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                      </CardContent>
                    </Card>
                  ))
              : features.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={loaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <FeatureCard feature={feature} />
                  </motion.div>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div className="grid place-items-center py-20">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
              <p className="text-gray-500 mb-6">We're working on this feature. Check back soon!</p>
              <Button>Get Notified</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="new">
          <div className="grid place-items-center py-20">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
              <p className="text-gray-500 mb-6">We're working on this feature. Check back soon!</p>
              <Button>Get Notified</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid place-items-center py-20">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
              <p className="text-gray-500 mb-6">We're working on this feature. Check back soon!</p>
              <Button>Get Notified</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
