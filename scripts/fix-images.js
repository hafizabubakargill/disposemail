const fs = require('fs');
const path = require('path');

const blogDir = path.join('/Users/abubakargill/Downloads/Anti Gravity/Project 1/lib/blog-data');
const files = ['es.ts', 'pt.ts', 'ru.ts', 'zh.ts', 'en.ts'];

const updates = [
  { slug: 'what-is-dispomail-ultimate-guide', newImage: '/blog/dispomail_ultimate_guide.png' },
  { slug: 'why-dispomail-best-disposable-email-generator-2026', newImage: '/blog/best_generator_2026.png' },
  { slug: 'stop-spam-instantly-guide-using-dispomail', newImage: '/blog/stop_spam_instantly.png' }
];

for (const file of files) {
  let content = fs.readFileSync(path.join(blogDir, file), 'utf8');
  
  for (const update of updates) {
    // We regex match the block for this slug up to the image field
    const regex = new RegExp(`(slug:\\s*['"]${update.slug}['"][\\s\\S]*?image:\\s*['"])([^'"]+)(['"])`);
    content = content.replace(regex, `$1${update.newImage}$3`);
  }
  
  fs.writeFileSync(path.join(blogDir, file), content);
  console.log(`Updated images in ${file}`);
}
