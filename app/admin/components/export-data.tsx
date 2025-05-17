"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function ExportData() {
  const [exportType, setExportType] = useState("scams")
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async () => {
    try {
      setIsLoading(true)

      // Determine which endpoint to call based on export type
      let endpoint = ""
      switch (exportType) {
        case "scams":
          endpoint = "/api/admin/export/scams"
          break
        case "users":
          endpoint = "/api/admin/export/users"
          break
        case "me-too":
          endpoint = "/api/admin/export/me-too"
          break
        case "comments":
          endpoint = "/api/admin/export/comments"
          break
        default:
          endpoint = "/api/admin/export/scams"
      }

      // Call the API
      const response = await fetch(endpoint)
      const data = await response.json()

      if (data.success) {
        // Create a link element and trigger download
        const link = document.createElement("a")
        link.href = data.data
        link.download = `${exportType}-report-${new Date().toISOString().split("T")[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Export Successful",
          description: `${exportType.charAt(0).toUpperCase() + exportType.slice(1)} data has been exported successfully.`,
          variant: "default",
        })
      } else {
        throw new Error(data.error || "Export failed")
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Export system data as PDF reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Data to Export</label>
          <Select value={exportType} onValueChange={setExportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scams">Scam Reports</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="me-too">Me Too Data</SelectItem>
              <SelectItem value="comments">Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleExport} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Export {exportType.charAt(0).toUpperCase() + exportType.slice(1)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
