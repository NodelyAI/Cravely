// Service worker for handling notifications in the browser
self.addEventListener('install', (event) => {
  console.log('Order notification service worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Order notification service worker activated');
});

// Handle push notifications from the server
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/logo/logo_512.png',
    badge: '/assets/logo/logo_512.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// When the notification is clicked, open the relevant page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
