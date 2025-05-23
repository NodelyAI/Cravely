// Service for handling notifications and service worker registration

// Check for service worker support
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// Register the service worker for notifications
export const registerServiceWorker = async () => {
  if (!isServiceWorkerSupported()) {
    console.log('Service workers are not supported in this browser');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register('/order-notification-sw.js');
    console.log('Order notification service worker registration successful with scope:', registration.scope);
    return true;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return false;
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show a notification
export const showNotification = (title: string, options: NotificationOptions) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  try {
    new Notification(title, options);
    return true;
  } catch (error) {
    console.error('Error showing notification:', error);
    return false;
  }
};
