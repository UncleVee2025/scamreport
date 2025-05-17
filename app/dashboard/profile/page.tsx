"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Camera, Lock, Mail, Phone, User, Shield, LogOut, FileImage } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+264 81 123 4567",
    bio: "I'm passionate about fighting cybercrime and helping others stay safe online.",
    location: "Windhoek, Namibia",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      showProfile: true,
      showActivity: true,
    },
    security: {
      twoFactor: false,
    },
  })

  useEffect(() => {
    // Simulate fetching user data
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfileImage = () => {
    if (tempProfileImage) {
      setProfileImage(tempProfileImage)
      setTempProfileImage(null)
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      })
    }
  }

  const handleCancelProfileImage = () => {
    setTempProfileImage(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleToggleChange = (name: string, checked: boolean) => {
    const [category, setting] = name.split(".")
    setUserData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: checked,
      },
    }))
  }

  const handleSaveProfile = () => {
    setIsSaving(true)
    // Simulate API call to save profile
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    }, 1000)
  }

  const handleChangePassword = () => {
    // In a real app, this would open a modal or navigate to a password change page
    toast({
      title: "Change password",
      description: "Password change functionality would open here.",
    })
  }

  const handleLogout = () => {
    // In a real app, this would clear the auth state and redirect to login
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">My Profile</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-1 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={tempProfileImage || profileImage || "/placeholder.svg?height=128&width=128"}
                    alt="Profile"
                  />
                  <AvatarFallback className="text-3xl">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                </label>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </div>

              {tempProfileImage && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleSaveProfileImage}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelProfileImage}>
                    Cancel
                  </Button>
                </div>
              )}

              <div className="w-full mt-6">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Name</span>
                  </div>
                  <span className="text-sm">{userData.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <span className="text-sm">{userData.phone}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm font-medium">Password</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary" onClick={handleChangePassword}>
                    Change
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account Verified</p>
                      <p className="text-xs text-gray-500">Your account is verified</p>
                    </div>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Profile Complete</p>
                      <p className="text-xs text-gray-500">Your profile is complete</p>
                    </div>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Link href="/dashboard/logo-guide">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <FileImage className="h-4 w-4" />
              Logo Upload Guide
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security & Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={userData.location}
                        onChange={handleInputChange}
                        className="bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="bg-white"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive email notifications about scam reports and updates
                        </p>
                      </div>
                      <Switch
                        checked={userData.notifications.email}
                        onCheckedChange={(checked) => handleToggleChange("notifications.email", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                      </div>
                      <Switch
                        checked={userData.notifications.push}
                        onCheckedChange={(checked) => handleToggleChange("notifications.push", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive text messages for important alerts</p>
                      </div>
                      <Switch
                        checked={userData.notifications.sms}
                        onCheckedChange={(checked) => handleToggleChange("notifications.sms", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                  <CardDescription>Manage your security settings and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={userData.security.twoFactor}
                        onCheckedChange={(checked) => handleToggleChange("security.twoFactor", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Profile to Others</Label>
                        <p className="text-sm text-gray-500">Allow other users to see your profile information</p>
                      </div>
                      <Switch
                        checked={userData.privacy.showProfile}
                        onCheckedChange={(checked) => handleToggleChange("privacy.showProfile", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Activity</Label>
                        <p className="text-sm text-gray-500">Allow others to see your reports and comments</p>
                      </div>
                      <Switch
                        checked={userData.privacy.showActivity}
                        onCheckedChange={(checked) => handleToggleChange("privacy.showActivity", checked)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        toast({
                          title: "Delete account",
                          description: "Account deletion functionality would open here.",
                        })
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
