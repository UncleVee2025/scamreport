import { NextResponse } from "next/server"
import { getAdvertisementById, updateAdvertisement, deleteAdvertisement } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const adId = Number.parseInt(params.id)

    if (isNaN(adId)) {
      return NextResponse.json({ success: false, message: "Invalid advertisement ID" }, { status: 400 })
    }

    const advertisement = await getAdvertisementById(adId)

    if (!advertisement) {
      return NextResponse.json({ success: false, message: "Advertisement not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      advertisement,
    })
  } catch (error) {
    console.error("Error fetching advertisement:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch advertisement" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const adId = Number.parseInt(params.id)
    const data = await request.json()

    if (isNaN(adId)) {
      return NextResponse.json({ success: false, message: "Invalid advertisement ID" }, { status: 400 })
    }

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

    // Update advertisement
    await updateAdvertisement(adId, {
      title: data.title,
      description: data.description,
      sponsorName: data.sponsorName,
      ctaText: data.ctaText,
      ctaLink: data.ctaLink,
      discount: data.discount,
      discountDescription: data.discountDescription,
      imageUrl: data.imageUrl,
      startDate: data.startDate,
      endDate: data.endDate,
      packageDuration: data.packageDuration,
      advertiserEmail: data.advertiserEmail,
      isActive: data.isActive,
      recalculateEndDate: data.recalculateEndDate,
    })

    return NextResponse.json({
      success: true,
      message: "Advertisement updated successfully",
    })
  } catch (error) {
    console.error("Error updating advertisement:", error)
    return NextResponse.json({ success: false, message: "Failed to update advertisement" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const adId = Number.parseInt(params.id)

    if (isNaN(adId)) {
      return NextResponse.json({ success: false, message: "Invalid advertisement ID" }, { status: 400 })
    }

    // Delete advertisement
    await deleteAdvertisement(adId)

    return NextResponse.json({
      success: true,
      message: "Advertisement deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting advertisement:", error)
    return NextResponse.json({ success: false, message: "Failed to delete advertisement" }, { status: 500 })
  }
}
