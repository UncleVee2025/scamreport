"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface AdSpaceProps {
  variant: "banner" | "sidebar" | "card"
  showDemo?: boolean
}

export function AdSpace({ variant, showDemo = false }: AdSpaceProps) {
  const [ad, setAd] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(1)

  useEffect(() => {
    const fetchAd = async () => {
      try {
        // In a real app, this would fetch from your API
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (showDemo) {
          setAd({
            title: "Protect Your Digital Identity",
            description: "Get premium identity protection with real-time alerts and comprehensive coverage.",
            sponsor: "IdentityShield",
            cta: "Start Free Trial",
            url: "#",
            imageUrl: `/${currentImageIndex}.jpg`,
          })
        } else {
          const response = await fetch("/api/advertisements")
          const data = await response.json()

          if (data.advertisements && data.advertisements.length > 0) {
            const adData = data.advertisements[0]
            setAd({
              title: adData.title,
              description: adData.description,
              sponsor: adData.sponsor_name,
              cta: adData.cta_text,
              url: adData.cta_link,
              imageUrl: adData.image_url || `/${currentImageIndex}.jpg`,
            })
          }
        }
      } catch (error) {
        console.error("Error fetching advertisement:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAd()

    // Rotate through the 3 ad images
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev % 3) + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [showDemo])

  if (isLoading) {
    return (
      <Card className={`w-full overflow-hidden animate-pulse ${variant === "sidebar" ? "h-64" : "h-40"}`}>
        <CardContent className="p-0">
          <div className="bg-gray-200 h-full"></div>
        </CardContent>
      </Card>
    )
  }

  if (!ad) return null

  if (variant === "banner") {
    return (
      <Card className="w-full overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="w-full md:w-2/3 p-6">
              <span className="text-xs text-blue-200">Sponsored by {ad.sponsor}</span>
              <h3 className="text-xl font-bold mt-1 mb-2">{ad.title}</h3>
              <p className="text-blue-100 mb-4">{ad.description}</p>
              <Button className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => window.open(ad.url, "_blank")}>
                {ad.cta}
              </Button>
            </div>
            <div className="w-full md:w-1/3 h-40 md:h-full">
              <img src={ad.imageUrl || "/placeholder.svg"} alt={ad.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "sidebar") {
    return (
      <Card className="w-full overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <img src={ad.imageUrl || "/placeholder.svg"} alt={ad.title} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-xs text-gray-300">Sponsored by {ad.sponsor}</span>
              <h3 className="text-lg font-bold mt-1 mb-1">{ad.title}</h3>
              <Button
                size="sm"
                className="mt-2 bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => window.open(ad.url, "_blank")}
              >
                {ad.cta}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Card variant
  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <span className="text-xs text-gray-500">Sponsored by {ad.sponsor}</span>
            <h3 className="text-lg font-bold mt-1 mb-2">{ad.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
            <Button
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-600"
              onClick={() => window.open(ad.url, "_blank")}
            >
              <span>{ad.cta}</span>
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </div>
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={ad.imageUrl || "/placeholder.svg"}
              alt={ad.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
