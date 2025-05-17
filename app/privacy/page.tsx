"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-primary mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-primary">Privacy Policy</h1>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-primary mb-6">ScamReport Namibia Privacy Policy</h2>

            <p className="text-gray-700 mb-4">Last updated: May 17, 2025</p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">1. Introduction</h3>
            <p className="text-gray-700 mb-4">
              ScamReport Namibia ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our website, mobile
              application, and services (collectively, the "Platform").
            </p>
            <p className="text-gray-700 mb-4">
              Please read this Privacy Policy carefully. By accessing or using the Platform, you acknowledge that you
              have read, understood, and agree to be bound by all the terms of this Privacy Policy.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">2. Information We Collect</h3>
            <p className="text-gray-700 mb-4">
              We may collect several types of information from and about users of our Platform, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                Personal information: name, email address, telephone number, ID number, and any other information you
                provide when creating an account or submitting a report.
              </li>
              <li>
                Identity verification information: copies of your national ID and selfie for verification purposes.
              </li>
              <li>
                Usage data: information about how you use our Platform, including IP address, browser type, pages
                visited, and time spent on the Platform.
              </li>
              <li>
                Device information: information about the device you use to access our Platform, including device type,
                operating system, and mobile network information.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">3. How We Use Your Information</h3>
            <p className="text-gray-700 mb-4">We may use the information we collect for various purposes, including:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>To provide and maintain our Platform</li>
              <li>To verify your identity and prevent fraud</li>
              <li>To process and manage your account</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send you notifications about your account or reports</li>
              <li>To improve our Platform and develop new features</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">4. Data Security</h3>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information from
              unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the
              Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">5. Data Retention</h3>
            <p className="text-gray-700 mb-4">
              We will retain your personal information only for as long as necessary to fulfill the purposes for which
              it was collected, including to comply with legal obligations, resolve disputes, and enforce our
              agreements.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">6. Your Rights</h3>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate or incomplete information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to restrict or object to processing of your personal information</li>
              <li>The right to data portability</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section
              below.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">7. Changes to This Privacy Policy</h3>
            <p className="text-gray-700 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6 mb-3">8. Contact Us</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at privacy@scamreportnam.org.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
