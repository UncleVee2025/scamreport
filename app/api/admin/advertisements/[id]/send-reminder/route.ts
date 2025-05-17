import { NextResponse } from "next/server"
import { getAdvertisementById } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { format, differenceInDays } from "date-fns"

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    const endDate = new Date(advertisement.end_date)
    const today = new Date()
    const daysRemaining = differenceInDays(endDate, today)

    // Send reminder email
    await sendEmail({
      to: advertisement.advertiser_email,
      subject: `Your advertisement will expire in ${daysRemaining} days`,
      text: `
        Dear ${advertisement.sponsor_name},
        
        Your advertisement "${advertisement.title}" on ScamReport Namibia will expire in ${daysRemaining} days on ${format(endDate, "MMMM dd, yyyy")}.
        
        If you would like to renew your advertisement, please contact us or visit our website.
        
        Thank you for advertising with us.
        
        Best regards,
        ScamReport Namibia Team
      `,
      html: `
        <p>Dear ${advertisement.sponsor_name},</p>
        <p>Your advertisement "${advertisement.title}" on ScamReport Namibia will expire in ${daysRemaining} days on ${format(endDate, "MMMM dd, yyyy")}.</p>
        <p>If you would like to renew your advertisement, please contact us or visit our website.</p>
        <p>Thank you for advertising with us.</p>
        <p>Best regards,<br>ScamReport Namibia Team</p>
      `,
    })

    return NextResponse.json({ message: "Reminder sent successfully" })
  } catch (error) {
    console.error("Error sending reminder:", error)
    return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 })
  }
}
