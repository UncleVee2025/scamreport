"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, User, ShieldAlert } from "lucide-react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="relative w-40 h-40 mx-auto mb-6">
            <Image src="/images/logo.png" alt="ScamReport Namibia Logo" fill className="object-contain" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">ScamReport Namibia</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">Empowering Namibians to fight cybercrime together</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md mb-12"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Login Option</h2>

            <div className="space-y-4">
              <Link href="/login" className="w-full block">
                <Button className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    User Login
                  </div>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/admin/login" className="w-full block">
                <Button className="w-full h-14 text-lg bg-blue-800 hover:bg-blue-900 text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <ShieldAlert className="mr-2 h-5 w-5" />
                    Admin Login
                  </div>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                New user?{" "}
                <Link href="/register" className="text-primary font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/80 text-sm">© 2023 ScamReport Namibia. All rights reserved.</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
