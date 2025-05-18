import { NextResponse } from "next/server"
import { getAllAdvertisements, createAdvertisement, deactivateExpiredAdvertisements } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Automatically deactivate expired advertisements
    await deactivateExpiredAdvertisements()

    // Get all advertisements
    const advertisements = await getAllAdvertisements()

    return NextResponse.json({
      success: true,
      advertisements,
    })
  } catch (error) {
    console.error("Error fetching advertisements:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch advertisements" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (
      !data.title ||
      !data.description ||
      !data.sponsorName ||
      !data.ctaText ||
      !data.ctaLink ||
      !data.advertiserEmail
    ) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Create advertisement
    const result = await createAdvertisement({
      title: data.title,
      description: data.description,
      sponsorName: data.sponsorName,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
      discount: data.discount,
      discountDescription: data.discountDescription,
      imageUrl: data.imageUrl,
      startDate: data.startDate,
      packageDuration: data.packageDuration,
      advertiserEmail: data.advertiserEmail,
      isActive: data.isActive !== undefined ? data.isActive : true,
    })

    return NextResponse.json({
      success: true,
      message: "Advertisement created successfully",
      advertisement: { id: result.insertId },
    })
  } catch (error) {
    console.error("Error creating advertisement:", error)
    return NextResponse.json({ success: false, message: "Failed to create advertisement" }, { status: 500 })
  }
}
