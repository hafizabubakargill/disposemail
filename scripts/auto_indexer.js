const { google } = require('googleapis');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const https = require('https');

const CREDENTIALS_PATH = path.join(__dirname, '../google-credentials.json');
const HISTORY_PATH = path.join(__dirname, '../indexing_history.json');
const SITEMAP_URL = 'https://disposemail.xyz/sitemap.xml';

async function fetchSitemap() {
    return new Promise((resolve, reject) => {
        https.get(SITEMAP_URL, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}

async function runIndexer() {
    console.log(`[AutoIndexer] Waking up to process URLs...`);
    let auth;
    
    // First, try Environment Variable (Hostinger Production)
    if (process.env.GOOGLE_INDEXING_CREDENTIALS) {
        let creds;
        let envStr = process.env.GOOGLE_INDEXING_CREDENTIALS.trim();
        // If Hostinger wraps the JSON in single quotes, remove them
        if (envStr.startsWith("'") && envStr.endsWith("'")) {
            envStr = envStr.slice(1, -1);
        }
        // Fix Hostinger escaping curly braces e.g. \{ "type"
        envStr = envStr.replace(/\\{/g, '{').replace(/\\}/g, '}');
        try {
            creds = JSON.parse(envStr);
            // If it was doubly stringified, parse again
            if (typeof creds === 'string') creds = JSON.parse(creds);
            
            // Fix newlines in private key if Hostinger escaped them doubly
            if (creds.private_key && creds.private_key.includes('\\n')) {
                creds.private_key = creds.private_key.replace(/\\n/g, '\n');
            }

            auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: creds.client_email,
                    private_key: creds.private_key,
                },
                scopes: ['https://www.googleapis.com/auth/indexing'],
            });
            console.log(`[AutoIndexer] Authenticating via Environment Variable...`);
        } catch (err) {
            console.error(`[AutoIndexer] Failed to parse GOOGLE_INDEXING_CREDENTIALS env var. Error:`, err.message);
            console.error(`[AutoIndexer] Env string started with:`, envStr.substring(0, 50));
            return;
        }
    } 
    // Fallback to Local File (Development)
    else if (fs.existsSync(CREDENTIALS_PATH)) {
        auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });
        console.log(`[AutoIndexer] Authenticating via local credentials file...`);
    } 
    // Neither found
    else {
        console.warn(`[AutoIndexer] Credentials not found. Please set GOOGLE_INDEXING_CREDENTIALS env var. Skipping.`);
        return;
    }

    try {
        const sitemapXml = await fetchSitemap();
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(sitemapXml);
        
        let allUrls = [];
        if (result.urlset && result.urlset.url) {
            allUrls = result.urlset.url.map(entry => entry.loc[0]);
        }
        
        console.log(`[AutoIndexer] Found ${allUrls.length} total URLs in sitemap.`);

        let history = [];
        if (fs.existsSync(HISTORY_PATH)) {
            try {
                history = JSON.parse(fs.readFileSync(HISTORY_PATH, 'utf8'));
            } catch (e) {
                history = [];
            }
        }

        // Sync with MongoDB so Hostinger ephemeral container deployments never reset indexing progress
        const mongoose = require('mongoose');
        let mongoCol = null;
        try {
            if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.connection.db) {
                mongoCol = mongoose.connection.db.collection('indexing_state');
                const doc = await mongoCol.findOne({ _id: 'google_indexing_history' });
                if (doc && Array.isArray(doc.urls)) {
                    history = Array.from(new Set([...history, ...doc.urls]));
                }
            }
        } catch (dbErr) {
            console.warn(`[AutoIndexer] MongoDB history sync warning:`, dbErr.message);
        }

        const unindexedUrls = allUrls.filter(url => !history.includes(url));
        console.log(`[AutoIndexer] ${unindexedUrls.length} URLs are currently unindexed.`);

        if (unindexedUrls.length === 0) {
            console.log(`[AutoIndexer] All URLs have been submitted. Going back to sleep.`);
            return;
        }

        // Submit up to 80 URLs per 12-hour batch (~160/day, safely under Google's 200/day Indexing API quota)
        const batchSize = Math.min(80, unindexedUrls.length);
        const batchToSubmit = unindexedUrls.slice(0, batchSize);

        console.log(`[AutoIndexer] Preparing to submit a batch of ${batchSize} URLs...`);

        const authClient = await auth.getClient();
        const indexing = google.indexing({ version: 'v3', auth: authClient });

        let successCount = 0;
        for (const url of batchToSubmit) {
            try {
                await indexing.urlNotifications.publish({
                    requestBody: {
                        url: url,
                        type: 'URL_UPDATED',
                    },
                });
                console.log(`[AutoIndexer] Successfully submitted: ${url}`);
                history.push(url);
                successCount++;
                
                // Sleep for a tiny bit between requests to avoid burst rate limits
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) {
                console.error(`[AutoIndexer] Failed to submit ${url}:`, err.message);
                if (err.message && err.message.includes('Quota exceeded')) {
                    console.warn(`[AutoIndexer] Daily quota reached. Stopping batch early.`);
                    break;
                }
            }
        }

        // Save history to both local disk and MongoDB
        try {
            fs.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
        } catch (e) {}

        if (mongoCol) {
            try {
                await mongoCol.updateOne(
                    { _id: 'google_indexing_history' },
                    { $set: { urls: history, updatedAt: new Date() } },
                    { upsert: true }
                );
            } catch (dbErr) {
                console.warn(`[AutoIndexer] Failed to save history to MongoDB:`, dbErr.message);
            }
        }
        console.log(`[AutoIndexer] Batch complete. Submitted ${successCount}/${batchSize}. Saved history (${history.length} total indexed).`);

    } catch (err) {
        console.error(`[AutoIndexer] Critical Error:`, err);
    }
}

// Allow running manually via CLI, or exporting for interval usage
if (require.main === module) {
    runIndexer();
}

module.exports = runIndexer;
