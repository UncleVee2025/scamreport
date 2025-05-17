"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // This function will run on route changes
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

    // Replace this with your actual analytics tracking code
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "G-MEASUREMENT_ID", {
        page_path: url,
      })
    }

    // You can also log page views to your backend
    try {
      fetch("/api/analytics/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: url }),
      })
    } catch (error) {
      // Silent fail for analytics
      console.error("Analytics error:", error)
    }
  }, [pathname, searchParams])

  return null
}
