"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, MessageSquare, Upload, Info, ChevronRight, ChevronLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function ReportPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [reportType, setReportType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    contactInfo: "",
    reportingForOthers: "no",
    scammerName: "",
    description: "",
    moneyInvolved: "no",
    amountScammed: "",
    whatWasScammed: "",
    date: "",
    location: "",
    policeCase: "",
    evidence: null as File | null,
    isAnonymous: false,
    allowComments: true,
    legalConsent: false,
    category: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        evidence: e.target.files[0],
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
    setIsLoading(true)

    try {
      // In a real app, this would be an actual API call to submit the report
      // const response = await fetch('/api/scams', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // const data = await response.json()

      // Send email notification
      await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "scamreportnam@popya.org",
          subject: `New Scam Report: ${formData.title || formData.scammerName}`,
          text: `A new scam report has been submitted:
            
Type: ${reportType}
Category: ${formData.category}
Scammer/Company: ${formData.scammerName}
Description: ${formData.description}
Reporter: ${formData.isAnonymous ? "Anonymous" : formData.fullName}
Contact: ${formData.contactInfo}
Location: ${formData.location}
Date: ${formData.date}
Money Involved: ${formData.moneyInvolved === "yes" ? `Yes (NAD ${formData.amountScammed})` : "No"}
What Was Scammed: ${formData.whatWasScammed}
Police Case: ${formData.policeCase || "N/A"}`,
        }),
      })

      // Simulate successful submission
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "Report submitted successfully",
          description: "Thank you for helping make Namibia safer from scams.",
        })
        router.push("/dashboard/report-success")
      }, 1500)
    } catch (error) {
      console.error("Error submitting report:", error)
      setIsLoading(false)
      toast({
        title: "Error submitting report",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const cybercrimeCategories = [
    "Pyramid Scheme",
    "Online Bullying",
    "Phishing Email",
    "Fraudulent Call",
    "False Investment",
    "Stolen Identity",
    "Online Marketplace Scam",
    "Fake Job Offer",
    "Company Scam",
    "Fake Charity",
    "Property Rental Scam",
    "Social Media Scam",
    "Other",
  ]

  const cyberbullyingCategories = ["Romance Scams", "Social Media Bullying", "Online Harassment", "Phishing Links"]

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Report a Scam</h1>
          <p className="text-gray-500">Help others by reporting scam activities</p>
        </div>
      </div>

      {!reportType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow card-hover"
            onClick={() => setReportType("cybercrime")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                Report Cyber Crime
              </CardTitle>
              <CardDescription>Report scams, fraud, phishing, and other cyber crimes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Financial scams and fraud</p>
                <p>• Phishing attempts</p>
                <p>• Fake websites and businesses</p>
                <p>• Investment scams</p>
                <p>• Identity theft</p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardFooter>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow card-hover"
            onClick={() => setReportType("cyberbullying")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Report Cyberbullying & Phishing
              </CardTitle>
              <CardDescription>Report online harassment, bullying, and phishing attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Online harassment</p>
                <p>• Social media bullying</p>
                <p>• Romance scams</p>
                <p>• Fake profiles</p>
                <p>• Phishing links</p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {reportType && (
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {reportType === "cybercrime" ? (
                    <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                  ) : (
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  )}
                  <CardTitle>
                    {reportType === "cybercrime" ? "Report Cyber Crime" : "Report Cyberbullying & Phishing"}
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setReportType(null)}>
                  Change Type
                </Button>
              </div>
              <CardDescription>
                {step === 1
                  ? "Provide details about the incident"
                  : step === 2
                    ? "Upload evidence and additional information"
                    : "Review and submit your report"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                          step >= i ? "gradient-bg text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {i}
                      </div>
                      <span className="text-xs text-gray-500">
                        {i === 1 ? "Details" : i === 2 ? "Evidence" : "Review"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full gradient-bg"
                    initial={{ width: `${(step - 1) * 50}%` }}
                    animate={{ width: `${(step - 1) * 50}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <>
                    <div className="space-y-4">
                      {reportType === "cybercrime" && (
                        <div className="space-y-2">
                          <Label htmlFor="category">Scam Category</Label>
                          <Select
                            onValueChange={(value) => handleSelectChange("category", value)}
                            value={formData.category}
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {cybercrimeCategories.map((category) => (
                                <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {reportType === "cyberbullying" && (
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            onValueChange={(value) => handleSelectChange("category", value)}
                            value={formData.category}
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {cyberbullyingCategories.map((category) => (
                                <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name (Optional for anonymity)</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactInfo">Contact Information (Optional)</Label>
                        <Input
                          id="contactInfo"
                          name="contactInfo"
                          value={formData.contactInfo}
                          onChange={handleChange}
                          placeholder="Phone number or email"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Are you reporting on behalf of someone else?</Label>
                        <RadioGroup
                          value={formData.reportingForOthers}
                          onValueChange={(value) => handleSelectChange("reportingForOthers", value)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="reporting-yes" />
                            <Label htmlFor="reporting-yes" className="cursor-pointer">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="reporting-no" />
                            <Label htmlFor="reporting-no" className="cursor-pointer">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scammerName">Name of Scammer/Company</Label>
                        <Input
                          id="scammerName"
                          name="scammerName"
                          value={formData.scammerName}
                          onChange={handleChange}
                          placeholder="Enter name of scammer or company"
                          required
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description of Incident</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Provide details about what happened"
                          rows={4}
                          required
                          className="rounded-xl"
                        />
                      </div>

                      {reportType === "cybercrime" && (
                        <>
                          <div className="space-y-2">
                            <Label>Was money involved?</Label>
                            <RadioGroup
                              value={formData.moneyInvolved}
                              onValueChange={(value) => handleSelectChange("moneyInvolved", value)}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="money-yes" />
                                <Label htmlFor="money-yes" className="cursor-pointer">
                                  Yes
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="money-no" />
                                <Label htmlFor="money-no" className="cursor-pointer">
                                  No
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {formData.moneyInvolved === "yes" && (
                            <div className="space-y-2">
                              <Label htmlFor="amountScammed">How much?</Label>
                              <Input
                                id="amountScammed"
                                name="amountScammed"
                                value={formData.amountScammed}
                                onChange={handleChange}
                                placeholder="Enter amount in NAD"
                                className="rounded-xl"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="whatWasScammed">What was scammed?</Label>
                            <Input
                              id="whatWasScammed"
                              name="whatWasScammed"
                              value={formData.whatWasScammed}
                              onChange={handleChange}
                              placeholder="Money, personal information, etc."
                              required
                              className="rounded-xl"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date and Time of Incident</Label>
                        <Input
                          id="date"
                          name="date"
                          type="datetime-local"
                          value={formData.date}
                          onChange={handleChange}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, town, or online platform"
                          className="rounded-xl"
                        />
                      </div>

                      {reportType === "cybercrime" && (
                        <div className="space-y-2">
                          <Label htmlFor="policeCase">Police Case Number (if applicable)</Label>
                          <Input
                            id="policeCase"
                            name="policeCase"
                            value={formData.policeCase}
                            onChange={handleChange}
                            placeholder="Enter case number if reported to police"
                            className="rounded-xl"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="evidence">Upload Evidence (Images, Audio, Documents)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                          {formData.evidence ? (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-500">{formData.evidence.name}</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData({ ...formData, evidence: null })}
                                className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl"
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer block">
                              <div className="flex flex-col items-center justify-center py-4">
                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, MP3 or MP4 (max. 10MB)</p>
                              </div>
                              <Input
                                id="evidence"
                                type="file"
                                accept="image/*,audio/*,video/*,application/pdf"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="isAnonymous"
                            name="isAnonymous"
                            checked={formData.isAnonymous}
                            onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: checked as boolean })}
                            className="mt-1"
                          />
                          <Label htmlFor="isAnonymous" className="text-sm text-gray-700">
                            Remain Anonymous (your personal details will not be visible to other users)
                          </Label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="allowComments"
                            name="allowComments"
                            checked={formData.allowComments}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, allowComments: checked as boolean })
                            }
                            className="mt-1"
                          />
                          <Label htmlFor="allowComments" className="text-sm text-gray-700">
                            Allow Public Comments (other users can comment on your report)
                          </Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-6">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start space-x-3">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium mb-1">Please Review Your Report</p>
                          <p>
                            Ensure all information is accurate before submitting. False reporting may have legal
                            consequences. Your report will help others stay safe.
                          </p>
                        </div>
                      </div>

                      <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="details">Report Details</TabsTrigger>
                          <TabsTrigger value="evidence">Evidence & Privacy</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="mt-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Report Type</p>
                              <p className="text-sm">
                                {reportType === "cybercrime" ? "Cyber Crime" : "Cyberbullying & Phishing"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Category</p>
                              <p className="text-sm">
                                {formData.category ? formData.category.replace(/-/g, " ") : "Not specified"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Scammer/Entity Name</p>
                              <p className="text-sm">{formData.scammerName}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Reporter</p>
                              <p className="text-sm">
                                {formData.isAnonymous ? "Anonymous" : formData.fullName || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Reporting for Others</p>
                              <p className="text-sm">{formData.reportingForOthers === "yes" ? "Yes" : "No"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Location</p>
                              <p className="text-sm">{formData.location || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Date of Incident</p>
                              <p className="text-sm">
                                {formData.date ? new Date(formData.date).toLocaleString() : "Not provided"}
                              </p>
                            </div>
                            {reportType === "cybercrime" && (
                              <>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Money Involved</p>
                                  <p className="text-sm">
                                    {formData.moneyInvolved === "yes"
                                      ? `Yes (NAD ${formData.amountScammed || "Not specified"})`
                                      : "No"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">What Was Scammed</p>
                                  <p className="text-sm">{formData.whatWasScammed}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Police Case Number</p>
                                  <p className="text-sm">{formData.policeCase || "Not provided"}</p>
                                </div>
                              </>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Description</p>
                            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-xl">{formData.description}</p>
                          </div>
                        </TabsContent>
                        <TabsContent value="evidence" className="mt-4 space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Evidence Uploaded</p>
                            <p className="text-sm">
                              {formData.evidence ? formData.evidence.name : "No evidence uploaded"}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Anonymity</p>
                              <p className="text-sm">{formData.isAnonymous ? "Yes" : "No"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Allow Comments</p>
                              <p className="text-sm">{formData.allowComments ? "Yes" : "No"}</p>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <div className="flex items-start space-x-3 pt-2">
                        <Checkbox
                          id="legalConsent"
                          name="legalConsent"
                          checked={formData.legalConsent}
                          onCheckedChange={(checked) => setFormData({ ...formData, legalConsent: checked as boolean })}
                          className="mt-1"
                        />
                        <Label htmlFor="legalConsent" className="text-sm text-gray-700">
                          I confirm that the information provided is true and accurate to the best of my knowledge. I
                          understand that false reporting is subject to legal consequences.
                        </Label>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex items-center rounded-xl"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => setReportType(null)} className="rounded-xl">
                  Change Report Type
                </Button>
              )}

              {step < 3 ? (
                <Button type="button" onClick={handleNextStep} className="gradient-bg hover:opacity-90 rounded-xl">
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!formData.legalConsent || isLoading}
                  className="gradient-bg hover:opacity-90 rounded-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
