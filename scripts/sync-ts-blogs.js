const fs = require('fs');
const path = require('path');

// Basic HTML/Template translation preserving tags
async function translateText(text, targetLang) {
    if (!text || typeof text !== 'string') return text;
    
    // Protect HTML tags from being butchered
    let textToTranslate = text.replace(/<([^>]+)>/g, '`$1`');
    
    // Very large translation might 400 bad request, split by paragraphs if needed
    // But google translate api GET endpoint can handle ~2000 chars securely.
    // So we chunk by paragraphs
    const paragraphs = textToTranslate.split('\n\n');
    let translatedArray = [];

    for (let p of paragraphs) {
        if (!p.trim()) {
            translatedArray.push(p);
            continue;
        }

        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(p)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const translatedP = data[0].map(c => c[0]).join('');
            translatedArray.push(translatedP);
            await new Promise(r => setTimeout(r, 400));
        } catch (e) {
            console.error('[Translation Error]', e.message);
            translatedArray.push(p); // Fallback to english chunk
        }
    }

    let result = translatedArray.join('\n\n');
    // Restore HTML tags
    result = result.replace(/`([^`]+)`/g, '<$1>');
    return result;
}

// Quick and dirty parser for the TS exports
function extractObjects(tsContent) {
    const objects = [];
    const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = slugRegex.exec(tsContent)) !== null) {
        objects.push(match[1]);
    }
    return objects;
}

// Extract full text of latest objects from en.ts
function getMissingBlocks(enContent, existingSlugs) {
    // We split by `{ slug:` roughly
    const blocks = enContent.split(/{\s*slug:\s*['"]/);
    const missing = [];
    
    for (let i = 1; i < blocks.length; i++) {
        const block = blocks[i];
        const slugMatch = block.match(/^([^'"]+)['"]/);
        if (slugMatch) {
            const slug = slugMatch[1];
            if (!existingSlugs.includes(slug)) {
                // Reconstruct full block text
                let fullBlock = "{ \n    slug: '" + block;
                // Find end of object "  }," or "  }\n]"
                // Assuming standard formatting
                let endIdx = fullBlock.lastIndexOf('  }');
                if (endIdx !== -1) {
                   fullBlock = fullBlock.substring(0, endIdx + 3);
                   missing.push({ slug, text: fullBlock });
                }
            }
        }
    }
    return missing;
}

async function run() {
    const blogDir = path.join(__dirname, '../lib/blog-data');
    const enContent = fs.readFileSync(path.join(blogDir, 'en.ts'), 'utf-8');
    
    const targets = [
        { file: 'es.ts', lang: 'es' },
        { file: 'pt.ts', lang: 'pt' },
        { file: 'ru.ts', lang: 'ru' },
        { file: 'zh.ts', lang: 'zh-CN' }
    ];

    for (const target of targets) {
        const filePath = path.join(blogDir, target.file);
        let targetContent = fs.readFileSync(filePath, 'utf-8');
        
        const existingSlugs = extractObjects(targetContent);
        const missingBlocks = getMissingBlocks(enContent, existingSlugs);

        if (missingBlocks.length === 0) {
            console.log(`[${target.lang}] Up to date.`);
            continue;
        }

        console.log(`[${target.lang}] Found ${missingBlocks.length} missing posts. Translating...`);

        for (const blockData of missingBlocks) {
            console.log(` Translating slug: ${blockData.slug}`);
            
            // Extract fields to translate manually using regex to prevent parsing full AST
            let translatedBlock = blockData.text;
            
            const extractAndTranslate = async (fieldRegex, lang) => {
                const match = translatedBlock.match(fieldRegex);
                if (match) {
                    const originalStr = match[1];
                    const translatedStr = await translateText(originalStr, lang);
                    translatedBlock = translatedBlock.replace(originalStr, translatedStr.replace(/["']/g, "\\'"));
                }
            };

            await extractAndTranslate(/title:\s*['"]([^'"]+)['"]/, target.lang);
            await extractAndTranslate(/excerpt:\s*['"]([^'"]+)['"]/, target.lang);
            await extractAndTranslate(/category:\s*['"]([^'"]+)['"]/, target.lang);
            
            // Content is in template literals content: `...`
            const contentMatch = translatedBlock.match(/content:\s*`([\s\S]+?)`/);
            if (contentMatch) {
                const originalContent = contentMatch[1];
                const translatedContent = await translateText(originalContent, target.lang);
                // Replace safely 
                translatedBlock = translatedBlock.split(originalContent).join(translatedContent);
            }

            // Append to file
            // Remove ending `\n]` or `\n];`
            targetContent = targetContent.replace(/\s*\];?\s*$/, '');
            targetContent += `,\n${translatedBlock}\n];\n`;
            
            fs.writeFileSync(filePath, targetContent, 'utf-8');
            console.log(` Added ${blockData.slug} to ${target.file}`);
        }
    }
    console.log('Blog sync complete.');
}

run().catch(console.error);
