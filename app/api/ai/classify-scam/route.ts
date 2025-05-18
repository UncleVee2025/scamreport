import { NextResponse } from "next/server"
import { classifyScam, generateSafetyTips } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const { description } = await request.json()

    if (!description) {
      return NextResponse.json({ success: false, message: "Description is required" }, { status: 400 })
    }

    const category = await classifyScam(description)
    const safetyTips = await generateSafetyTips(category, description)

    return NextResponse.json({
      success: true,
      data: {
        category,
        safetyTips,
      },
    })
  } catch (error) {
    console.error("Error classifying scam:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to classify scam",
      },
      { status: 500 },
    )
  }
}
