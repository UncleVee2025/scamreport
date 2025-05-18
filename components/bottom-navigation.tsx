"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, FileText, Plus, BookOpen, User } from "lucide-react"

export function BottomNavigation() {
  const pathname = usePathname()

  // Updated navigation items - changed "Menu" to "Home"
  const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Reports", href: "/explore-scams", icon: FileText },
    { name: "Report", href: "/dashboard/report", icon: Plus },
    { name: "Resources", href: "/dashboard/resources", icon: BookOpen },
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
          </Link>
        )
      })}
    </div>
  )
}
