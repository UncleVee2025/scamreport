"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Flag,
  FileText,
  Users,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  Shield,
  Brain,
  Phone,
  Globe,
  Lightbulb,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

export default function DashboardNavigation() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "My Reports",
      href: "/dashboard/my-reports",
      icon: <Flag className="h-5 w-5" />,
    },
    {
      name: "AI Tools",
      href: "/dashboard/ai-tools",
      icon: <Brain className="h-5 w-5" />,
      isNew: true,
      subItems: [
        {
          name: "URL Checker",
          href: "/dashboard/ai-tools?tab=url",
          icon: <Globe className="h-4 w-4" />,
        },
        {
          name: "Call Analyzer",
          href: "/dashboard/call-analyzer",
          icon: <Phone className="h-4 w-4" />,
        },
        {
          name: "Safety Tips",
          href: "/dashboard/ai-tools?tab=tips",
          icon: <Lightbulb className="h-4 w-4" />,
        },
      ],
    },
    {
      name: "Resources",
      href: "/dashboard/resources",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
      badge: 3,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">ScamReport</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            className={`${isMobile ? "fixed inset-0 z-20 bg-white pt-16" : "sticky top-0 h-screen bg-white/90 backdrop-blur-md"}`}
            initial={isMobile ? { opacity: 0, x: -20 } : false}
            animate={isMobile ? { opacity: 1, x: 0 } : {}}
            exit={isMobile ? { opacity: 0, x: -20 } : {}}
            transition={{ duration: 0.2 }}
          >
            <div className={`h-full flex flex-col ${isMobile ? "px-4 py-6" : "p-6"}`}>
              {!isMobile && (
                <div className="mb-8">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">ScamReport</span>
                  </Link>
                </div>
              )}

              <nav className="space-y-1 flex-1">
                {routes.map((route) => (
                  <div key={route.href} className="space-y-1">
                    <Link
                      href={route.href}
                      onClick={closeMenu}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg
                        ${pathname === route.href ? "bg-primary text-white" : "hover:bg-gray-100"}`}
                    >
                      <div className="flex items-center gap-3">
                        {route.icon}
                        <span>{route.name}</span>
                        {route.isNew && <Badge className="h-5 bg-green-500 text-white">New</Badge>}
                      </div>
                      {route.badge && <Badge className="bg-red-500 text-white">{route.badge}</Badge>}
                    </Link>
                    {route.subItems && pathname.includes(route.href) && (
                      <div className="ml-10 space-y-1 mt-1">
                        {route.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={closeMenu}
                            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg
                              ${pathname === subItem.href ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}
                          >
                            {subItem.icon}
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <Button variant="outline" className="mt-6 gap-2" onClick={() => (window.location.href = "/login")}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
