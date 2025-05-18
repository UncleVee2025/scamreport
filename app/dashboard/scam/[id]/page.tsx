"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  Flag,
  MapPin,
  MessageSquare,
  ThumbsUp,
  Trash2,
  User,
  Share2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { CommentForm } from "@/components/comment-form"
import { ScamDetailEnhancements } from "@/components/scam-detail-enhancements"

export default function ScamDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [scam, setScam] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [meTooCount, setMeTooCount] = useState(0)
  const [hasClickedMeToo, setHasClickedMeToo] = useState(false)
  const [comments, setComments] = useState<any[]>([])

  useEffect(() => {
    fetchScamDetails()
  }, [params.id])

  const fetchScamDetails = async () => {
    try {
      setIsLoading(true)

      // In a real app, this would be an actual API call
      // Simulate API response for scam details
      const mockScam = {
        id: Number.parseInt(params.id),
        type: "Phishing Email",
        title: "FNB Account Suspension",
        description:
          "I received an email claiming my FNB account was suspended due to suspicious activity. The email asked me to click a link and enter my personal details to verify my identity. The link led to a fake website that looked like FNB's login page.",
        date: "2023-05-15T14:30:00",
        status: "Verified",
        meToo: 12,
        reporter: {
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        location: "Windhoek, Namibia",
        evidence: [
          {
            type: "image",
            url: "/placeholder.svg?height=300&width=500&text=Phishing+Email+Screenshot",
            description: "Screenshot of phishing email",
          },
        ],
        details: {
          moneyInvolved: "No",
          whatWasScammed: "Personal banking information",
          policeCase: "N/A",
        },
        isVerified: true,
      }

      setScam(mockScam)
      setMeTooCount(mockScam.meToo)

      // Fetch actual comments from the API
      try {
        const commentsResponse = await fetch(`/api/scams/${params.id}/comments`)
        const commentsData = await commentsResponse.json()

        if (commentsData.success && commentsData.data) {
          // Transform API data to match our component's expected format
          const formattedComments = commentsData.data.map((comment) => ({
            id: comment.id,
            user: {
              name: comment.user_name,
              avatar: "/placeholder.svg?height=40&width=40&text=" + comment.user_name.charAt(0),
              isOfficial: comment.is_official,
            },
            text: comment.comment,
            date: formatRelativeTime(new Date(comment.created_at)),
          }))

          setComments(formattedComments)
        }
      } catch (commentError) {
        console.error("Error fetching comments:", commentError)
        // Don't fail the whole page if comments can't be loaded
        setComments([])
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching scam details:", error)
      setIsLoading(false)
    }
  }

  // Add this helper function to format dates
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 172800) return "Yesterday"

    return date.toLocaleDateString()
  }

  const handleMeTooClick = () => {
    if (hasClickedMeToo) {
      setMeTooCount(meTooCount - 1)
    } else {
      setMeTooCount(meTooCount + 1)
    }

    setHasClickedMeToo(!hasClickedMeToo)

    // In a real app, this would make an API call to update the count
    fetch(`/api/scams/${params.id}/me-too`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: 1 }), // In a real app, this would be the actual user ID
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error updating Me Too count:", error))
  }

  const handleCommentAdded = (newComment: any) => {
    // Add the new comment to the beginning of the comments array
    setComments([newComment, ...comments])
  }

  const handleDeleteComment = (commentId: number) => {
    // In a real app, this would make an API call to delete the comment
    // fetch(`/api/comments/${commentId}`, { method: 'DELETE' })

    setComments(comments.filter((comment) => comment.id !== commentId))
    toast({
      title: "Comment deleted",
      description: "Your comment has been removed.",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: scam?.title,
        text: `Check out this scam report: ${scam?.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "The link to this report has been copied to your clipboard.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
        <div className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    )
  }

  if (!scam) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Scam not found</h1>
        </div>
        <p>The scam report you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">Scam Report Details</h1>
      </div>

      <Card className="card-hover">
        <CardHeader className="relative">
          {scam.isVerified && (
            <motion.div
              className="absolute top-4 right-4 flag-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Flag className="h-6 w-6 text-red-500" />
            </motion.div>
          )}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <Badge
                variant={scam.status === "Verified" ? "default" : "outline"}
                className={scam.status === "Verified" ? "bg-primary hover:bg-primary/90" : ""}
              >
                {scam.status}
              </Badge>
              <CardTitle className="mt-2">{scam.title}</CardTitle>
              <CardDescription>{scam.type}</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${hasClickedMeToo ? "text-red-500 border-red-200" : ""}`}
                onClick={handleMeTooClick}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{meTooCount} Me Too</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{comments.length} Comments</span>
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            className="flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700">{scam.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Reported by</p>
                    <p className="font-medium">{scam.reporter.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date Reported</p>
                    <p className="font-medium">{new Date(scam.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{scam.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Money Involved</p>
                    <p className="font-medium">{scam.details.moneyInvolved}</p>
                  </div>
                </div>
              </div>
            </div>

            {scam.evidence.length > 0 && (
              <motion.div className="md:w-1/3" whileHover={{ scale: 1.02 }}>
                <h3 className="text-lg font-medium mb-2">Evidence</h3>
                <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={scam.evidence[0].url || "/placeholder.svg"}
                    alt={scam.evidence[0].description}
                    className="w-full h-auto"
                  />
                  <p className="text-sm text-gray-500 p-2">{scam.evidence[0].description}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="comments" className="flex-1">
                Comments ({comments.length})
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-1">
                Additional Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CommentForm scamId={scam.id} onCommentAdded={handleCommentAdded} />

                  <div className="space-y-4 mt-6">
                    <AnimatePresence>
                      {comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          className="bg-white rounded-xl p-4 shadow-sm card-hover"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{comment.user.name}</p>
                                  {comment.user.isOfficial && <Badge className="bg-primary">Official</Badge>}
                                </div>
                                <p className="text-xs text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {comment.date}
                                </p>
                              </div>
                            </div>
                            {comment.user.name === "You" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-red-500"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <p className="mt-2 text-gray-700">{comment.text}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <ScamDetailEnhancements
                    scamId={scam.id}
                    scamType={scam.type}
                    scamDescription={scam.description}
                    onCommentAdded={handleCommentAdded}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h4 className="font-medium mb-1">What Was Scammed</h4>
                    <p className="text-gray-700">{scam.details.whatWasScammed}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <h4 className="font-medium mb-1">Police Case Number</h4>
                    <p className="text-gray-700">{scam.details.policeCase}</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2">Safety Tip</h4>
                  <p className="text-sm text-blue-700">
                    Always verify the authenticity of emails claiming to be from your bank. Banks will never ask for
                    your full password or PIN via email or phone.
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} className="rounded-xl">
            Back to Dashboard
          </Button>
          <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl">
            Report Abuse
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
