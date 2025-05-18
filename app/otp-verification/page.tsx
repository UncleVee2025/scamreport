"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OTPVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [callbackUrl, setCallbackUrl] = useState("/dashboard")
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    const urlEmail = searchParams.get("email")
    const urlCallbackUrl = searchParams.get("callbackUrl")

    if (urlEmail) {
      setEmail(urlEmail)
    }

    if (urlCallbackUrl) {
      setCallbackUrl(urlCallbackUrl)
    }
  }, [searchParams])

  useEffect(() => {
    if (resendDisabled && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setResendDisabled(false)
      setCountdown(60)
    }
  }, [resendDisabled, countdown])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (value && !/^\d+$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    if (!/^\d+$/.test(pastedData)) {
      return
    }

    const digits = pastedData.slice(0, 6).split("")
    const newOtp = [...otp]

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)

    // Focus the next empty input or the last input
    for (let i = digits.length; i < 6; i++) {
      const nextInput = document.getElementById(`otp-${i}`)
      if (nextInput) {
        nextInput.focus()
        break
      }
    }
  }

  const handleResendOTP = async () => {
    setError("")
    setResendDisabled(true)

    try {
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Error resending OTP:", error)
      setError("Failed to resend OTP. Please try again.")
    }
  }

  const handleVerify = async () => {
    setError("")

    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits of the OTP.")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to dashboard or callback URL
      router.push(callbackUrl)
    } catch (error) {
      console.error("OTP verification error:", error)
      setError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="p-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/register")} className="text-primary">
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
            <div className="relative w-20 h-20 mx-auto mb-3">
              <Image src="/images/logo.png" alt="ScamReport Namibia Logo" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Verify Your Account</h1>
            <p className="text-gray-600 mt-1">We've sent a 6-digit verification code to {email || "your email"}</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-700">
                A new verification code has been sent to your email.
              </AlertDescription>
            </Alert>
          )}

          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp-0" className="text-gray-700">
                  Enter Verification Code
                </Label>
                <div className="flex gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="p-6 text-center text-xl font-bold bg-gray-50 border-gray-200"
                      maxLength={1}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleVerify}
                className="w-full py-6 bg-primary text-white hover:bg-primary/90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Account"
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Didn't receive the code?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary font-medium"
                    onClick={handleResendOTP}
                    disabled={resendDisabled}
                  >
                    {resendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
                  </Button>
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <p className="text-gray-600">
              Having trouble?{" "}
              <Link href="/help" className="text-primary font-medium hover:underline">
                Contact Support
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
