const fs = require('fs');
const path = require('path');

const newBlogs = [];

// Blogs will be pushed here

function appendBlogs() {
    const enFile = path.join(__dirname, '../lib/blog-data/en.ts');
    let content = fs.readFileSync(enFile, 'utf8');

    let blogsString = '';
    newBlogs.forEach(blog => {
      blogsString += `,\n  {\n    slug: '${blog.slug}',\n    title: '${blog.title.replace(/'/g, "\\'")}',\n    excerpt: '${blog.excerpt.replace(/'/g, "\\'")}',\n    date: '${blog.date}',\n    author: '${blog.author}',\n    category: '${blog.category}',\n    image: '${blog.image}',\n    content: \`\n${blog.content}\n    \`\n  }`;
    });

    content = content.replace(/\s*\];?\s*$/, '') + blogsString + '\n];\n';
    fs.writeFileSync(enFile, content, 'utf8');
    console.log(`Successfully appended ${newBlogs.length} new blogs to en.ts`);
}

module.exports = { newBlogs, appendBlogs };
