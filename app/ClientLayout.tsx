"use client"

import type React from "react"
import { useEffect } from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/use-toast"
import { ErrorBoundary } from "@/components/error-boundary"
import { Analytics } from "@/components/analytics"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js").catch((err) => {
          console.error("Service worker registration failed:", err)
        })
      })
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-background to-background/80`}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <ToastProvider>
              <Suspense>
                {children}
                <Analytics />
              </Suspense>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
