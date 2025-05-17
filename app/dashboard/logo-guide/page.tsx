"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, AlertTriangle, FileImage, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"
import Image from "next/image"

export default function LogoGuidePage() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      title: "Access Project Files",
      description: "First, you need to access your project's root directory.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Your logo is stored in the <code className="bg-gray-100 px-2 py-1 rounded">public/images/</code> directory
            of your project.
          </p>

          <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
            <div className="flex items-center gap-2 text-blue-600">
              <Folder className="h-4 w-4" />
              <span>project-root/</span>
            </div>
            <div className="flex items-center gap-2 ml-6 text-blue-600">
              <Folder className="h-4 w-4" />
              <span>public/</span>
            </div>
            <div className="flex items-center gap-2 ml-12 text-blue-600">
              <FolderOpen className="h-4 w-4" />
              <span>images/</span>
            </div>
            <div className="flex items-center gap-2 ml-18 text-green-600">
              <FileImage className="h-4 w-4" />
              <span>logo.png</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Prepare Your Logo",
      description: "Ensure your logo meets the recommended specifications.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">For best results, your logo should:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Be in PNG or SVG format (PNG recommended for better compatibility)</li>
            <li>Have a transparent background</li>
            <li>Be at least 500x500 pixels for high-resolution displays</li>
            <li>Be less than 1MB in file size</li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
              <p className="text-blue-700 text-sm">
                If your logo has a background, make sure it's transparent or matches your app's background color.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Replace the Logo",
      description: "Upload your new logo to replace the existing one.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">To replace the logo:</p>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              Name your new logo file <code className="bg-gray-100 px-2 py-1 rounded">logo.png</code>
            </li>
            <li>
              Upload it to the <code className="bg-gray-100 px-2 py-1 rounded">public/images/</code> directory
            </li>
            <li>Replace the existing file when prompted</li>
            <li>Refresh your application to see the changes</li>
          </ol>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">Example upload command (if using terminal):</p>
            <code className="block bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
              cp /path/to/your/new-logo.png ./public/images/logo.png
            </code>
          </div>
        </div>
      ),
    },
    {
      title: "Verify Changes",
      description: "Make sure your new logo appears correctly throughout the app.",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">After uploading your new logo:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Clear your browser cache</li>
            <li>Refresh the application</li>
            <li>Check the logo on multiple pages</li>
            <li>Verify it looks good on both mobile and desktop views</li>
          </ol>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-green-700 text-sm">
                If your logo doesn't appear immediately, try a hard refresh (Ctrl+F5 on Windows/Linux or Cmd+Shift+R on
                Mac).
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-center mb-2">Logo Upload Guide</h1>
        <p className="text-gray-600 text-center mb-8">Learn how to change your app's logo</p>

        {/* Current Logo Preview */}
        <Card className="mb-8">
          <CardContent className="pt-6 flex flex-col items-center">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Current Logo</h2>
            <div className="relative w-40 h-40 mb-4">
              <Image src="/images/logo.png" alt="Current Logo" fill className="object-contain" />
            </div>
            <p className="text-sm text-gray-500">Located at: public/images/logo.png</p>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index + 1)}
                className={`flex flex-col items-center w-1/4 relative ${
                  activeStep === index + 1 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    activeStep === index + 1
                      ? "bg-blue-600 text-white"
                      : activeStep > index + 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {activeStep > index + 1 ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <span className="text-xs text-center hidden sm:block">{step.title}</span>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-0.5 ${
                      activeStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </button>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-2">{steps[activeStep - 1].title}</h2>
              <p className="text-gray-600 mb-6">{steps[activeStep - 1].description}</p>
              {steps[activeStep - 1].content}
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
            disabled={activeStep === steps.length}
          >
            Next
          </Button>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNavigation />
      </div>
    </div>
  )
}
