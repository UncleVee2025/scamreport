import { NextResponse } from "next/server"
import { checkExpiringAdvertisements, markReminderSent, deactivateExpiredAdvertisements } from "@/lib/db"
import { sendEmail } from "@/lib/email"

// This route should be called by a cron job daily
export async function GET(request: Request) {
  try {
    // Check if this is a legitimate cron request (you can add more security here)
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Deactivate expired advertisements
    await deactivateExpiredAdvertisements()

    // Check for advertisements that need reminders
    const { thirtyDayReminders, fifteenDayReminders } = await checkExpiringAdvertisements()

    // Send 30-day reminders
    for (const ad of thirtyDayReminders) {
      await sendEmail({
        to: ad.advertiser_email,
        subject: "Your advertisement will expire in 30 days",
        text: `
          Dear ${ad.sponsor_name},
          
          Your advertisement "${ad.title}" on ScamReport Namibia will expire in 30 days on ${ad.end_date}.
          
          If you would like to renew your advertisement, please contact us or visit our website.
          
          Thank you for advertising with us.
          
          Best regards,
          ScamReport Namibia Team
        `,
        html: `
          <p>Dear ${ad.sponsor_name},</p>
          <p>Your advertisement "${ad.title}" on ScamReport Namibia will expire in 30 days on ${ad.end_date}.</p>
          <p>If you would like to renew your advertisement, please contact us or visit our website.</p>
          <p>Thank you for advertising with us.</p>
          <p>Best regards,<br>ScamReport Namibia Team</p>
        `,
      })

      // Mark reminder as sent
      await markReminderSent(ad.id, "30days")
    }

    // Send 15-day reminders
    for (const ad of fifteenDayReminders) {
      await sendEmail({
        to: ad.advertiser_email,
        subject: "REMINDER: Your advertisement will expire in 15 days",
        text: `
          Dear ${ad.sponsor_name},
          
          This is a reminder that your advertisement "${ad.title}" on ScamReport Namibia will expire in 15 days on ${ad.end_date}.
          
          If you would like to renew your advertisement, please contact us or visit our website soon to avoid interruption.
          
          Thank you for advertising with us.
          
          Best regards,
          ScamReport Namibia Team
        `,
        html: `
          <p>Dear ${ad.sponsor_name},</p>
          <p>This is a reminder that your advertisement "${ad.title}" on ScamReport Namibia will expire in 15 days on ${ad.end_date}.</p>
          <p>If you would like to renew your advertisement, please contact us or visit our website soon to avoid interruption.</p>
          <p>Thank you for advertising with us.</p>
          <p>Best regards,<br>ScamReport Namibia Team</p>
        `,
      })

      // Mark reminder as sent
      await markReminderSent(ad.id, "15days")
    }

    return NextResponse.json({
      success: true,
      message: "Advertisement checks completed",
      stats: {
        deactivated: "Expired advertisements deactivated",
        thirtyDayReminders: thirtyDayReminders.length,
        fifteenDayReminders: fifteenDayReminders.length,
      },
    })
  } catch (error) {
    console.error("Error in advertisement cron job:", error)
    return NextResponse.json({ error: "Failed to process advertisement checks" }, { status: 500 })
  }
}
