export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission() {
  if (!notificationsSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function sendNotification(title, options = {}) {
  if (!notificationsSupported()) return;
  if (Notification.permission !== 'granted') return;
  // No molestar si la pestaña está activa y enfocada
  if (typeof document !== 'undefined' && document.visibilityState === 'visible' && document.hasFocus()) {
    return;
  }
  try {
    const n = new Notification(title, {
      icon: '/pidevo.png',
      badge: '/pidevo.png',
      requireInteraction: false,
      ...options,
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {}
}

export function notifEnabled() {
  try {
    return localStorage.getItem('pidevo_notif_enabled') === '1' && notificationPermission() === 'granted';
  } catch {
    return false;
  }
}

export function setNotifEnabled(value) {
  try {
    localStorage.setItem('pidevo_notif_enabled', value ? '1' : '0');
  } catch {}
}