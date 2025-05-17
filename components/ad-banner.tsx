"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Advertisement } from "@/lib/models/advertisement"

export function AdBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [ad, setAd] = useState<Advertisement | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch("/api/advertisements")
        const data = await response.json()

        if (data.advertisements && data.advertisements.length > 0) {
          setAd(data.advertisements[0])
        }
      } catch (error) {
        console.error("Error fetching advertisement:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAd()
  }, [])

  if (!isVisible || (!ad && !isLoading)) return null

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700 overflow-hidden animate-pulse">
        <CardContent className="p-0">
          <div className="h-40"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-2/3 p-6">
              <span className="text-xs text-gray-400">Sponsored by {ad.sponsor_name}</span>
              <h3 className="text-xl font-bold mt-1 mb-2">{ad.title}</h3>
              <p className="text-gray-300 mb-4">{ad.description}</p>
              <Button
                className="bg-white text-gray-900 hover:bg-gray-200"
                onClick={() => window.open(ad.cta_link, "_blank")}
              >
                {ad.cta_text}
              </Button>
            </div>

            {(ad.discount || ad.image_url) && (
              <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex items-center justify-center h-40 md:h-full">
                {ad.image_url ? (
                  <img
                    src={ad.image_url || "/placeholder.svg"}
                    alt={ad.title}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <h4 className="font-bold text-xl mb-2">{ad.discount}</h4>
                    <p className="text-sm">{ad.discount_description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
