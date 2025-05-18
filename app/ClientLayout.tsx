"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AppHeader } from "@/components/app-header"
import { ThemeProvider } from "@/components/theme-provider"
import { usePathname } from "next/navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show header and bottom nav on login and register pages
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/reset-password" ||
    pathname === "/new-password" ||
    pathname === "/otp-verification"

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {!isAuthPage && <AppHeader />}
        <main className="flex-1">{children}</main>
        {!isAuthPage && <BottomNavigation />}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
