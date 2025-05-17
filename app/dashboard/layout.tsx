"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogOut, Bell } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Footer } from "@/components/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/images/logo.png" alt="ScamReport Namibia Logo" fill className="object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-primary">ScamReport</h2>
              <p className="text-xs text-gray-500">Namibia</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  3
                </span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Handle logout
                window.location.href = "/"
              }}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-24">{children}</main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Footer */}
      <Footer />
    </div>
  )
}
