"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export function URLChecker() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    try {
      setIsLoading(true)

      const response = await fetch("/api/ai/analyze-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      setResult(data.data)
    } catch (error) {
      console.error("Error analyzing URL:", error)
      toast({
        title: "Error",
        description: "Failed to analyze URL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return "bg-green-500"
    if (score < 70) return "bg-amber-500"
    return "bg-red-500"
  }

  const getRiskLabel = (score: number) => {
    if (score < 30) return "Low Risk"
    if (score < 70) return "Medium Risk"
    return "High Risk"
  }

  const getRiskIcon = (score: number) => {
    if (score < 30) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (score < 70) return <AlertCircle className="h-5 w-5 text-amber-500" />
    return <AlertTriangle className="h-5 w-5 text-red-500" />
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          AI URL Phishing Checker
        </CardTitle>
        <CardDescription>Check if a URL is potentially malicious or a phishing attempt</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="url"
              placeholder="Enter URL to check (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isLoading || !url}>
              {isLoading ? "Analyzing..." : "Check URL"}
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Analyzing URL</span>
              <span>Please wait...</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium flex items-center gap-2">
                Risk Assessment {getRiskIcon(result.riskScore)}
              </div>
              <Badge className={getRiskColor(result.riskScore)}>{getRiskLabel(result.riskScore)}</Badge>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-gray-500">Risk Score</div>
              <div className="relative pt-1">
                <Progress value={result.riskScore} className={`h-2 ${getRiskColor(result.riskScore)}`} />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Safe</span>
                  <span>Suspicious</span>
                  <span>Dangerous</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Recommendation</h4>
              <p className="text-sm">{result.recommendation}</p>
            </div>

            {result.reasonsForConcern?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Warning Signs</h4>
                <ul className="text-sm space-y-1">
                  {result.reasonsForConcern.map((reason: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        This is an AI-powered analysis and should be used as a guideline only. Always exercise caution with unfamiliar
        URLs.
      </CardFooter>
    </Card>
  )
}
