const fs = require('fs');
const path = require('path');

const enFile = path.join(__dirname, 'lib', 'blog-data', 'en.ts');
let content = fs.readFileSync(enFile, 'utf8');

const newBlogs = require('./new_blogs.js');

let blogsString = '';
newBlogs.forEach(blog => {
  blogsString += `,\n  {\n    slug: '${blog.slug}',\n    title: '${blog.title.replace(/'/g, "\\'")}',\n    excerpt: '${blog.excerpt.replace(/'/g, "\\'")}',\n    date: '${blog.date}',\n    author: '${blog.author}',\n    category: '${blog.category}',\n    image: '${blog.image}',\n    content: \`\n${blog.content}\n    \`\n  }`;
});

// Remove trailing bracket and add blogsString, then close bracket.
content = content.replace(/\s*\];?\s*$/, '') + blogsString + '\n];\n';

fs.writeFileSync(enFile, content, 'utf8');
console.log('Successfully appended 8 new blogs to en.ts');
