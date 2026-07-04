const fs = require('fs');
const path = require('path');
const { englishPosts } = require('../lib/blog-data/en.ts');
const { qaPostContent, extensionsPostContent, saashubPostContent } = require('./expand-contents.js');

// 1. Ensure the 3 newest posts have the expanded 1600+ word content
englishPosts[38].content = qaPostContent;
englishPosts[39].content = extensionsPostContent;
englishPosts[40].content = saashubPostContent;

// 2. Define keyword mapping for internal linking (Tools & Blog Posts)
const linkMappings = [
  { keywords: [/\bdisposable email generator\b/i, /\bdisposable email service\b/i, /\bdisposable email addresses\b/i, /\btemporary email tool\b/i, /\btemporary email addresses\b/i, /\btemporary inbox\b/i, /\bephemeral inbox\b/i], url: '/' },
  { keywords: [/\bfree developer tools\b/i, /\bdeveloper tools suite\b/i, /\bfree tools suite\b/i, /\bfree privacy utilities\b/i, /\bfree privacy tools\b/i, /\bfree tools\b/i], url: '/free-tools' },
  { keywords: [/\bsecure password generator\b/i, /\bstrong password generator\b/i, /\bpassword generator\b/i, /\brandom passwords\b/i, /\bstrong passwords\b/i], url: '/password-generator' },
  { keywords: [/\bfake identity generator\b/i, /\bidentity generator\b/i, /\bdummy persona\b/i, /\bfake identity\b/i, /\bsynthetic identity\b/i], url: '/identity-generator' },
  { keywords: [/\buuid generator\b/i, /\bv4 uuid\b/i, /\buuid routing\b/i, /\buuids\b/i, /\buuid\b/i], url: '/uuid-generator' },
  { keywords: [/\bchrome extension\b/i, /\bbrowser extension\b/i, /\btoolbar extension\b/i, /\bextension hub\b/i], url: '/extension' },
  { keywords: [/\bip address lookup\b/i, /\bip lookup utility\b/i, /\bip lookup tool\b/i, /\bip lookup\b/i, /\bip address\b/i], url: '/ip-lookup' },
  { keywords: [/\bdomain availability checker\b/i, /\bdomain checker utility\b/i, /\bdomain checker\b/i, /\bwhois lookup\b/i], url: '/domain-checker' },
  { keywords: [/\btest credit card generator\b/i, /\btest card generator\b/i, /\btest credit card\b/i, /\bluhn algorithm\b/i], url: '/test-card-generator' },
  { keywords: [/\bbase64 encoding tool\b/i, /\bbase64 decoder\b/i, /\bbase64 utility\b/i, /\bbase64 encoding\b/i, /\bbase64\b/i], url: '/base64' },
  { keywords: [/\bdata breach checker\b/i, /\bdata breach lookup\b/i, /\bbreach scanner\b/i, /\bdata breach\b/i, /\bcompromised passwords\b/i], url: '/data-breach-checker' },
  { keywords: [/\bencrypted secure notes\b/i, /\bself-destructing notes\b/i, /\bsecure notes tool\b/i, /\bsecure notes\b/i], url: '/secure-notes' },
  { keywords: [/\bqr code generator\b/i, /\bqr code creator\b/i, /\bqr codes\b/i, /\bqr code\b/i], url: '/qr-code-generator' },
  { keywords: [/\bjwt token analyzer\b/i, /\bjwt token decoder\b/i, /\bjwt decoder\b/i, /\bjwt token\b/i], url: '/jwt-decoder' },
  { keywords: [/\bdata brokers\b/i, /\bdata broker\b/i], url: '/blog/how-data-brokers-sell-your-email-stop-them' },
  { keywords: [/\bspear phishing\b/i, /\bphishing attacks\b/i, /\bphishing scams\b/i, /\bphishing\b/i], url: '/blog/how-temporary-email-protects-phishing' },
  { keywords: [/\bdigital anonymity\b/i, /\bonline anonymity\b/i], url: '/blog/ultimate-guide-digital-anonymity-2026' },
  { keywords: [/\bstop spam\b/i, /\bavoiding spam\b/i, /\bspam folders\b/i], url: '/blog/stop-spam-instantly-guide-using-dispomail' }
];

