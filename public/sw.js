const CACHE_NAME = 'disposemail-v1.0.13';
const ASSETS_TO_CACHE = [
    '/',
    '/icon.svg',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('push', (event) => {
    let data = { title: 'New Email Received', body: 'You have a new message in your DisposeMail inbox.' };
    if (event.data) {
        try {
            const parsed = event.data.json();
            data = {
                title: parsed.title || 'New Email Received',
                body: parsed.body || 'You have a new message in your DisposeMail inbox.'
            };
        } catch (e) {
            data.body = event.data.text() || 'You have a new message in your DisposeMail inbox.';
        }
    }

    const options = {
        body: data.body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [100, 50, 100],
        data: {
            url: self.registration.scope
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
