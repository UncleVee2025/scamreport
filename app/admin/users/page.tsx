"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, UserPlus, Mail, Lock, MoreHorizontal, Shield, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "user",
      status: "active",
      reports: 5,
      comments: 12,
      joined: "2023-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@example.com",
      role: "user",
      status: "active",
      reports: 3,
      comments: 8,
      joined: "2023-02-20",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "admin",
      status: "active",
      reports: 0,
      comments: 5,
      joined: "2023-01-05",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Lisa Johnson",
      email: "lisa.johnson@example.com",
      role: "user",
      status: "inactive",
      reports: 2,
      comments: 4,
      joined: "2023-03-10",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "David Williams",
      email: "david.williams@example.com",
      role: "user",
      status: "active",
      reports: 7,
      comments: 15,
      joined: "2023-02-05",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            <span className="text-base">Add User</span>
          </Button>
          <Button variant="outline" className="border-2 border-gray-300 bg-white text-gray-800">
            <Download className="mr-2 h-4 w-4" />
            <span className="text-base">Export Users</span>
          </Button>
        </div>
      </div>

      <Card className="border-2 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle>Search Users</CardTitle>
          <CardDescription>Find users by name or email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 border-2 border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 border-2 border-gray-200 p-1 bg-white">
          <TabsTrigger
            value="all"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            All Users
          </TabsTrigger>
          <TabsTrigger
            value="admins"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Admins
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="text-base py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Inactive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Showing {filteredUsers.length} users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border-2 border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-200">
                        <th className="py-3 px-4 text-left font-medium text-gray-700">User</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Role</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Status</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Reports</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Joined</th>
                        <th className="py-3 px-4 text-right font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={`${user.role === "admin" ? "bg-blue-600" : "bg-gray-600"} text-white border-0`}
                            >
                              {user.role === "admin" ? (
                                <Shield className="mr-1 h-3 w-3" />
                              ) : (
                                <User className="mr-1 h-3 w-3" />
                              )}
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={`${
                                user.status === "active" ? "bg-green-600" : "bg-red-600"
                              } text-white border-0`}
                            >
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{user.reports}</td>
                          <td className="py-3 px-4">{user.joined}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700"
                              >
                                <Mail className="h-4 w-4" />
                                <span className="ml-1">Email</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-2 border-gray-300 bg-white text-gray-800"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="border-2 border-gray-200">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Lock className="mr-2 h-4 w-4" />
                                    Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer text-red-600">
                                    Deactivate Account
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Users with administrative privileges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border-2 border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-200">
                        <th className="py-3 px-4 text-left font-medium text-gray-700">User</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Role</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Status</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Reports</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Joined</th>
                        <th className="py-3 px-4 text-right font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers
                        .filter((user) => user.role === "admin")
                        .map((user) => (
                          <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-800">{user.name}</p>
                                  <p className="text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className="bg-blue-600 text-white border-0">
                                <Shield className="mr-1 h-3 w-3" />
                                Admin
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={`${
                                  user.status === "active" ? "bg-green-600" : "bg-red-600"
                                } text-white border-0`}
                              >
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{user.reports}</td>
                            <td className="py-3 px-4">{user.joined}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  className="bg-blue-600 text-white border-2 border-blue-700 hover:bg-blue-700"
                                >
                                  <Mail className="h-4 w-4" />
                                  <span className="ml-1">Email</span>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-2 border-gray-300 bg-white text-gray-800"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="border-2 border-gray-200">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                      <User className="mr-2 h-4 w-4" />
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                      <Lock className="mr-2 h-4 w-4" />
                                      Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer text-red-600">
                                      Remove Admin Rights
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-0">
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle>Inactive Users</CardTitle>
              <CardDescription>Deactivated or suspended accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border-2 border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-200">
                        <th className="py-3 px-4 text-left font-medium text-gray-700">User</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Role</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Status</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Reports</th>
                        <th className="py-3 px-4 text-left font-medium text-gray-700">Joined</th>
                        <th className="py-3 px-4 text-right font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers
                        .filter((user) => user.status === "inactive")
                        .map((user) => (
                          <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-gray-800">{user.name}</p>
                                  <p className="text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={`${
                                  user.role === "admin" ? "bg-blue-600" : "bg-gray-600"
                                } text-white border-0`}
                              >
                                {user.role === "admin" ? (
                                  <Shield className="mr-1 h-3 w-3" />
                                ) : (
                                  <User className="mr-1 h-3 w-3" />
                                )}
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className="bg-red-600 text-white border-0">Inactive</Badge>
                            </td>
                            <td className="py-3 px-4">{user.reports}</td>
                            <td className="py-3 px-4">{user.joined}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 text-white border-2 border-green-700 hover:bg-green-700"
                                >
                                  <span className="text-base">Reactivate</span>
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-2 border-gray-300 bg-white text-gray-800"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="border-2 border-gray-200">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer">
                                      <User className="mr-2 h-4 w-4" />
                                      View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                      <Mail className="mr-2 h-4 w-4" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer text-red-600">
                                      Delete Account
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
