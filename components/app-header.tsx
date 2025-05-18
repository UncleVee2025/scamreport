"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bell, MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppHeader() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/dashboard" className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/explore-scams" className="text-lg font-medium hover:text-primary transition-colors">
                  Reports
                </Link>
                <Link href="/dashboard/report" className="text-lg font-medium hover:text-primary transition-colors">
                  Report a Scam
                </Link>
                <Link href="/dashboard/resources" className="text-lg font-medium hover:text-primary transition-colors">
                  Resources
                </Link>
                <Link href="/dashboard/profile" className="text-lg font-medium hover:text-primary transition-colors">
                  Profile
                </Link>
                <Link href="/dashboard/ai-tools" className="text-lg font-medium hover:text-primary transition-colors">
                  AI Tools
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Search icon on left */}
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)} className="lg:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="ScamReport Namibia" className="h-8 w-auto" />
            <span className="font-bold text-xl hidden md:inline-block">ScamReport Namibia</span>
          </Link>
        </div>

        {/* Desktop search bar */}
        <div className="hidden lg:flex items-center max-w-sm w-full mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for scams..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Mobile search bar (conditionally rendered) */}
        {showSearch && (
          <div className="absolute inset-x-0 top-16 p-4 bg-background border-b shadow-md lg:hidden z-50">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for scams..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications icon on right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <div className="p-2 text-center border-b">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">New comment on your report</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Your report was verified</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">Someone marked "Me Too" on your report</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </DropdownMenuItem>
              <div className="p-2 text-center border-t">
                <Link href="/dashboard/notifications" className="text-sm text-primary hover:underline">
                  View all notifications
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile link (visible on desktop) */}
          <Link href="/dashboard/profile" className="hidden md:block">
            <Button variant="ghost" size="sm">
              My Profile
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
