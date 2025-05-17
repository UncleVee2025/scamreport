"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  onClick?: () => void
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  onClick,
}: FeatureCardProps) {
  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-primary/10"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className={`${iconBgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}
