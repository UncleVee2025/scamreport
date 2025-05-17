import nodemailer from "nodemailer"

interface EmailData {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(data: EmailData) {
  try {
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
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html || undefined,
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
