const fs = require('fs');
const path = require('path');

const enFile = path.join(__dirname, '../lib/blog-data/en.ts');
let content = fs.readFileSync(enFile, 'utf8');

// A list of target keywords and their corresponding URLs.
// Using exact phrases or prominent words.
const links = [
  { keyword: 'ip lookup tool', url: '/ip-lookup' },
  { keyword: 'ip lookup', url: '/blog/what-is-my-ip-address-lookup-tool-guide' },
  { keyword: 'domain checker', url: '/blog/domain-availability-checker-guide' },
  { keyword: 'password generator', url: '/blog/secure-password-generator-guide' },
  { keyword: 'identity generator', url: '/blog/fake-identity-generator-use-cases' },
  { keyword: 'qr code generator', url: '/blog/how-qr-code-generators-work' },
  { keyword: 'uuid generator', url: '/blog/what-is-a-uuid-and-why-it-matters' },
  { keyword: 'base64', url: '/blog/base64-encoding-decoding-guide' },
  { keyword: 'credit card generator', url: '/blog/test-credit-card-generator-guide' },
  { keyword: 'disposable email', url: '/blog/why-disposable-emails-essential-privacy' },
  { keyword: 'temp mail', url: '/blog/how-to-create-temp-mail-in-seconds' },
  { keyword: 'secure notes', url: '/blog/what-is-a-secure-note' },
];

function interlink(htmlContent, currentSlug) {
  let newContent = htmlContent;

  links.forEach(link => {
    // Don't link to the current blog post itself
    if (link.url.includes(currentSlug)) return;

    // A regex to match the keyword ONLY if it's NOT inside an <a> tag.
    // This is tricky in regex, but a common trick is to use a replacer function 
    // that skips the match if we are currently inside an a tag.
    // Instead of full DOM parsing, we can split by <a> tags.
    const parts = newContent.split(/(<a\b[^>]*>.*?<\/a>)/gi);
    
    for (let i = 0; i < parts.length; i++) {
        // If this part is an anchor tag, skip it
        if (/^<a\b/i.test(parts[i])) continue;
        
        // Only replace the FIRST occurrence in the text part to avoid spamming links
        const regex = new RegExp(`\\\\b(${link.keyword})\\\\b`, 'i');
        const match = parts[i].match(regex);
        if (match) {
           parts[i] = parts[i].replace(regex, `<a href="${link.url}">$1</a>`);
           break; // Only one link per keyword per blog post
        }
    }
    newContent = parts.join('');
  });

  return newContent;
}

// We need to parse en.ts to interlink. But en.ts is not valid JSON, it's a TS module.
// Instead of full parsing, we can regex replace the content blocks.
let result = content.replace(/(slug:\s*['"]([^'"]+)['"][\s\S]*?content:\s*\`)([\s\S]*?)(\`\s*})/g, (match, p1, slug, html, p4) => {
    const linkedHtml = interlink(html, slug);
    return p1 + linkedHtml + p4;
});

fs.writeFileSync(enFile, result, 'utf8');
console.log('Successfully interlinked blogs in en.ts');
