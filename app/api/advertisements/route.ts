import { NextResponse } from "next/server"
import { getActiveAdvertisements } from "@/lib/db"

export async function GET() {
  try {
    const advertisements = await getActiveAdvertisements()
    return NextResponse.json({ advertisements })
  } catch (error) {
    console.error("Error fetching active advertisements:", error)
    return NextResponse.json({ error: "Failed to fetch advertisements" }, { status: 500 })
  }
}
