"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface CommentFormProps {
  scamId: number
  onCommentAdded: (comment: any) => void
}

export function CommentForm({ scamId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      <Textarea
        placeholder="Add your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px] rounded-xl bg-white"
      />
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 rounded-xl"
        disabled={!comment.trim() || isSubmitting}
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
    </form>
  )
}
