const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib/blog-data/en.ts');
const content = fs.readFileSync(filePath, 'utf8');

// We can just execute the TS file to get the array if we compile it, or parse it roughly.
// Let's use a regex to extract content blocks, or we can just run it using node if we strip the typescript exports.
let scriptContent = content.replace('export const englishPosts = [', 'module.exports = [');
scriptContent = scriptContent.replace(/export interface BlogPost \{[\s\S]*?\}/, '');
scriptContent = scriptContent.replace(/import \{.*\} from .*/g, '');

try {
    fs.writeFileSync('/tmp/temp_en.js', scriptContent);
    const blogs = require('/tmp/temp_en.js');
    
    let under1500 = [];
    blogs.forEach((blog, index) => {
        // approximate word count by splitting on whitespace
        const wordCount = blog.content.split(/\s+/).filter(w => w.length > 0).length;
        console.log(`Blog ${index + 1} (${blog.slug}): ${wordCount} words`);
        if (wordCount < 1500) {
            under1500.push({ index, slug: blog.slug, wordCount });
        }
    });
    
    console.log(`\nTotal blogs: ${blogs.length}`);
    console.log(`Blogs under 1500 words: ${under1500.length}`);
    if (under1500.length > 0) {
        console.log(under1500.map(b => `- ${b.slug} (${b.wordCount} words)`).join('\n'));
    }
} catch (e) {
    console.error('Failed to parse blogs', e);
}
