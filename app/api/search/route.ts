import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchType = searchParams.get("type") || "phone"
    const searchQuery = searchParams.get("query") || ""

    // Validate search query
    if (!searchQuery.trim()) {
      return NextResponse.json({ success: false, message: "Search query is required" }, { status: 400 })
    }

    // Demo data for testing - these will always return as "reported"
    const demoData = {
      phone: ["081234567", "0812345678", "0811234567"],
      email: ["scammer@example.com", "fake@scam.com", "suspicious@test.com"],
      name: ["John Scammer", "Fake Person", "Suspicious Individual"],
    }

    // Check if the query matches any demo data
    if (
      demoData[searchType as keyof typeof demoData].some(
        (item) =>
          searchQuery.toLowerCase().includes(item.toLowerCase()) ||
          item.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    ) {
      // Return mock data for demo purposes
      return NextResponse.json({
        success: true,
        message: "Search result found",
        data: {
          reportCount: Math.floor(Math.random() * 5) + 1,
          category: ["Financial Fraud", "Identity Theft", "Phishing", "Romance Scam"][Math.floor(Math.random() * 4)],
          lastReported: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
          ).toLocaleDateString(),
          status: ["Verified", "Under Review", "Confirmed"][Math.floor(Math.random() * 3)],
        },
      })
    }

    // In a real implementation, we would search the database
    // For now, we'll return a "not found" response for anything not in our demo data
    return NextResponse.json({
      success: false,
      message: "No reports found for this search query",
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during search" }, { status: 500 })
  }
}
