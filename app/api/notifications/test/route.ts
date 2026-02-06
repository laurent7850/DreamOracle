import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendPushNotification } from "@/lib/web-push";

// Test endpoint to send a notification to the current user
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Get user's push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: session.user.id },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: "Aucun abonnement push trouvé" },
        { status: 404 }
      );
    }

    let sent = 0;
    let failed = 0;

    for (const subscription of subscriptions) {
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
            title: "🌙 Test DreamOracle",
            body: "Ceci est une notification de test. Tout fonctionne correctement !",
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-72x72.png",
            tag: "dream-test",
            data: {
              url: "/dashboard",
            },
          }
        );

        if (success) {
          sent++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error("Failed to send test notification:", error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error("Error sending test notification:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de la notification test" },
      { status: 500 }
    );
  }
}
