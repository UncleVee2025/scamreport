"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserReputationBadge } from "@/components/user-reputation-badge"
import { UserPointsCard } from "@/components/user-points-card"
import { Bell, Shield, LogOut, User, Key, FileText, MessageSquare, TrendingUp, Upload } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)

  // Mock user data - in a real app, this would come from an API
  const [user, setUser] = useState({
    id: 1, // Assuming user ID 1 for demo
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "",
    location: "",
    avatar: "/avatar.png",
    reputationLevel: "trusted" as const,
    points: 320,
    level: 3,
    nextLevelPoints: 500,
    joinDate: "January 15, 2023",
  })

  // Mock recent activities
  const recentActivities = [
    {
      type: "report" as const,
      points: 50,
      description: "Reported a new scam",
      date: "2 days ago",
    },
    {
      type: "comment" as const,
      points: 10,
      description: "Left a helpful comment",
      date: "3 days ago",
    },
    {
      type: "me-too" as const,
      points: 5,
      description: "Confirmed experiencing a scam",
      date: "5 days ago",
    },
    {
      type: "verification" as const,
      points: 20,
      description: "Your report was verified",
      date: "1 week ago",
    },
    {
      type: "like" as const,
      points: 2,
      description: "Your comment was liked",
      date: "1 week ago",
    },
  ]

  // In a real app, fetch user profile on component mount
  useEffect(() => {
    // Simulating API call to get user profile
    const fetchUserProfile = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await fetch(`/api/user/profile?userId=${userId}`);
        // const data = await response.json();
        // if (data.success) {
        //   setUser({
        //     ...user,
        //     name: data.user.full_name,
        //     email: data.user.email,
        //     phone: data.user.phone || "",
        //     location: data.user.location || "",
        //   });
        // }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, this would be an actual API call
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          fullName: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        throw new Error(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
  }

  const handleImageUpload = async () => {
    if (!profileImage) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("userId", user.id.toString())
      formData.append("image", profileImage)

      // In a real app, this would be an actual API call
      const response = await fetch("/api/user/profile/image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUser((prev) => ({
          ...prev,
          avatar: data.imageUrl,
        }))
        toast({
          title: "Image Uploaded",
          description: "Your profile image has been updated successfully.",
        })
      } else {
        throw new Error(data.message || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      })

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout Failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="w-full md:w-1/3">
          <CardContent className="pt-6 text-center">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={profileImagePreview || user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <UserReputationBadge level={user.reputationLevel} size="lg" />
              </div>
            </div>

            <div className="mb-4">
              <label className="cursor-pointer block">
                <div className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
                  <Upload className="h-4 w-4" />
                  <span>Change Profile Picture</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {profileImage && (
                <Button size="sm" className="mt-2" onClick={handleImageUpload} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
              )}
            </div>

            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user.email}</p>

            <div className="flex justify-center gap-2 mb-4">
              <Button variant="outline" size="sm" className="flex gap-1 items-center">
                <User className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 items-center text-destructive"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoading ? "Logging out..." : "Logout"}</span>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">Member since {user.joinDate}</div>
          </CardContent>
        </Card>

        <div className="w-full md:w-2/3 space-y-6">
          <UserPointsCard
            points={user.points}
            level={user.level}
            nextLevelPoints={user.nextLevelPoints}
            recentActivities={recentActivities}
          />

          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={user.name} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" value={user.email} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={user.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={user.location}
                          onChange={handleInputChange}
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Key className="mr-2 h-4 w-4" />
                    Setup Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive email updates</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Comment Notifications</p>
                          <p className="text-sm text-muted-foreground">When someone comments on your report</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Report Status Updates</p>
                          <p className="text-sm text-muted-foreground">When your report status changes</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Me Too Notifications</p>
                          <p className="text-sm text-muted-foreground">When someone marks "Me Too" on your report</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
