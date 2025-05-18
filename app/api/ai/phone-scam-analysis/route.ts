import { NextResponse } from "next/server"
import { analyzePhoneScamRisk } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const { transcription } = await request.json()

    if (!transcription) {
      return NextResponse.json({ success: false, message: "Call transcription is required" }, { status: 400 })
    }

    const analysis = await analyzePhoneScamRisk(transcription)

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error("Error analyzing call:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze call",
      },
      { status: 500 },
    )
  }
}
