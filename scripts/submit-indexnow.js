const https = require('https');

const host = 'disposemail.xyz';
const key = 'e78958b546715bdb5a4e83f7fbfe30c2';
const keyLocation = `https://${host}/${key}.txt`;

const routes = [
    '',
    '/about',
    '/faq',
    '/privacy',
    '/terms',
    '/api-docs',
    '/blog',
    '/contact',
    '/blog/why-disposable-emails-essential-privacy',
    '/blog/avoiding-spam-with-temporary-inboxes',
    '/blog/evolution-of-email-privacy-2026',
    '/blog/secure-online-shopping-disposable-emails',
    '/blog/top-privacy-extensions-temporary-inbox',
    '/blog/dangers-reusing-email-social-media',
    '/blog/how-temporary-email-protects-phishing',
    '/blog/never-use-work-email-personal',
    '/blog/ultimate-guide-digital-anonymity-2026',
    '/temp-mail-for-facebook',
    '/temp-mail-for-netflix',
    '/temp-mail-for-instagram',
    '/temp-mail-for-amazon',
    '/temp-mail-for-spotify'
];

const locales = ['en', 'es', 'pt', 'ru', 'zh'];

const urlList = [];
routes.forEach(route => {
    locales.forEach(lang => {
        const url = lang === 'en' ? `https://${host}${route}` : `https://${host}/${lang}${route}`;
        urlList.push(url);
    });
});

const data = JSON.stringify({
    host: host,
    key: key,
    keyLocation: keyLocation,
    urlList: urlList
});

const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('Error submitting to IndexNow:', error);
});

req.write(data);
req.end();
