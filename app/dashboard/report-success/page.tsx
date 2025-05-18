"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, FileText } from "lucide-react"
import Link from "next/link"

export default function ReportSuccessPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 rounded-full bg-green-100 p-3 w-20 h-20 flex items-center justify-center"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-green-700">Report Submitted Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              Thank you for your report. Your contribution helps make Namibia safer from scams.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>Our team will review your report within 24-48 hours.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>Once verified, your report will be published on our platform.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>You'll receive a notification when your report is approved.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button asChild className="gradient-bg hover:opacity-90 rounded-xl">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/dashboard/my-reports">
                  <FileText className="mr-2 h-4 w-4" />
                  View My Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
