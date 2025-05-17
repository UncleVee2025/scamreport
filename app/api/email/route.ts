import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"

// Email validation schema
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(100),
  text: z.string().min(1).max(10000),
  html: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const result = emailSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          errors: result.error.format(),
        },
        { status: 400 },
      )
    }

    const { to, subject, text, html } = result.data

    // Ensure emails only go to authorized addresses
    const allowedEmails = ["scamreportnam@popya.org"]
    if (!allowedEmails.includes(to)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized email recipient",
        },
        { status: 403 },
      )
    }

    // Create a transporter with environment variables
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Send email
    await transporter.sendMail({
      from: `"ScamReport Namibia" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || undefined,
    })

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
      },
      { status: 500 },
    )
  }
}