function injectLinks(html, currentSlug) {
  // Tokenize HTML by tags vs text
  const tokens = html.split(/(<[^>]+>)/g);
  let inAnchor = false;
  let inPre = false;
  let inCode = false;
  let inHeading = false;
  
  // Track how many times each URL has been linked in this post (max 1 time per URL to avoid over-linking)
  const linkedUrls = new Set();
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith('<')) {
      if (/^<a\b/i.test(token)) inAnchor = true;
      else if (/^<\/a>/i.test(token)) inAnchor = false;
      else if (/^<pre\b/i.test(token)) inPre = true;
      else if (/^<\/pre>/i.test(token)) inPre = false;
      else if (/^<code\b/i.test(token)) inCode = true;
      else if (/^<\/code>/i.test(token)) inCode = false;
      else if (/^<h[1-6]\b/i.test(token)) inHeading = true;
      else if (/^<\/h[1-6]>/i.test(token)) inHeading = false;
      continue;
    }

    // If inside anchor, code block, or heading, skip keyword linking
    if (inAnchor || inPre || inCode || inHeading) continue;

    // Check against keyword mappings
    for (const mapping of linkMappings) {
      // Don't link to the current post itself
      if (mapping.url === `/blog/${currentSlug}`) continue;
      if (linkedUrls.has(mapping.url)) continue;

      for (const regex of mapping.keywords) {
        if (regex.test(tokens[i])) {
          tokens[i] = tokens[i].replace(regex, (match) => {
            linkedUrls.add(mapping.url);
            return `<a href="${mapping.url}" class="text-blue-600 dark:text-blue-400 font-semibold underline">${match}</a>`;
          });
          break; // Stop checking other regexes for this url once linked
        }
      }
    }
  }

  let newHtml = tokens.join('');

  // Check how many total links exist now
  const linkCount = (newHtml.match(/href=[\x27\x22][^\x27\x22]+[\x27\x22]/g) || []).length;
  
  // If still fewer than 4 links, append a clean Related Tools section
  if (linkCount < 4) {
    newHtml += `
<div class="mt-12 p-8 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl">
  <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Explore Related Privacy &amp; Developer Tools</h3>
  <p class="text-gray-600 dark:text-gray-400 mb-6">Enhance your digital security and streamline your engineering workflows with our free suite of online tools and instant disposable inboxes:</p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a href="/" class="p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#333] hover:border-blue-500 transition-all font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
      <span>Disposable Email Generator</span>
      <span class="text-xs font-black uppercase tracking-widest">&rarr;</span>
    </a>
    <a href="/free-tools" class="p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#333] hover:border-blue-500 transition-all font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
      <span>Free Developer Tools Suite</span>
      <span class="text-xs font-black uppercase tracking-widest">&rarr;</span>
    </a>
    <a href="/password-generator" class="p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#333] hover:border-blue-500 transition-all font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
      <span>Secure Password Generator</span>
      <span class="text-xs font-black uppercase tracking-widest">&rarr;</span>
    </a>
    <a href="/extension" class="p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#333] hover:border-blue-500 transition-all font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
      <span>DisposeMail Chrome Extension</span>
      <span class="text-xs font-black uppercase tracking-widest">&rarr;</span>
    </a>
  </div>
</div>`;
  }

  return newHtml;
}

console.log(`Processing ${englishPosts.length} English blog posts...`);
let totalLinksAdded = 0;

englishPosts.forEach((post, i) => {
  const oldLinks = (post.content.match(/href=[\x27\x22][^\x27\x22]+[\x27\x22]/g) || []).length;
  post.content = injectLinks(post.content, post.slug);
  const newLinks = (post.content.match(/href=[\x27\x22][^\x27\x22]+[\x27\x22]/g) || []).length;
  totalLinksAdded += (newLinks - oldLinks);
  console.log(`[${i+1}/41] ${post.slug} -> Links: ${oldLinks} => ${newLinks}`);
});

console.log(`\nSuccessfully injected ${totalLinksAdded} new internal links across all 41 blog posts!`);

// Save updated English posts
const enPath = path.join(__dirname, '../lib/blog-data/en.ts');
fs.writeFileSync(enPath, "export const englishPosts = " + JSON.stringify(englishPosts, null, 2) + ";\n");
console.log("Updated lib/blog-data/en.ts");

// 3. Synchronize across ES, PT, RU, ZH
["es", "pt", "ru", "zh"].forEach(lang => {
  const filePath = path.join(__dirname, `../lib/blog-data/${lang}.ts`);
  const varName = {es:"spanishPosts", pt:"portuguesePosts", ru:"russianPosts", zh:"chinesePosts"}[lang];
  
  delete require.cache[require.resolve(filePath)];
  const posts = require(filePath)[varName];
  
  // Update content of each post to match englishPosts (or keep localized text with same internal link structure)
  // To ensure every language has the 1600+ word deep dive content AND the rich internal links, we sync the content and image properties!
  englishPosts.forEach((ep, idx) => {
    if (posts[idx] && posts[idx].slug === ep.slug) {
      posts[idx].content = ep.content;
      posts[idx].image = ep.image;
    } else if (!posts.find(p => p.slug === ep.slug)) {
      posts.push({ ...ep });
    }
  });

  fs.writeFileSync(filePath, `export const ${varName} = ` + JSON.stringify(posts, null, 2) + ";\n");
  console.log(`Synchronized ${lang}.ts`);
});

console.log("All 41 blog posts across all 5 languages are fully expanded and internally linked!");
