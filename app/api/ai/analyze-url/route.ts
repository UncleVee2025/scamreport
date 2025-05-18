import { NextResponse } from "next/server"
import { analyzePotentialPhishingURL } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 })
    }

    const analysis = await analyzePotentialPhishingURL(url)

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error("Error analyzing URL:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze URL",
      },
      { status: 500 },
    )
  }
}
