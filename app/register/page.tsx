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
import { ArrowLeft, User, Mail, Lock, Phone, Upload, Eye, EyeOff, FileText } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Register() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [termsDialogOpen, setTermsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    username: "",
    surname: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    frontIdImage: null as File | null,
    backIdImage: null as File | null,
    selfieImage: null as File | null,
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [field]: e.target.files[0],
      })
    }
  }

  const handleNextStep = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeTerms) {
      alert("You must agree to the Terms and Conditions to continue.")
      return
    }

    setIsLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      router.push("/otp-verification")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (step === 1 ? router.push("/") : handlePrevStep())}
          className="text-primary"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 pb-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <Image src="/images/logo.png" alt="ScamReport Namibia Logo" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Create Account</h1>
            <p className="text-gray-600 mt-1">Join the fight against cybercrime in Namibia</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                      step >= i ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i}
                  </div>
                  <span className="text-xs text-gray-500">
                    {i === 1 ? "Personal Info" : i === 2 ? "Verification" : "Confirmation"}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary"
                initial={{ width: `${(step - 1) * 50}%` }}
                animate={{ width: `${(step - 1) * 50}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700">
                        Full Name (as per ID)
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="pl-10 py-6 bg-gray-50 border-gray-200"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surname" className="text-gray-700">
                        Surname
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="surname"
                          name="surname"
                          value={formData.surname}
                          onChange={handleChange}
                          className="pl-10 py-6 bg-gray-50 border-gray-200"
                          placeholder="Enter your surname"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber" className="text-gray-700">
                        ID Number
                      </Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="idNumber"
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleChange}
                          className="pl-10 py-6 bg-gray-50 border-gray-200"
                          placeholder="Enter your ID number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-700">
                        Username
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="pl-10 py-6 bg-gray-50 border-gray-200"
                          placeholder="Choose a username"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactNumber" className="text-gray-700">
                        Contact Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="contactNumber"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          className="pl-10 py-6 bg-gray-50 border-gray-200"
                          placeholder="Enter your contact number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 py-6 bg-gray-50 border-gray-200"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 py-6 bg-gray-50 border-gray-200"
                          placeholder="Create a password"
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

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 py-6 bg-gray-50 border-gray-200"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-6 bg-primary text-white hover:bg-primary/90 transition-all"
                  >
                    Continue to Verification
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-blue-800 mb-2">Identity Verification</h3>
                      <p className="text-sm text-blue-700">
                        To ensure the security of our platform, we require identity verification. Please upload clear
                        photos of your National ID (front and back) and a selfie holding your ID.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="frontIdImage" className="text-gray-700">
                          National ID (Front)
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          {formData.frontIdImage ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center">
                                <div className="w-full h-32 relative">
                                  <Image
                                    src={URL.createObjectURL(formData.frontIdImage) || "/placeholder.svg"}
                                    alt="ID Front"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">{formData.frontIdImage.name}</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData({ ...formData, frontIdImage: null })}
                                className="text-red-500 border-red-200 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer block">
                              <div className="flex flex-col items-center justify-center py-4">
                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG (max. 5MB)</p>
                              </div>
                              <Input
                                id="frontIdImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "frontIdImage")}
                                required
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="backIdImage" className="text-gray-700">
                          National ID (Back)
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          {formData.backIdImage ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center">
                                <div className="w-full h-32 relative">
                                  <Image
                                    src={URL.createObjectURL(formData.backIdImage) || "/placeholder.svg"}
                                    alt="ID Back"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">{formData.backIdImage.name}</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData({ ...formData, backIdImage: null })}
                                className="text-red-500 border-red-200 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer block">
                              <div className="flex flex-col items-center justify-center py-4">
                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG (max. 5MB)</p>
                              </div>
                              <Input
                                id="backIdImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "backIdImage")}
                                required
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="selfieImage" className="text-gray-700">
                          Selfie with ID
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          {formData.selfieImage ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-center">
                                <div className="w-full h-32 relative">
                                  <Image
                                    src={URL.createObjectURL(formData.selfieImage) || "/placeholder.svg"}
                                    alt="Selfie with ID"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <p className="text-sm text-gray-500">{formData.selfieImage.name}</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData({ ...formData, selfieImage: null })}
                                className="text-red-500 border-red-200 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer block">
                              <div className="flex flex-col items-center justify-center py-4">
                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG (max. 5MB)</p>
                              </div>
                              <Input
                                id="selfieImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "selfieImage")}
                                required
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={handlePrevStep} className="flex-1 py-6">
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 py-6 bg-primary text-white hover:bg-primary/90 transition-all"
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-6">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <h3 className="font-medium text-green-800 mb-2">Almost Done!</h3>
                      <p className="text-sm text-green-700">
                        Please review our terms and conditions before completing your registration. After submission,
                        we'll send an OTP to your phone for verification.
                      </p>
                    </div>

                    <Tabs defaultValue="terms" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                        <TabsTrigger value="disclaimer">Disclaimer</TabsTrigger>
                      </TabsList>
                      <TabsContent value="terms" className="mt-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="h-48 overflow-y-auto text-sm text-gray-700 space-y-3 pr-2">
                              <h4 className="font-medium">1. Introduction</h4>
                              <p>
                                Welcome to ScamReport Namibia. By accessing or using our platform, you agree to be bound
                                by these Terms and Conditions, including any future amendments.
                              </p>
                              <h4 className="font-medium">2. User Responsibilities</h4>
                              <p>
                                Users are solely responsible for the accuracy, completeness, and truthfulness of the
                                information they provide on the platform.
                              </p>
                              <p>
                                By submitting a report, the User confirms that the information is factual to the best of
                                their knowledge.
                              </p>
                              <h4 className="font-medium">3. Platform Disclaimer</h4>
                              <p>
                                ScamReport Namibia acts solely as a platform for reporting and information sharing and
                                does not independently verify the accuracy of reports.
                              </p>
                              <p>
                                We are not liable for any damages or losses resulting from information submitted by
                                Users.
                              </p>
                              <h4 className="font-medium">4. Governing Law</h4>
                              <p>These Terms and Conditions are governed by the laws of the Republic of Namibia.</p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="disclaimer" className="mt-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="h-48 overflow-y-auto text-sm text-gray-700 space-y-3 pr-2">
                              <p>
                                By submitting information on ScamReport, you confirm that the details provided are
                                accurate and supported by evidence. Any false reporting is subject to legal
                                consequences.
                              </p>
                              <p>
                                ScamReport is a listing platform and is not liable for the authenticity of the reports
                                submitted by users.
                              </p>
                              <p>
                                Users are encouraged to conduct due diligence before making any decisions based on the
                                information provided on this platform.
                              </p>
                              <p>
                                ScamReport Namibia reserves the right to remove or edit reports that violate community
                                guidelines or Namibian law.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>

                    <div className="flex items-start space-x-3 pt-2">
                      <Checkbox
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                        className="mt-1"
                        required
                      />
                      <Label htmlFor="agreeTerms" className="text-sm text-gray-700">
                        I have read and agree to the{" "}
                        <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="link" className="h-auto p-0 text-primary">
                              Terms and Conditions
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Terms and Conditions</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 text-sm">
                              <h3 className="text-lg font-semibold">1. Introduction</h3>
                              <p>
                                Welcome to ScamReport Namibia. By accessing or using our platform, you agree to be bound
                                by these Terms and Conditions, including any future amendments.
                              </p>
                              <h3 className="text-lg font-semibold">2. User Responsibilities</h3>
                              <p>
                                Users are solely responsible for the accuracy, completeness, and truthfulness of the
                                information they provide on the platform.
                              </p>
                              <p>
                                By submitting a report, the User confirms that the information is factual to the best of
                                their knowledge.
                              </p>
                              <h3 className="text-lg font-semibold">3. Platform Disclaimer</h3>
                              <p>
                                ScamReport Namibia acts solely as a platform for reporting and information sharing and
                                does not independently verify the accuracy of reports.
                              </p>
                              <p>
                                We are not liable for any damages or losses resulting from information submitted by
                                Users.
                              </p>
                              <h3 className="text-lg font-semibold">4. Governing Law</h3>
                              <p>These Terms and Conditions are governed by the laws of the Republic of Namibia.</p>
                              <h3 className="text-lg font-semibold">5. Privacy Policy</h3>
                              <p>
                                Our Privacy Policy describes how we collect, use, and protect your personal information.
                                By using our platform, you also agree to our Privacy Policy.
                              </p>
                              <h3 className="text-lg font-semibold">6. User Accounts</h3>
                              <p>
                                You are responsible for maintaining the confidentiality of your account credentials and
                                for all activities that occur under your account.
                              </p>
                              <h3 className="text-lg font-semibold">7. Prohibited Content</h3>
                              <p>
                                Users are prohibited from posting content that is illegal, defamatory, harassing,
                                threatening, or otherwise inappropriate.
                              </p>
                              <h3 className="text-lg font-semibold">8. Termination</h3>
                              <p>
                                We reserve the right to terminate or suspend your account at our discretion, without
                                notice, for conduct that we believe violates these Terms or is harmful to other users,
                                us, or third parties, or for any other reason.
                              </p>
                              <h3 className="text-lg font-semibold">9. Changes to Terms</h3>
                              <p>
                                We may modify these Terms at any time. Your continued use of the platform after any
                                changes indicates your acceptance of the modified Terms.
                              </p>
                              <h3 className="text-lg font-semibold">10. Contact Information</h3>
                              <p>
                                If you have any questions about these Terms, please contact us at
                                support@scamreportnam.org.
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>{" "}
                        and understand the legal liabilities of false reporting. I acknowledge ScamReport is only a
                        listing platform and not liable for the information published.
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={handlePrevStep} className="flex-1 py-6">
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.agreeTerms || isLoading}
                      className="flex-1 py-6 bg-primary text-white hover:bg-primary/90 transition-all"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        "Complete Registration"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </motion.div>

          {step === 1 && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Login
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
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
