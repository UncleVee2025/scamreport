"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ChevronRight, Minimize2, Search, ThumbsUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface SimilarScamsProps {
  scamId: number
}

export function SimilarScams({ scamId }: SimilarScamsProps) {
  const router = useRouter()
  const [similarScams, setSimilarScams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimilarScams = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`/api/ai/similar-scams/${scamId}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch similar scams")
        }

        setSimilarScams(data.data || [])
      } catch (error) {
        console.error("Error fetching similar scams:", error)
        setError("Failed to load similar scams")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSimilarScams()
  }, [scamId])

  const handleViewScam = (id: number) => {
    router.push(`/dashboard/scam/${id}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Minimize2 className="h-5 w-5 text-primary" />
          Similar Scam Reports
        </CardTitle>
        <CardDescription>AI-powered matching found these similar scams</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <Search className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{error}</p>
          </div>
        ) : similarScams.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No similar scams found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {similarScams.map((scam, index) => (
              <motion.div
                key={scam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="card-hover cursor-pointer" onClick={() => handleViewScam(scam.id)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={scam.status === "verified" ? "default" : "outline"}
                            className={scam.status === "verified" ? "bg-primary hover:bg-primary/90" : ""}
                          >
                            {scam.status.charAt(0).toUpperCase() + scam.status.slice(1)}
                          </Badge>
                          <Badge variant="outline">{scam.type}</Badge>
                        </div>
                        <h3 className="font-medium">{scam.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{scam.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(scam.created_at), { addSuffix: true })}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {scam.me_too_count} Me Too
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <div className="text-xs text-gray-500 mt-2 text-center">
              AI-powered matching based on scam description similarity
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
