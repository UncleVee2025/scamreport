import { NextResponse } from "next/server"
import { getAdvertisementById } from "@/lib/db"
import nodemailer from "nodemailer"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const adId = Number.parseInt(params.id)

    if (isNaN(adId)) {
      return NextResponse.json({ success: false, message: "Invalid advertisement ID" }, { status: 400 })
    }

    // Get advertisement details
    const advertisement = await getAdvertisementById(adId)

    if (!advertisement) {
      return NextResponse.json({ success: false, message: "Advertisement not found" }, { status: 404 })
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Calculate days remaining
    const endDate = new Date(advertisement.end_date)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Send email
    await transporter.sendMail({
      from: `"ScamReport Namibia" <${process.env.EMAIL_USER}>`,
      to: advertisement.advertiser_email,
      subject: `Your Advertisement on ScamReport Namibia - ${diffDays} Days Remaining`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Advertisement is Expiring Soon</h2>
          <p>Dear ${advertisement.sponsor_name},</p>
          <p>Your advertisement "${advertisement.title}" on ScamReport Namibia will expire in <strong>${diffDays} days</strong>.</p>
          <p><strong>Advertisement Details:</strong></p>
          <ul>
            <li>Title: ${advertisement.title}</li>
            <li>Start Date: ${new Date(advertisement.start_date).toLocaleDateString()}</li>
            <li>End Date: ${new Date(advertisement.end_date).toLocaleDateString()}</li>
            <li>Package: ${advertisement.package_duration}</li>
          </ul>
          <p>If you would like to renew your advertisement, please contact us or visit our website.</p>
          <p>Thank you for supporting ScamReport Namibia.</p>
          <p>Best regards,<br>ScamReport Namibia Team</p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Reminder email sent successfully",
    })
  } catch (error) {
    console.error("Error sending reminder email:", error)
    return NextResponse.json({ success: false, message: "Failed to send reminder email" }, { status: 500 })
  }
}
