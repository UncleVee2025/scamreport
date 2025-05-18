"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle, Shield, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CommentFormProps {
  scamId: number
  onCommentAdded: (comment: any) => void
}

export function EnhancedCommentForm({ scamId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [shouldShowWarning, setShouldShowWarning] = useState(false)

  const analyzeComment = async () => {
    if (!comment.trim() || comment.length < 10) return

    try {
      setIsAnalyzing(true)

      const response = await fetch("/api/ai/analyze-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message)
      }

      setAnalysis(data.data)

      // Show warning if the AI recommends review or rejection
      if (data.data.recommendedAction !== "approve") {
        setShouldShowWarning(true)
      } else {
        setShouldShowWarning(false)
      }
    } catch (error) {
      console.error("Error analyzing comment:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    console.log(`Attempting to submit comment to scam ID: ${scamId}`)

    try {
      // Make an actual API call to the backend
      console.log(`Sending request to /api/scams/${scamId}/comments`)
      const response = await fetch(`/api/scams/${scamId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, comment: comment }), // In a real app, get userId from auth context
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!data.success) {
        throw new Error(data.message || "Failed to post comment")
      }

      // Format the comment for display
      const newComment = {
        id: data.data.id,
        user: {
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40&text=You",
        },
        text: comment,
        date: "Just now",
      }

      onCommentAdded(newComment)
      setComment("")
      setAnalysis(null)
      setShouldShowWarning(false)
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      })
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Error",
        description: `Failed to post your comment: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Textarea
          placeholder="Add your comment..."
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
            // Clear warnings when comment changes significantly
            if (
              (analysis && e.target.value.length < comment.length - 10) ||
              e.target.value.length > comment.length + 10
            ) {
              setAnalysis(null)
              setShouldShowWarning(false)
            }
          }}
          onBlur={() => comment.length >= 10 && analyzeComment()}
          className="min-h-[100px] rounded-xl bg-white pr-10"
        />
        {comment.length >= 10 && (
          <div className="absolute right-3 top-3">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={analyzeComment}
              className="h-6 w-6 rounded-full"
              disabled={isAnalyzing}
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </Button>
          </div>
        )}
      </div>

      {shouldShowWarning && (
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-sm">Your comment may violate our community guidelines</AlertTitle>
          <AlertDescription className="text-xs">
            {analysis?.flaggedWords?.length > 0 && (
              <>Our AI detected potentially concerning content. Please revise your comment.</>
            )}
            {analysis?.containsPersonalInfo && <>Please avoid sharing personal information in public comments.</>}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          AI-powered content safety
        </div>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 rounded-xl"
          disabled={!comment.trim() || isSubmitting || (shouldShowWarning && analysis?.recommendedAction === "reject")}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
      </div>
    </form>
  )
}
