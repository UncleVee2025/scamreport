"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Lock, Mail, Eye, EyeOff, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call to backend
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Send email notification for security
        await fetch("/api/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: "admin@scamreportnam.org",
            subject: "Admin Login Alert",
            text: `Admin user ${email} has logged in to the ScamReport Namibia admin platform at ${new Date().toISOString()}.`,
          }),
        })

        router.push("/admin/dashboard")
      } else {
        setError(data.message || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col">
      <header className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="text-white bg-white/10 hover:bg-white/20"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <motion.div
                className="relative w-16 h-16"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <Image src="/images/logo.png" alt="ScamReport Namibia Logo" fill className="object-contain" />
              </motion.div>
              <ShieldAlert className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-blue-100 mt-1">Restricted access - Authorized personnel only</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <Alert variant="destructive" className="border-2 border-red-600 bg-red-50">
                <AlertTitle className="text-red-700">Authentication Error</AlertTitle>
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-100">
              <p className="text-sm text-blue-700">
                This area is restricted to authorized administrators only. Unauthorized access attempts are logged and
                may be reported to authorities.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-6 bg-gray-50 border-2 border-gray-200 rounded-xl"
                    placeholder="Enter your admin email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <Link href="/admin/reset-password" className="text-sm text-blue-600 hover:underline">
                    Reset Password
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 py-6 bg-gray-50 border-2 border-gray-200 rounded-xl"
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-2 border-gray-300 h-5 w-5" />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember this device (8 hours)
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full py-6 bg-blue-700 text-white hover:bg-blue-800 transition-all rounded-xl border-2 border-blue-600 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Login to Admin Portal"
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <p className="text-blue-100">
              Not an administrator?{" "}
              <Link href="/login" className="text-white font-medium hover:underline">
                Go to User Login
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-blue-600">
              <div className="flex justify-center space-x-4 text-sm text-blue-200">
                <Link href="/terms" className="hover:text-white hover:underline">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:text-white hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/contact" className="hover:text-white hover:underline">
                  Contact Support
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
