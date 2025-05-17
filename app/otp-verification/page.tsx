"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export default function OtpVerification() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendOtp = () => {
    setCanResend(false)
    setTimer(60)
    // Simulate OTP resend
    setTimeout(() => {
      // Show success message
    }, 1000)
  }

  const handleVerify = () => {
    setIsLoading(true)

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <header className="p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/register")} className="text-green-700">
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
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image src="/images/logo.png" alt="ScamReport Namibia Logo" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              OTP Verification
            </h1>
            <p className="text-gray-600 mt-1">Enter the 4-digit code sent to your phone</p>
          </div>

          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-xl font-bold bg-gray-50 border-gray-200"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                {canResend ? (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    className="text-blue-600 font-medium p-0 h-auto"
                  >
                    Resend OTP
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Resend OTP in <span className="font-medium">{timer}s</span>
                  </p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleVerify}
                disabled={otp.some((digit) => !digit) || isLoading}
                className="w-full py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
