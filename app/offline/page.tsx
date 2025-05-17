"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff } from "lucide-react"

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <motion.div
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {isOnline ? <Wifi className="h-8 w-8 text-amber-500" /> : <WifiOff className="h-8 w-8 text-amber-500" />}
        </div>
        <h2 className="text-2xl font-bold mb-2">{isOnline ? "You're back online!" : "You're offline"}</h2>
        <p className="text-gray-600 mb-6">
          {isOnline
            ? "Your connection has been restored. You can continue using the app."
            : "Please check your internet connection and try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.location.reload()} className="gradient-bg hover:opacity-90">
            Refresh Page
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Return to Home
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
