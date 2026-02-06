import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPushNotification } from "@/lib/web-push";

// This endpoint should be called by a cron job (e.g., every minute)
// It checks which users should receive reminders at the current time
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from our cron service (simple API key check)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Get current time in HH:mm format
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, "0");
    const currentMinute = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${currentHour}:${currentMinute}`;
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Find all users with reminders enabled at this time
    const usersWithReminders = await prisma.userSettings.findMany({
      where: {
        notificationsEnabled: true,
        reminderTime: currentTime,
      },
      include: {
        user: {
          include: {
            pushSubscriptions: true,
          },
        },
      },
    });

    let sent = 0;
    let failed = 0;
    const invalidSubscriptions: string[] = [];

    for (const settings of usersWithReminders) {
      // Check if today is in the reminder days
      const reminderDays = JSON.parse(settings.reminderDays || "[0,1,2,3,4,5,6]");
      if (!reminderDays.includes(currentDay)) {
        continue;
      }

      // Send notification to all user's subscriptions
      for (const subscription of settings.user.pushSubscriptions) {
        try {
          const success = await sendPushNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            {
              title: "🌙 DreamOracle",
              body: "Bonjour ! N'oubliez pas de noter votre rêve de cette nuit.",
              icon: "/icons/icon-192x192.png",
              badge: "/icons/icon-72x72.png",
              tag: "dream-reminder",
              data: {
                url: "/dreams/new",
              },
            }
          );

          if (success) {
            sent++;
          } else {
            // Subscription is invalid, mark for deletion
            invalidSubscriptions.push(subscription.id);
            failed++;
          }
        } catch (error) {
          console.error("Failed to send notification:", error);
          failed++;
        }
      }
    }

    // Clean up invalid subscriptions
    if (invalidSubscriptions.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: {
          id: { in: invalidSubscriptions },
        },
      });
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      cleaned: invalidSubscriptions.length,
      time: currentTime,
      day: currentDay,
    });
  } catch (error) {
    console.error("Error sending reminders:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi des rappels" },
      { status: 500 }
    );
  }
}
