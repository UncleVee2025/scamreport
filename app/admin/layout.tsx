"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Users,
  BarChart,
  Settings,
  AlertTriangle,
  LogOut,
  Home,
  FileText,
  MessageSquare,
  ImageIcon,
} from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Reports", href: "/admin/reports", icon: AlertTriangle },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Statistics", href: "/admin/statistics", icon: BarChart },
    { name: "Advertisements", href: "/admin/advertisements", icon: ImageIcon },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "Comments", href: "/admin/comments", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100/40 dark:bg-gray-900/40">
      {/* Mobile navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40 bg-white border-2 border-gray-300"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 border-r-2 border-gray-200">
          <div className="flex h-full flex-col">
            <div className="p-4 border-b-2 border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
            </div>
            <ScrollArea className="flex-1 bg-white">
              <nav className="flex flex-col gap-1 p-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all border-2 ${
                      pathname === item.href
                        ? "bg-blue-600 text-white border-blue-700 font-medium"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-base">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <div className="p-4 border-t-2 border-gray-200 bg-white">
              <Button
                variant="outline"
                className="w-full justify-start border-2 border-red-200 hover:bg-red-50 text-red-600"
                asChild
              >
                <Link href="/dashboard">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="text-base">Exit Admin</span>
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 border-r-2 border-gray-200 bg-white">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b-2 border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all border-2 ${
                    pathname === item.href
                      ? "bg-blue-600 text-white border-blue-700 font-medium"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-base">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t-2 border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start border-2 border-red-200 hover:bg-red-50 text-red-600"
              asChild
            >
              <Link href="/dashboard">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="text-base">Exit Admin</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
