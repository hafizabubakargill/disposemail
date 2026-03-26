const fs = require('fs');
const path = require('path');

async function translateText(text, targetLang) {
    if (!text || typeof text !== 'string') return text;
    // Basic formatting preservation
    let textToTranslate = text.replace(/{([a-zA-Z0-9_]+)}/g, '<span class="var-$1"></span>');
    textToTranslate = textToTranslate.replace(/<([^>]+)>(.*?)<\/\1>/g, '<span class="tag-$1">$2</span>');

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Assemble translation chunks
        let translated = data[0].map(chunk => chunk[0]).join('');

        // Restore formatting
        translated = translated.replace(/<span class="var-([a-zA-Z0-9_]+)">\s*<\/span>/g, '{$1}');
        translated = translated.replace(/<span class="tag-([a-zA-Z0-9]+)">\s*(.*?)\s*<\/span>/g, '<$1>$2</$1>');
        
        return translated;
    } catch (e) {
        console.error('Translation failed for text:', text.substring(0, 30), '... Error:', e.message);
        return text; // Fallback to english
    }
}

// Deep object iteration and sync
async function syncObjects(source, target, targetLang) {
    let modified = false;
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            target[key] = target[key] || {};
            const res = await syncObjects(source[key], target[key], targetLang);
            if (res) modified = true;
        } else if (typeof source[key] === 'string') {
            if (!target[key]) {
                console.log(`[${targetLang}] Translating missing key: ${key}`);
                target[key] = await translateText(source[key], targetLang);
                modified = true;
                // Add tiny delay to prevent being blocked by google
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
    }
    return modified;
}

async function run() {
    const messagesDir = path.join(__dirname, '../messages');
    
    if (!fs.existsSync(messagesDir)) {
        console.error('Messages directory not found');
        return;
    }

    const enRaw = fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf-8');
    const enJson = JSON.parse(enRaw);

    const targetLangs = ['es', 'pt', 'ru', 'zh'];
    // Map 'zh' to 'zh-CN' for google translate API
    const langMap = { 'zh': 'zh-CN', 'es': 'es', 'pt': 'pt', 'ru': 'ru' };

    for (const lang of targetLangs) {
        console.log(`\n--- Processing [${lang}] ---`);
        const filePath = path.join(messagesDir, `${lang}.json`);
        
        let targetJson = {};
        if (fs.existsSync(filePath)) {
            targetJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }

        const modified = await syncObjects(enJson, targetJson, langMap[lang]);

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(targetJson, null, 2), 'utf-8');
            console.log(`Saved updates to ${lang}.json`);
        } else {
            console.log(`No updates needed for ${lang}.json`);
        }
    }
    console.log('\nAll done!');
}

run().catch(console.error);
