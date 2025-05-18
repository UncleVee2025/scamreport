import { NextResponse } from "next/server"
import { analyzeSentiment } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ success: false, message: "Comment text is required" }, { status: 400 })
    }

    const analysis = await analyzeSentiment(text)

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error("Error analyzing comment:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze comment",
      },
      { status: 500 },
    )
  }
}
