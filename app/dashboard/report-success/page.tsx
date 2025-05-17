"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, FileText } from "lucide-react"

export default function ReportSuccessPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={loaded ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <Card className="card-hover">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            <CardTitle className="text-2xl gradient-text">Report Submitted Successfully</CardTitle>
            <CardDescription className="text-base mt-2">
              Thank you for helping make Namibia safer from scams
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4 py-4"
            >
              <p className="text-gray-600">
                Your report has been submitted and will be reviewed by our team. You will receive a notification once
                the review is complete.
              </p>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-left">
                <h3 className="font-medium text-blue-800 mb-1">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-2 list-disc pl-5">
                  <li>Our team will review your report within 24-48 hours</li>
                  <li>If verified, your report will be published to help others</li>
                  <li>You can track the status of your report in "My Reports"</li>
                  <li>You may be contacted for additional information if needed</li>
                </ul>
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              className="w-full gradient-bg hover:opacity-90 rounded-xl"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => router.push("/dashboard/my-reports")}
            >
              <FileText className="mr-2 h-4 w-4" />
              View My Reports
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
