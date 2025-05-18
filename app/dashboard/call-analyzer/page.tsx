"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Phone, ShieldAlert, ArrowLeft, PlayCircle, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function CallAnalyzerPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [conversationText, setConversationText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("manual")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  // Simple phone validation
  const isValidPhone = () => {
    return phoneNumber.replace(/\D/g, "").length >= 7
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!conversationText.trim()) return

    try {
      setIsAnalyzing(true)

      const response = await fetch("/api/ai/phone-scam-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcription: conversationText,
          phoneNumber: phoneNumber,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      setAnalysisResult(data.data)
    } catch (error) {
      console.error("Error analyzing call:", error)
      toast({
        title: "Error",
        description: "Failed to analyze call. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      toast({
        title: "Recording stopped",
        description: "Your recording is ready for analysis.",
      })
      // In a real app, we would process the recording and get a transcription
      setConversationText(
        "This is a simulation of a transcribed conversation. In a real app, this would contain the actual transcription from your recorded call.",
      )
    } else {
      // Start recording
      setIsRecording(true)
      setRecordingTime(0)
      // Simulate recording time
      const interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 30) {
            clearInterval(interval)
            setIsRecording(false)
            return prev
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "high":
        return "High Risk"
      case "medium":
        return "Medium Risk"
      case "low":
        return "Low Risk"
      default:
        return "Unknown Risk"
    }
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-amber-500 hover:bg-amber-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "medium":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">AI Call Scam Detector</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone Call Analyzer
                </CardTitle>
                <CardDescription>Analyze a suspicious phone call to detect potential scams</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="record">Record Call</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-sm font-medium">
                      Phone Number (optional)
                    </label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="conversation" className="text-sm font-medium">
                      Call Content
                    </label>
                    <Textarea
                      id="conversation"
                      placeholder="Enter what was said during the call..."
                      value={conversationText}
                      onChange={(e) => setConversationText(e.target.value)}
                      className="min-h-[150px]"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Type out what was said during the call, including both your responses and the caller's statements.
                    </p>
                  </div>

                  <Button type="submit" disabled={!conversationText.trim() || isAnalyzing} className="w-full">
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Call"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="record" className="space-y-4">
                <div className="text-center py-6 space-y-6">
                  <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
                    <div
                      className={`absolute inset-0 rounded-full ${isRecording ? "bg-red-100 animate-pulse" : "bg-gray-100"}`}
                    ></div>
                    <Button
                      type="button"
                      onClick={handleRecordToggle}
                      variant={isRecording ? "destructive" : "default"}
                      size="icon"
                      className="h-20 w-20 rounded-full relative z-10"
                    >
                      <Mic className="h-8 w-8" />
                    </Button>
                    {isRecording && (
                      <div className="absolute bottom-0 bg-white rounded-full px-3 py-1 shadow-md">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600">
                    {isRecording
                      ? "Recording in progress. Tap to stop."
                      : "Tap the microphone to start recording the call"}
                  </p>

                  <div className="text-xs text-gray-500 max-w-sm mx-auto">
                    <p>For best results, place your phone on speaker and hold this device near your phone.</p>
                  </div>
                </div>

                {conversationText && !isRecording && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <PlayCircle className="h-4 w-4" /> Transcribed Content
                      </h4>
                      <p className="text-sm text-gray-700">{conversationText}</p>
                    </div>

                    <Button type="button" onClick={handleManualSubmit} disabled={isAnalyzing} className="w-full">
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Recording"
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {analysisResult && (
              <motion.div
                className="mt-8 space-y-4 border-t pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Analysis Results</h3>
                  </div>

                  <Badge className={getRiskBadgeColor(analysisResult.riskLevel)}>
                    {getRiskLabel(analysisResult.riskLevel)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Detected Warning Signs</h4>
                    <ul className="space-y-2">
                      {analysisResult.warningSignsDetected.map((sign: string, index: number) => (
                        <li key={index} className="text-sm flex gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">Scam Type</h4>
                      <p className="text-sm mt-1">{analysisResult.scamType || "Unknown"}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Recommended Action</h4>
                      <p className="text-sm mt-1">{analysisResult.recommendedAction}</p>
                    </div>
                  </div>
                </div>

                <Alert
                  className={
                    analysisResult.riskLevel === "high"
                      ? "border-red-500 bg-red-50"
                      : analysisResult.riskLevel === "medium"
                        ? "border-amber-500 bg-amber-50"
                        : "border-green-500 bg-green-50"
                  }
                >
                  <AlertTitle className="flex items-center gap-2">
                    {getRiskIcon(analysisResult.riskLevel)}
                    {analysisResult.riskLevel === "high"
                      ? "Warning: Likely Scam Detected"
                      : analysisResult.riskLevel === "medium"
                        ? "Caution: Possible Scam Detected"
                        : "Low Risk: Likely Legitimate Call"}
                  </AlertTitle>
                  <AlertDescription>
                    {analysisResult.riskLevel === "high"
                      ? "This call shows strong indicators of being a scam. We recommend ending contact and reporting to authorities."
                      : analysisResult.riskLevel === "medium"
                        ? "This call shows some suspicious patterns. Proceed with caution and verify through official channels."
                        : "This call appears to be legitimate, but always stay vigilant."}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              This analysis is based on AI evaluation and should be used as a guide only. When in doubt, verify through
              official channels.
            </p>

            {analysisResult && analysisResult.riskLevel !== "low" && (
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/report")}>
                Report This Scam
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
