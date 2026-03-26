const fs = require('fs');
const path = require('path');
const translate = require('@iamtraction/google-translate');

async function translateText(text, targetLang) {
    if (!text || typeof text !== 'string') return text;
    
    // Protect HTML tags from being translated by using specific delimiters
    let textToTranslate = text.replace(/<([^>]+)>/g, '`$1`');
    
    const paragraphs = textToTranslate.split('\n\n');
    let translatedArray = [];

    for (let p of paragraphs) {
        if (!p.trim()) {
            translatedArray.push(p);
            continue;
        }

        try {
            // @iamtraction/google-translate handles rate limits internally with dynamic token generation
            const res = await translate(p, { from: 'en', to: targetLang });
            translatedArray.push(res.text);
            // Throttle slightly
            await new Promise(r => setTimeout(r, 600));
        } catch (e) {
            console.error('[Translation Error on chunk]', e.message);
            translatedArray.push(p); // Fallback to english
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    let result = translatedArray.join('\n\n');
    // Restore HTML tags
    result = result.replace(/`([^`]+)`/g, '<$1>');
    return result;
}

function extractObjects(tsContent) {
    const objects = [];
    const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = slugRegex.exec(tsContent)) !== null) {
        objects.push(match[1]);
    }
    return objects;
}

function getMissingBlocks(enContent, existingSlugs) {
    const blocks = enContent.split(/{\s*slug:\s*['"]/);
    const missing = [];
    
    for (let i = 1; i < blocks.length; i++) {
        const block = blocks[i];
        const slugMatch = block.match(/^([^'"]+)['"]/);
        if (slugMatch) {
            const slug = slugMatch[1];
            if (!existingSlugs.includes(slug)) {
                let fullBlock = "{ \n    slug: '" + block;
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
    console.log("Starting robust blog sync...");
    const blogDir = path.join(__dirname, '../lib/blog-data');
    const enContent = fs.readFileSync(path.join(blogDir, 'en.ts'), 'utf-8');
    
    const targets = [
        { file: 'es.ts', lang: 'es' },
        { file: 'pt.ts', lang: 'pt' },
        { file: 'ru.ts', lang: 'ru' },
        { file: 'zh.ts', lang: 'zh-cn' }
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
            
            const contentMatch = translatedBlock.match(/content:\s*`([\s\S]+?)`/);
            if (contentMatch) {
                const originalContent = contentMatch[1];
                const translatedContent = await translateText(originalContent, target.lang);
                // Safe replacement string matching
                translatedBlock = translatedBlock.replace(originalContent, () => translatedContent);
            }

            // Cleanly append to the array
            targetContent = targetContent.replace(/\s*\];?\s*$/, '');
            targetContent += `,\n${translatedBlock}\n];\n`;
            
            fs.writeFileSync(filePath, targetContent, 'utf-8');
            console.log(` Added ${blockData.slug} to ${target.file}`);
        }
    }
    console.log('Blog sync complete.');
}

run().catch(console.error);
