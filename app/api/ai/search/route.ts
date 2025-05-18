import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { openai } from "@/lib/ai-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Get all scams from the database
    const scams = await db.query(`
      SELECT * FROM scam_reports 
      WHERE status = 'verified' 
      ORDER BY created_at DESC
      LIMIT 100
    `)

    if (!scams || scams.length === 0) {
      return NextResponse.json({ scams: [] })
    }

    // Use OpenAI to find semantically similar scams
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a scam detection assistant. Your task is to analyze a list of scam reports and identify which ones are semantically similar to a user's search query. 
          Return ONLY the IDs of the most relevant scams as a JSON array of numbers, like [1, 5, 10]. 
          Return a maximum of 10 matches. If there are no relevant matches, return an empty array.`,
        },
        {
          role: "user",
          content: `Search query: "${query}"
          
          Scam reports:
          ${scams.map((scam) => `ID: ${scam.id}, Title: ${scam.title}, Description: ${scam.description}, Type: ${scam.type}`).join("\n\n")}`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const responseContent = completion.choices[0].message.content
    let relevantIds = []

    try {
      const parsedResponse = JSON.parse(responseContent)
      relevantIds = parsedResponse.ids || []
    } catch (error) {
      console.error("Error parsing OpenAI response:", error)
    }

    if (relevantIds.length === 0) {
      return NextResponse.json({ scams: [] })
    }

    // Get the relevant scams from the database
    const relevantScams = scams.filter((scam) => relevantIds.includes(scam.id))

    return NextResponse.json({ scams: relevantScams })
  } catch (error) {
    console.error("AI search error:", error)
    return NextResponse.json({ error: "An error occurred during search" }, { status: 500 })
  }
}
