const fs = require('fs');
const path = require('path');

const srcDir = '/Users/abubakargill/.gemini/antigravity/brain/be39c925-2f0a-4ec5-a077-6da4172db5fa/';
const destDir = path.join(__dirname, 'public', 'blog');

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
files.forEach(file => {
    if (file.startsWith('blog_') && file.endsWith('.png')) {
        // We want to remove the timestamp part _177...png
        // format is blog_topic_1777375036386.png -> blog_topic.png
        const newName = file.replace(/_\d{13}\.png$/, '.png');
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, newName);
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to ${newName}`);
    }
});
