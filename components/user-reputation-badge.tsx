import { Shield, Award, Star } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ReputationLevel = "new" | "trusted" | "verified" | "expert"

interface UserReputationBadgeProps {
  level: ReputationLevel
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function UserReputationBadge({ level, size = "md", showLabel = false }: UserReputationBadgeProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const labelClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const getBadgeDetails = (level: ReputationLevel) => {
    switch (level) {
      case "new":
        return {
          icon: <Shield className={sizeClasses[size]} />,
          label: "New User",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          tooltip: "This user is new to the platform",
        }
      case "trusted":
        return {
          icon: <Shield className={sizeClasses[size]} />,
          label: "Trusted",
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          tooltip: "This user has been verified and has contributed to the community",
        }
      case "verified":
        return {
          icon: <Award className={sizeClasses[size]} />,
          label: "Verified",
          color: "text-green-500",
          bgColor: "bg-green-100",
          tooltip: "This user has been verified and has made significant contributions",
        }
      case "expert":
        return {
          icon: <Star className={sizeClasses[size]} />,
          label: "Expert",
          color: "text-amber-500",
          bgColor: "bg-amber-100",
          tooltip: "This user is recognized as an expert in identifying and reporting scams",
        }
    }
  }

  const { icon, label, color, bgColor, tooltip } = getBadgeDetails(level)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <div className={`${bgColor} ${color} p-1 rounded-full`}>{icon}</div>
            {showLabel && <span className={`${color} font-medium ${labelClasses[size]}`}>{label}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
