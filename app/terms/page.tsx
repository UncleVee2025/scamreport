"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-primary mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-primary">Terms and Conditions</h1>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-primary mb-6">ScamReport Namibia Terms and Conditions</h2>

            <p className="text-gray-700 mb-4">Last updated: May 17, 2025</p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">1. Introduction</h3>
            <p className="text-gray-700 mb-4">
              Welcome to ScamReport Namibia. By accessing or using our platform, you agree to be bound by these Terms
              and Conditions, including any future amendments. These terms constitute a legally binding agreement
              between you and ScamReport Namibia regarding your use of our website, mobile application, and services.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">2. User Responsibilities</h3>
            <p className="text-gray-700 mb-4">
              Users are solely responsible for the accuracy, completeness, and truthfulness of the information they
              provide on the platform. By submitting a report, the User confirms that the information is factual to the
              best of their knowledge.
            </p>
            <p className="text-gray-700 mb-4">
              Users must not submit false reports or use the platform to harass, defame, or otherwise harm others. Any
              misuse of the platform may result in account termination and potential legal consequences.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">3. Platform Disclaimer</h3>
            <p className="text-gray-700 mb-4">
              ScamReport Namibia acts solely as a platform for reporting and information sharing and does not
              independently verify the accuracy of all reports. We are not liable for any damages or losses resulting
              from information submitted by Users.
            </p>
            <p className="text-gray-700 mb-4">
              The platform is provided "as is" without warranties of any kind, either express or implied, including but
              not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">4. Privacy Policy</h3>
            <p className="text-gray-700 mb-4">
              Our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              describes how we collect, use, and protect your personal information. By using our platform, you also
              agree to our Privacy Policy.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">5. User Accounts</h3>
            <p className="text-gray-700 mb-4">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. You must immediately notify ScamReport Namibia of any unauthorized use of
              your account or any other breach of security.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">6. Governing Law</h3>
            <p className="text-gray-700 mb-4">
              These Terms and Conditions are governed by the laws of the Republic of Namibia. Any disputes arising from
              these terms or your use of the platform shall be subject to the exclusive jurisdiction of the courts of
              Namibia.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">7. Changes to Terms</h3>
            <p className="text-gray-700 mb-4">
              We may modify these Terms at any time. Your continued use of the platform after any changes indicates your
              acceptance of the modified Terms. We will make reasonable efforts to notify users of significant changes.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">8. Contact Information</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms, please contact us at support@scamreportnam.org.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
