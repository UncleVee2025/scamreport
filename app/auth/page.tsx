"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, ShieldAlert, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AuthSelectionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <header className="p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="text-primary">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.div
              className="relative w-32 h-32 mx-auto mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Image src="/images/logo.png" alt="ScamReport Namibia Logo" fill className="object-contain" />
            </motion.div>
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome to ScamReport Namibia</h1>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Please select the appropriate login area to continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="transform transition-all duration-300"
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-2 border-primary overflow-hidden">
                <CardHeader className="bg-primary text-white pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <User className="h-10 w-10" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-2xl">User Login</CardTitle>
                  <CardDescription className="text-blue-100 text-center">
                    For registered users of ScamReport Namibia
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col items-center">
                  <ul className="space-y-2 mb-8 text-gray-600">
                    <li className="flex items-center">
                      <div className="bg-blue-100 p-1 rounded-full mr-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      Report scams and cybercrime
                    </li>
                    <li className="flex items-center">
                      <div className="bg-blue-100 p-1 rounded-full mr-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      Track your submitted reports
                    </li>
                    <li className="flex items-center">
                      <div className="bg-blue-100 p-1 rounded-full mr-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      Receive alerts about new scams
                    </li>
                    <li className="flex items-center">
                      <div className="bg-blue-100 p-1 rounded-full mr-2">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      Participate in community discussions
                    </li>
                  </ul>
                  <div className="w-full space-y-3">
                    <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-lg">
                      <Link href="/login">Login as User</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-12 text-lg">
                      <Link href="/register">Register New Account</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="transform transition-all duration-300"
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-2 border-blue-800 overflow-hidden">
                <CardHeader className="bg-blue-800 text-white pb-6">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <ShieldAlert className="h-10 w-10" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-2xl">Admin Portal</CardTitle>
                  <CardDescription className="text-blue-100 text-center">
                    Restricted access for authorized administrators only
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col items-center">
                  <ul className="space-y-2 mb-8 text-gray-600">
                    <li className="flex items-center">
                      <div className="bg-blue-100 p-1 rounded-full mr-2">
                        <ArrowRight className="h-3 w-3 text-blue-800" />
                      </div>
                      Manage user accounts and reports
                    </li>
                    <li className="flex items-center">
                      <div className="bg-blue-100 p-1 rounded-full mr-2">
                        <ArrowRight className="h-3 w-3 text-blue-800" />
                      </div>
                      Review and moderate content
                    </li>
                    <li className="flex items-center">
                      <div className="bg-blue-100 p-1 rounded-full mr-2">
                        <ArrowRight className="h-3 w-3 text-blue-800" />
                      </div>
                      Access analytics and reporting
                    </li>
                    <li className="flex items-center">
                      <div className="bg-blue-100 p-1 rounded-full mr-2">
                        <ArrowRight className="h-3 w-3 text-blue-800" />
                      </div>
                      Configure system settings
                    </li>
                  </ul>
                  <div className="w-full">
                    <Button asChild className="w-full bg-blue-800 text-white hover:bg-blue-900 h-12 text-lg">
                      <Link href="/admin/login">Login to Admin Portal</Link>
                    </Button>
                  </div>
                  <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <p className="text-xs text-amber-700 text-center">
                      Unauthorized access attempts are logged and may be reported to authorities
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Need help?{" "}
              <Link href="/help" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <Link href="/terms" className="hover:text-primary hover:underline">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:text-primary hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/help" className="hover:text-primary hover:underline">
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
