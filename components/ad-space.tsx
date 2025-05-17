import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Tag } from "lucide-react"

interface AdSpaceProps {
  variant?: "sidebar" | "banner" | "card"
  showDemo?: boolean
}

const demoAds = [
  {
    id: 1,
    title: "Cyber Security Training",
    description: "Learn how to protect yourself online with our comprehensive cyber security courses.",
    sponsor: "CyberShield Academy",
    ctaText: "Enroll Now",
    ctaLink: "#",
    discount: "20% OFF",
    discountDescription: "For first-time students",
    imageUrl: "/placeholder.svg?height=200&width=400",
    backgroundColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
  },
  {
    id: 2,
    title: "Digital Banking Protection",
    description: "Secure your online banking with advanced protection services.",
    sponsor: "SecureBank Namibia",
    ctaText: "Get Protected",
    ctaLink: "#",
    discount: "Free Trial",
    discountDescription: "30 days no commitment",
    imageUrl: "/placeholder.svg?height=200&width=400",
    backgroundColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
  },
  {
    id: 3,
    title: "Scam Awareness Workshop",
    description: "Join our community workshop to learn about the latest scams and how to avoid them.",
    sponsor: "SafetyFirst Foundation",
    ctaText: "Register",
    ctaLink: "#",
    discount: "Free",
    discountDescription: "Limited seats available",
    imageUrl: "/placeholder.svg?height=200&width=400",
    backgroundColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
  },
]

export function AdSpace({ variant = "banner", showDemo = true }: AdSpaceProps) {
  // In a real app, you would fetch ads from your API
  // For now, we'll use demo data
  const ad = demoAds[Math.floor(Math.random() * demoAds.length)]

  if (!showDemo) {
    return null
  }

  if (variant === "sidebar") {
    return (
      <Card className={`overflow-hidden border ${ad.borderColor} mb-4`}>
        <div className={`${ad.backgroundColor} p-2 flex items-center justify-between`}>
          <span className="text-xs font-medium text-gray-500">Sponsored</span>
          <Badge variant="outline" className={ad.textColor}>
            {ad.discount}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
            <Image src={ad.imageUrl || "/placeholder.svg"} alt={ad.title} fill className="object-cover" />
          </div>
          <h3 className="font-bold text-sm mb-1">{ad.title}</h3>
          <p className="text-xs text-gray-600 mb-3">{ad.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {ad.sponsor}
            </span>
            <Button size="sm" className="h-8 text-xs" asChild>
              <Link href={ad.ctaLink}>
                {ad.ctaText}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "card") {
    return (
      <Card className={`overflow-hidden border ${ad.borderColor}`}>
        <div className={`${ad.backgroundColor} p-2 flex items-center justify-between`}>
          <span className="text-xs font-medium text-gray-500">Sponsored</span>
          <Badge variant="outline" className={ad.textColor}>
            {ad.discount}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
              <Image src={ad.imageUrl || "/placeholder.svg"} alt={ad.title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">{ad.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{ad.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {ad.sponsor}
                </span>
                <Button size="sm" className="h-7 text-xs" asChild>
                  <Link href={ad.ctaLink}>
                    {ad.ctaText}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default banner style
  return (
    <Card className={`overflow-hidden border ${ad.borderColor} mb-6`}>
      <div className={`${ad.backgroundColor} p-2 flex items-center justify-between`}>
        <span className="text-xs font-medium text-gray-500">Sponsored Content</span>
        <Badge variant="outline" className={ad.textColor}>
          {ad.discount}
        </Badge>
      </div>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/3 h-40 md:h-auto">
            <Image src={ad.imageUrl || "/placeholder.svg"} alt={ad.title} fill className="object-cover" />
          </div>
          <div className="p-4 md:p-6 flex-1">
            <h3 className="font-bold text-lg mb-2">{ad.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{ad.description}</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-gray-500 flex items-center">
                  <Tag className="h-3 w-3 mr-1" />
                  {ad.sponsor}
                </span>
                {ad.discountDescription && <p className="text-xs font-medium mt-1">{ad.discountDescription}</p>}
              </div>
              <Button className="w-full sm:w-auto" asChild>
                <Link href={ad.ctaLink}>
                  {ad.ctaText}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
