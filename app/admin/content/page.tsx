"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Plus,
  Save,
  Trash2,
  Eye,
  Edit,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
  BookOpen,
  FileQuestion,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ContentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [contents, setContents] = useState([])
  const [editingContent, setEditingContent] = useState(null)

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setContents([
        {
          id: 1,
          title: "About ScamReport Namibia",
          type: "page",
          slug: "about",
          content:
            "ScamReport Namibia is a platform dedicated to helping Namibians identify, report, and avoid scams. Our mission is to create a safer digital environment for all citizens by providing a centralized database of reported scams and educational resources.",
          status: "published",
          lastUpdated: "2023-05-15T14:30:00",
          author: "Admin",
        },
        {
          id: 2,
          title: "How to Identify Phishing Emails",
          type: "guide",
          slug: "identify-phishing-emails",
          content:
            "Phishing emails often appear to come from legitimate organizations but contain suspicious links or attachments. Look for poor grammar, generic greetings, urgent requests for personal information, and mismatched email domains. Always verify the sender before clicking any links or providing information.",
          status: "published",
          lastUpdated: "2023-05-10T09:15:00",
          author: "Admin",
        },
        {
          id: 3,
          title: "Terms and Conditions",
          type: "legal",
          slug: "terms",
          content:
            "By using ScamReport Namibia, you agree to our terms and conditions. This includes guidelines for reporting scams, commenting on reports, and using the platform responsibly. We reserve the right to remove content that violates our community standards.",
          status: "published",
          lastUpdated: "2023-04-20T11:45:00",
          author: "Legal Team",
        },
        {
          id: 4,
          title: "Privacy Policy",
          type: "legal",
          slug: "privacy",
          content:
            "ScamReport Namibia is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information. We only collect data necessary for the functioning of the platform and do not share it with third parties without your consent.",
          status: "published",
          lastUpdated: "2023-04-20T12:30:00",
          author: "Legal Team",
        },
        {
          id: 5,
          title: "Investment Scam Warning",
          type: "alert",
          slug: "investment-scam-warning",
          content:
            "We've noticed an increase in investment scams targeting Namibians. These scams promise high returns with little or no risk, often involving cryptocurrency or foreign exchange trading. Always research investment opportunities thoroughly and consult with financial professionals before investing.",
          status: "published",
          lastUpdated: "2023-05-05T10:00:00",
          author: "Admin",
        },
        {
          id: 6,
          title: "Reporting Guidelines",
          type: "guide",
          slug: "reporting-guidelines",
          content:
            "When reporting a scam, provide as much detail as possible, including the type of scam, how you were contacted, what information was requested, and any red flags you noticed. This helps others identify similar scams and protects the community.",
          status: "draft",
          lastUpdated: "2023-05-08T15:20:00",
          author: "Content Team",
        },
        {
          id: 7,
          title: "Frequently Asked Questions",
          type: "faq",
          slug: "faq",
          content:
            "Find answers to common questions about using ScamReport Namibia, reporting scams, and protecting yourself from fraud. If you don't see your question answered here, please contact our support team.",
          status: "published",
          lastUpdated: "2023-04-25T09:30:00",
          author: "Support Team",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter contents based on search query and type filter
  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.slug.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || content.type === filterType

    return matchesSearch && matchesType
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "page":
        return <FileText className="h-4 w-4" />
      case "guide":
        return <BookOpen className="h-4 w-4" />
      case "legal":
        return <FileText className="h-4 w-4" />
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      case "faq":
        return <HelpCircle className="h-4 w-4" />
      default:
        return <FileQuestion className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-600 text-white border-0">Published</Badge>
      case "draft":
        return <Badge className="bg-amber-500 text-white border-0">Draft</Badge>
      case "archived":
        return <Badge className="bg-gray-600 text-white border-0">Archived</Badge>
      default:
        return <Badge className="bg-blue-600 text-white border-0">{status}</Badge>
    }
  }

  const handleEdit = (content) => {
    setEditingContent({ ...content })
  }

  const handleSave = () => {
    if (editingContent.id) {
      // Update existing content
      setContents(contents.map((content) => (content.id === editingContent.id ? { ...editingContent } : content)))
    } else {
      // Add new content
      setContents([
        ...contents,
        {
          ...editingContent,
          id: contents.length + 1,
          lastUpdated: new Date().toISOString(),
          author: "Admin",
        },
      ])
    }
    setEditingContent(null)
  }

  const handleDelete = (id) => {
    setContents(contents.filter((content) => content.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
          <p className="text-gray-500">Manage website content, guides, and legal documents</p>
        </div>
        <Button
          className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700"
          onClick={() =>
            setEditingContent({
              id: null,
              title: "",
              type: "page",
              slug: "",
              content: "",
              status: "draft",
              lastUpdated: new Date().toISOString(),
              author: "Admin",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="text-base">Add New Content</span>
        </Button>
      </div>

      {editingContent ? (
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle>{editingContent.id ? "Edit Content" : "Add New Content"}</CardTitle>
            <CardDescription>
              {editingContent.id ? "Update existing content" : "Create new content for the website"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingContent.title}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                  className="border-2 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={editingContent.slug}
                  onChange={(e) => setEditingContent({ ...editingContent, slug: e.target.value })}
                  className="border-2 border-gray-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Content Type</Label>
                <Select
                  value={editingContent.type}
                  onValueChange={(value) => setEditingContent({ ...editingContent, type: value })}
                >
                  <SelectTrigger id="type" className="border-2 border-gray-300">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Page</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="legal">Legal Document</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingContent.status}
                  onValueChange={(value) => setEditingContent({ ...editingContent, status: value })}
                >
                  <SelectTrigger id="status" className="border-2 border-gray-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={editingContent.content}
                onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                className="min-h-[200px] border-2 border-gray-300"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-2 border-gray-300 text-gray-700"
              onClick={() => setEditingContent(null)}
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              <span className="text-base">Save Content</span>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="border-2 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle>Filter Content</CardTitle>
              <CardDescription>Search and filter website content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by title, content, or slug"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 py-6 border-2 border-gray-300"
                    />
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="border-2 border-gray-300 py-6">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4 text-gray-500" />
                        <span>
                          Type:{" "}
                          {filterType === "all" ? "All" : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="page">Pages</SelectItem>
                      <SelectItem value="guide">Guides</SelectItem>
                      <SelectItem value="legal">Legal Documents</SelectItem>
                      <SelectItem value="alert">Alerts</SelectItem>
                      <SelectItem value="faq">FAQs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 border-2 border-gray-200 p-1 bg-white">
              <TabsTrigger
                value="all"
                className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                All Content
              </TabsTrigger>
              <TabsTrigger
                value="published"
                className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Published
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Drafts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle>All Content</CardTitle>
                  <CardDescription>Showing {filteredContents.length} content items</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
                      ))}
                    </div>
                  ) : filteredContents.length === 0 ? (
                    <div className="text-center py-10">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium">No content found</h3>
                      <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredContents.map((content) => (
                        <Card key={content.id} className="overflow-hidden border-2 border-gray-200">
                          <CardContent className="p-0">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                  {getTypeIcon(content.type)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">{content.title}</div>
                                  <div className="text-xs text-gray-500">/{content.slug}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(content.status)}
                                <div className="text-xs text-gray-500">Updated: {formatDate(content.lastUpdated)}</div>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-gray-800 line-clamp-2">{content.content}</p>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Info className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>Type: {content.type.charAt(0).toUpperCase() + content.type.slice(1)}</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>Author: {content.author}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-gray-300 text-gray-700"
                                onClick={() => window.open(`/${content.slug}`, "_blank")}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                <span className="text-sm">View</span>
                              </Button>
                              <Button
                                size="sm"
                                className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700"
                                onClick={() => handleEdit(content)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                <span className="text-sm">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 text-white border-2 border-red-700 hover:bg-red-700"
                                onClick={() => handleDelete(content.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span className="text-sm">Delete</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="published" className="mt-0">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle>Published Content</CardTitle>
                  <CardDescription>Content currently visible to users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredContents
                      .filter((content) => content.status === "published")
                      .map((content) => (
                        <Card key={content.id} className="overflow-hidden border-2 border-gray-200">
                          <CardContent className="p-0">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                  {getTypeIcon(content.type)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">{content.title}</div>
                                  <div className="text-xs text-gray-500">/{content.slug}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-600 text-white border-0">Published</Badge>
                                <div className="text-xs text-gray-500">Updated: {formatDate(content.lastUpdated)}</div>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-gray-800 line-clamp-2">{content.content}</p>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Info className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>Type: {content.type.charAt(0).toUpperCase() + content.type.slice(1)}</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>Author: {content.author}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-2 border-gray-300 text-gray-700"
                                onClick={() => window.open(`/${content.slug}`, "_blank")}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                <span className="text-sm">View</span>
                              </Button>
                              <Button
                                size="sm"
                                className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700"
                                onClick={() => handleEdit(content)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                <span className="text-sm">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 text-white border-2 border-red-700 hover:bg-red-700"
                                onClick={() => handleDelete(content.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span className="text-sm">Delete</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="draft" className="mt-0">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle>Draft Content</CardTitle>
                  <CardDescription>Content in progress, not visible to users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredContents
                      .filter((content) => content.status === "draft")
                      .map((content) => (
                        <Card key={content.id} className="overflow-hidden border-2 border-gray-200">
                          <CardContent className="p-0">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                  {getTypeIcon(content.type)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">{content.title}</div>
                                  <div className="text-xs text-gray-500">/{content.slug}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-amber-500 text-white border-0">Draft</Badge>
                                <div className="text-xs text-gray-500">Updated: {formatDate(content.lastUpdated)}</div>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-gray-800 line-clamp-2">{content.content}</p>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Info className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>Type: {content.type.charAt(0).toUpperCase() + content.type.slice(1)}</span>
                                </div>
                                <div className="flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>Author: {content.author}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700"
                                onClick={() => handleEdit(content)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                <span className="text-sm">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 text-white border-2 border-green-700 hover:bg-green-700"
                                onClick={() => {
                                  setContents(
                                    contents.map((c) => (c.id === content.id ? { ...c, status: "published" } : c)),
                                  )
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span className="text-sm">Publish</span>
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 text-white border-2 border-red-700 hover:bg-red-700"
                                onClick={() => handleDelete(content.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span className="text-sm">Delete</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
