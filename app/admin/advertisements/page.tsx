"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addMonths } from "date-fns"
import { CalendarIcon, Plus, Pencil, Trash2, AlertCircle, Mail } from "lucide-react"
import type { Advertisement } from "@/lib/models/advertisement"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdvertisementsPage() {
  const router = useRouter()
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAd, setCurrentAd] = useState<Partial<Advertisement> | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [packageDuration, setPackageDuration] = useState<string>("3months")
  const [activeTab, setActiveTab] = useState("active")

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const fetchAdvertisements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/advertisements")
      const data = await response.json()

      if (data.advertisements) {
        setAdvertisements(data.advertisements)
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error)
      toast({
        title: "Error",
        description: "Failed to load advertisements",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrUpdate = async () => {
    if (!currentAd || !startDate) return

    try {
      // Calculate end date based on package duration
      let endDate = new Date(startDate)

      switch (packageDuration) {
        case "3months":
          endDate = addMonths(startDate, 3)
          break
        case "6months":
          endDate = addMonths(startDate, 6)
          break
        case "9months":
          endDate = addMonths(startDate, 9)
          break
        case "12months":
          endDate = addMonths(startDate, 12)
          break
      }

      const adData = {
        ...currentAd,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        packageDuration,
        isActive: currentAd.isActive ?? true,
        recalculateEndDate: true,
      }

      let response

      if (isEditing && currentAd.id) {
        response = await fetch(`/api/admin/advertisements/${currentAd.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adData),
        })
      } else {
        response = await fetch("/api/admin/advertisements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adData),
        })
      }

      if (!response.ok) {
        throw new Error("Failed to save advertisement")
      }

      toast({
        title: isEditing ? "Advertisement Updated" : "Advertisement Created",
        description: isEditing
          ? "The advertisement has been updated successfully"
          : "New advertisement has been created successfully",
      })

      setIsDialogOpen(false)
      fetchAdvertisements()
    } catch (error) {
      console.error("Error saving advertisement:", error)
      toast({
        title: "Error",
        description: "Failed to save advertisement",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/advertisements/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete advertisement")
      }

      toast({
        title: "Advertisement Deleted",
        description: "The advertisement has been deleted successfully",
      })

      fetchAdvertisements()
    } catch (error) {
      console.error("Error deleting advertisement:", error)
      toast({
        title: "Error",
        description: "Failed to delete advertisement",
        variant: "destructive",
      })
    }
  }

  const openCreateDialog = () => {
    setCurrentAd({
      title: "",
      description: "",
      sponsorName: "",
      ctaText: "Learn More",
      ctaLink: "",
      advertiserEmail: "",
      isActive: true,
    })
    setStartDate(new Date())
    setPackageDuration("3months")
    setIsEditing(false)
    setIsDialogOpen(true)
  }

  const openEditDialog = (ad: Advertisement) => {
    setCurrentAd({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      sponsorName: ad.sponsor_name,
      ctaText: ad.cta_text,
      ctaLink: ad.cta_link,
      discount: ad.discount,
      discountDescription: ad.discount_description,
      imageUrl: ad.image_url,
      advertiserEmail: ad.advertiser_email,
      isActive: ad.is_active === 1,
    })
    setStartDate(new Date(ad.start_date))
    setPackageDuration(ad.package_duration)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  const isActive = (ad: Advertisement) => {
    const now = new Date()
    const start = new Date(ad.start_date)
    const end = new Date(ad.end_date)
    return ad.is_active === 1 && now >= start && now <= end
  }

  const sendManualReminder = async (ad: Advertisement) => {
    try {
      const response = await fetch(`/api/admin/advertisements/${ad.id}/send-reminder`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to send reminder")
      }

      toast({
        title: "Reminder Sent",
        description: `A reminder email has been sent to ${ad.advertiser_email}`,
      })
    } catch (error) {
      console.error("Error sending reminder:", error)
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      })
    }
  }

  const filteredAds = advertisements.filter((ad) => {
    if (activeTab === "active") return isActive(ad)
    if (activeTab === "expired") return !isActive(ad)
    return true // All tab
  })

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Advertisement Management</h1>
          <p className="text-gray-500">Create and manage advertisements for the platform</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
          onClick={openCreateDialog}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Advertisement
        </Button>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="active" className="text-sm md:text-base py-2">
            Active
          </TabsTrigger>
          <TabsTrigger value="expired" className="text-sm md:text-base py-2">
            Expired
          </TabsTrigger>
          <TabsTrigger value="all" className="text-sm md:text-base py-2">
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "active"
                  ? "Active Advertisements"
                  : activeTab === "expired"
                    ? "Expired Advertisements"
                    : "All Advertisements"}
              </CardTitle>
              <CardDescription>
                {activeTab === "active"
                  ? "Currently running advertisements"
                  : activeTab === "expired"
                    ? "Past advertisements that are no longer active"
                    : "Manage your platform advertisements"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : filteredAds.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No advertisements found</h3>
                  <p className="mt-1 text-gray-500">
                    {activeTab === "active"
                      ? "No active advertisements at the moment."
                      : activeTab === "expired"
                        ? "No expired advertisements found."
                        : "Get started by creating a new advertisement."}
                  </p>
                  <Button
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
                    onClick={openCreateDialog}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Advertisement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAds.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden border-2 border-gray-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-2/3 p-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold">{ad.title}</h3>
                              <Badge
                                variant={isActive(ad) ? "default" : "outline"}
                                className={isActive(ad) ? "bg-green-600 text-white" : ""}
                              >
                                {isActive(ad) ? "Active" : "Expired"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Sponsor: {ad.sponsor_name}</p>
                            <p className="text-sm text-gray-500 mb-2">Email: {ad.advertiser_email}</p>
                            <p className="text-sm mb-4">{ad.description}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">Package: {ad.package_duration}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                Start: {format(new Date(ad.start_date), "MMM dd, yyyy")}
                              </span>
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                End: {format(new Date(ad.end_date), "MMM dd, yyyy")}
                              </span>
                              {isActive(ad) && (
                                <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  {getDaysRemaining(ad.end_date)} days remaining
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-full md:w-1/3 bg-gray-100 p-4 flex flex-col justify-center items-center">
                            <div className="flex space-x-2 mb-4">
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                onClick={() => openEditDialog(ad)}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the advertisement.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                      onClick={() => handleDelete(ad.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            {isActive(ad) && (
                              <Button
                                size="sm"
                                className="mb-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
                                onClick={() => sendManualReminder(ad)}
                              >
                                <Mail className="h-4 w-4 mr-1" />
                                Send Reminder
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 hover:underline bg-transparent"
                              onClick={() => window.open(ad.cta_link, "_blank")}
                            >
                              Preview Link
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Advertisement" : "Create New Advertisement"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the advertisement details below"
                : "Fill in the details to create a new advertisement"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={currentAd?.title || ""}
                  onChange={(e) => setCurrentAd({ ...currentAd, title: e.target.value })}
                  placeholder="Advertisement Title"
                  className="border-2 border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={currentAd?.description || ""}
                  onChange={(e) => setCurrentAd({ ...currentAd, description: e.target.value })}
                  placeholder="Advertisement Description"
                  rows={3}
                  className="border-2 border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsorName" className="text-sm font-medium">
                  Sponsor Name
                </Label>
                <Input
                  id="sponsorName"
                  value={currentAd?.sponsorName || ""}
                  onChange={(e) => setCurrentAd({ ...currentAd, sponsorName: e.target.value })}
                  placeholder="Sponsor Name"
                  className="border-2 border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="advertiserEmail" className="text-sm font-medium">
                  Advertiser Email
                </Label>
                <Input
                  id="advertiserEmail"
                  type="email"
                  value={currentAd?.advertiserEmail || ""}
                  onChange={(e) => setCurrentAd({ ...currentAd, advertiserEmail: e.target.value })}
                  placeholder="advertiser@example.com"
                  className="border-2 border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaText" className="text-sm font-medium">
                    CTA Button Text
                  </Label>
                  <Input
                    id="ctaText"
                    value={currentAd?.ctaText || ""}
                    onChange={(e) => setCurrentAd({ ...currentAd, ctaText: e.target.value })}
                    placeholder="Learn More"
                    className="border-2 border-gray-300 rounded-md p-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ctaLink" className="text-sm font-medium">
                    CTA Link URL
                  </Label>
                  <Input
                    id="ctaLink"
                    value={currentAd?.ctaLink || ""}
                    onChange={(e) => setCurrentAd({ ...currentAd, ctaLink: e.target.value })}
                    placeholder="https://example.com"
                    className="border-2 border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-sm font-medium">
                    Discount (Optional)
                  </Label>
                  <Input
                    id="discount"
                    value={currentAd?.discount || ""}
                    onChange={(e) => setCurrentAd({ ...currentAd, discount: e.target.value })}
                    placeholder="50% OFF"
                    className="border-2 border-gray-300 rounded-md p-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountDescription" className="text-sm font-medium">
                    Discount Description
                  </Label>
                  <Input
                    id="discountDescription"
                    value={currentAd?.discountDescription || ""}
                    onChange={(e) => setCurrentAd({ ...currentAd, discountDescription: e.target.value })}
                    placeholder="For new users"
                    className="border-2 border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-sm font-medium">
                  Image URL (Optional)
                </Label>
                <Input
                  id="imageUrl"
                  value={currentAd?.imageUrl || ""}
                  onChange={(e) => setCurrentAd({ ...currentAd, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="border-2 border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-2 border-gray-300"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Package Duration</Label>
                  <Select value={packageDuration} onValueChange={setPackageDuration}>
                    <SelectTrigger className="border-2 border-gray-300">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="9months">9 Months</SelectItem>
                      <SelectItem value="12months">12 Months (1 Year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="isActive"
                  checked={currentAd?.isActive}
                  onCheckedChange={(checked) => setCurrentAd({ ...currentAd, isActive: checked })}
                />
                <Label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOrUpdate} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isEditing ? "Update Advertisement" : "Create Advertisement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
