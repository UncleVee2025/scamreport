import { NextResponse } from "next/server"
import { getAdvertisementById, updateAdvertisement, deleteAdvertisement } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const advertisement = await getAdvertisementById(id)

    if (!advertisement) {
      return NextResponse.json({ error: "Advertisement not found" }, { status: 404 })
    }

    return NextResponse.json({ advertisement })
  } catch (error) {
    console.error("Error fetching advertisement:", error)
    return NextResponse.json({ error: "Failed to fetch advertisement" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const data = await request.json()

    await updateAdvertisement(id, data)

    return NextResponse.json({ message: "Advertisement updated successfully" })
  } catch (error) {
    console.error("Error updating advertisement:", error)
    return NextResponse.json({ error: "Failed to update advertisement" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    await deleteAdvertisement(id)

    return NextResponse.json({ message: "Advertisement deleted successfully" })
  } catch (error) {
    console.error("Error deleting advertisement:", error)
    return NextResponse.json({ error: "Failed to delete advertisement" }, { status: 500 })
  }
}
