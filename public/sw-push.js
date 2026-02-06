// Service Worker for Push Notifications - DreamOracle
// This file handles push notifications separately from the PWA cache

self.addEventListener("push", (event) => {
  console.log("[SW Push] Push event received");

  let data = {
    title: "DreamOracle",
    body: "N'oubliez pas de noter votre rêve !",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: "dream-reminder",
    data: {
      url: "/dreams/new",
    },
  };

  // Try to parse push data if available
  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      console.log("[SW Push] Could not parse push data:", e);
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: [
      {
        action: "record",
        title: "📝 Noter mon rêve",
      },
      {
        action: "dismiss",
        title: "Plus tard",
      },
    ],
    data: data.data,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("[SW Push] Notification clicked:", event.action);

  event.notification.close();

  // Handle different actions
  let url = "/dreams/new";

  if (event.action === "dismiss") {
    // User chose to dismiss - do nothing
    return;
  }

  if (event.notification.data && event.notification.data.url) {
    url = event.notification.data.url;
  }

  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener("notificationclose", (event) => {
  console.log("[SW Push] Notification closed");
});

// Handle subscription changes
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("[SW Push] Subscription changed");

  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: self.VAPID_PUBLIC_KEY,
    }).then((subscription) => {
      // Send new subscription to server
      return fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
    })
  );
});
