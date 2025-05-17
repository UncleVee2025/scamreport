"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
// Add the Search icon import
import { Home, Search, Bell, User, Plus } from "lucide-react"

export function BottomNavigation() {
  const pathname = usePathname()

  // Update the navigation items array to include Search
  const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Report", href: "/dashboard/report", icon: Plus },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ]

  return (
    <div className="bottom-nav grid grid-cols-5 bg-white border-t-2 border-gray-200 shadow-lg">
      {navigation.map((item) => {
        const isActive = pathname === item.href

        if (item.name === "Report") {
          return (
            <Link key={item.name} href={item.href} className="relative flex justify-center">
              <div className="report-button bg-blue-600 border-4 border-white shadow-lg">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <span className="absolute bottom-1 text-xs font-medium text-blue-600">{item.name}</span>
            </Link>
          )
        }

        return (
          <Link key={item.name} href={item.href} className={`bottom-nav-item ${isActive ? "active" : ""}`}>
            <item.icon className={`h-6 w-6 mb-1 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
            <span className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`}>{item.name}</span>
            {item.name === "Notifications" && (
              <span className="absolute top-1 right-6 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                3
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
