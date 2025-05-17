"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, Clock, Flag, MessageSquare, ThumbsUp } from "lucide-react"

interface ScamCardProps {
  scam: {
    id: number
    type: string
    title: string
    description: string
    date: string
    status: string
    meToo: number
    comments: number
    isVerified: boolean
  }
}

export function ScamCard({ scam }: ScamCardProps) {
  const router = useRouter()
  const [meTooCount, setMeTooCount] = useState(scam.meToo)
  const [hasClickedMeToo, setHasClickedMeToo] = useState(false)

  const handleMeTooClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (hasClickedMeToo) {
      setMeTooCount(meTooCount - 1)
    } else {
      setMeTooCount(meTooCount + 1)
    }

    setHasClickedMeToo(!hasClickedMeToo)

    // In a real app, this would make an API call to update the count
    fetch(`/api/scams/${scam.id}/me-too`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: 1 }), // In a real app, this would be the actual user ID
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error updating Me Too count:", error))
  }

  return (
    <motion.div
      className="p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors cursor-pointer relative shadow-sm card-hover"
      onClick={() => router.push(`/dashboard/scam/${scam.id}`)}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {scam.isVerified && (
        <motion.div
          className="absolute -top-2 -right-2 flag-animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Flag className="h-6 w-6 text-red-500" />
        </motion.div>
      )}

      <div className="flex justify-between items-start mb-2">
        <div>
          <Badge
            variant={scam.status === "Verified" ? "default" : "outline"}
            className={scam.status === "Verified" ? "gradient-bg hover:opacity-90" : ""}
          >
            {scam.status}
          </Badge>
          <h3 className="font-medium mt-2">{scam.title}</h3>
          <p className="text-sm text-gray-500">{scam.type}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
      <p className="text-sm text-gray-600 mb-3">{scam.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>{scam.date}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center p-1 h-auto ${hasClickedMeToo ? "text-red-500" : "text-gray-500"}`}
            onClick={handleMeTooClick}
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            <span>{meTooCount} Me Too</span>
          </Button>
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>{scam.comments} Comments</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
