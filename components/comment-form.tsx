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

    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`/api/scams/${scamId}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: comment })
      // })
      // const data = await response.json()

      // Simulate API response
      setTimeout(() => {
        const newComment = {
          id: Date.now(),
          user: {
            name: "You",
            avatar: "/placeholder.svg?height=40&width=40&text=You",
          },
          text: comment,
          date: "Just now",
        }

        onCommentAdded(newComment)
        setComment("")
        setIsSubmitting(false)
        toast({
          title: "Comment posted",
          description: "Your comment has been added successfully.",
        })
      }, 500)
    } catch (error) {
      console.error("Error submitting comment:", error)
      setIsSubmitting(false)
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      })
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
