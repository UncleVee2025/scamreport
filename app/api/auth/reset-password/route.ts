import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const users = await query("SELECT * FROM users WHERE email = ?", [email])

    if (!users || users.length === 0) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json({
        success: true,
        message: "If your email exists in our system, you will receive a password reset link",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store token in database
    await query("UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?", [
      resetToken,
      resetTokenExpiry,
      email,
    ])

    // Send email with reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/new-password?token=${resetToken}`

    await sendEmail({
      to: email,
      subject: "Reset Your ScamReport Password",
      text: `Please use the following link to reset your password: ${resetUrl}. This link is valid for 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">Reset Your ScamReport Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Please click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The ScamReport Team</p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "If your email exists in our system, you will receive a password reset link",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ message: "Failed to process password reset" }, { status: 500 })
  }
}
