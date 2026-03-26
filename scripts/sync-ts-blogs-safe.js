const fs = require('fs');
const path = require('path');
const translate = require('@iamtraction/google-translate');

async function safeTranslate(text, targetLang) {
    if (!text || typeof text !== 'string') return text;
    try {
        const res = await translate(text, { from: 'en', to: targetLang });
        // Restore safely escaped single quotes because it goes into TS strings
        return res.text.replace(/'/g, "\\'");
    } catch(e) {
        console.error("Translation fail:", e.message);
        return text;
    }
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
    console.log("Starting safe blog sync...");
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

        if (missingBlocks.length === 0) continue;

        console.log(`[${target.lang}] Found ${missingBlocks.length} missing posts. Translating safe fields...`);

        for (const blockData of missingBlocks) {
            console.log(` Translating slug: ${blockData.slug}`);
            
            let translatedBlock = blockData.text;

            const extractAndTranslate = async (fieldRegex, lang) => {
                const match = translatedBlock.match(fieldRegex);
                if (match) {
                    const originalStr = match[1];
                    const translatedStr = await safeTranslate(originalStr, lang);
                    translatedBlock = translatedBlock.replace(match[0], match[0].replace(originalStr, translatedStr));
                }
            };

            await extractAndTranslate(/title:\s*['"]([^'"]+)['"]/, target.lang);
            await extractAndTranslate(/excerpt:\s*['"]([^'"]+)['"]/, target.lang);
            await extractAndTranslate(/category:\s*['"]([^'"]+)['"]/, target.lang);
            
            // WE DO NOT TRANSLATE `content` TO PREVENT JSX/SVG CORRUPTION.
            // IT REMAINS IN ENGLISH BUT RENDERS SAFELY IN ALL LANGUAGES.

            targetContent = targetContent.replace(/\s*\];?\s*$/, '');
            targetContent += `,\n${translatedBlock}\n];\n`;
            
            fs.writeFileSync(filePath, targetContent, 'utf-8');
            console.log(` Added ${blockData.slug} to ${target.file}`);
        }
    }
    console.log('Safe Blog sync complete.');
}

run().catch(console.error);
