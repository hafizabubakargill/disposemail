const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { englishPosts } = require('../lib/blog-data/en.ts');

const themes = [
  { bg1: '#0f172a', bg2: '#1e3a8a', accent: '#38bdf8', glow: 'rgba(56,189,248,0.15)' },
  { bg1: '#022c22', bg2: '#065f46', accent: '#34d399', glow: 'rgba(52,211,153,0.15)' },
  { bg1: '#1e1b4b', bg2: '#4c1d95', accent: '#c084fc', glow: 'rgba(192,132,252,0.15)' },
  { bg1: '#18181b', bg2: '#881337', accent: '#fb7185', glow: 'rgba(251,113,133,0.15)' },
  { bg1: '#0f172a', bg2: '#312e81', accent: '#818cf8', glow: 'rgba(129,140,248,0.15)' },
  { bg1: '#1c1917', bg2: '#44403c', accent: '#facc15', glow: 'rgba(250,204,21,0.15)' },
  { bg1: '#042f2e', bg2: '#115e59', accent: '#2dd4bf', glow: 'rgba(45,212,191,0.15)' },
  { bg1: '#2a0a14', bg2: '#581c87', accent: '#f43f5e', glow: 'rgba(244,63,94,0.15)' },
];

function wrapText(text, maxChars = 34) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    if (currentLine.length + 1 + words[i].length <= maxChars) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.slice(0, 3); // Max 3 lines
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function generateCovers() {
  const outDir = path.join(__dirname, '../public/blog');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Generating covers for ${englishPosts.length} blog posts...`);

  for (let i = 0; i < englishPosts.length; i++) {
    const post = englishPosts[i];
    const theme = themes[i % themes.length];
    const lines = wrapText(post.title);

    let textElements = '';
    const startY = lines.length === 1 ? 340 : lines.length === 2 ? 310 : 280;
    lines.forEach((line, idx) => {
      textElements += `<text x="80" y="${startY + idx * 68}" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="900" fill="#ffffff" letter-spacing="-1px">${escapeXml(line)}</text>`;
    });

    // Generate grid dots pattern
    let dots = '';
    for (let x = 80; x < 1200; x += 60) {
      for (let y = 60; y < 675; y += 60) {
        if ((x + y) % 120 === 0) {
          dots += `<circle cx="${x}" cy="${y}" r="1.5" fill="#ffffff" opacity="0.08"/>`;
        }
      }
    }

    const svg = `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.bg1}" />
          <stop offset="100%" stop-color="${theme.bg2}" />
        </linearGradient>
        <radialGradient id="glow${i}" cx="85%" cy="20%" r="50%">
          <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.25" />
          <stop offset="100%" stop-color="${theme.bg2}" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="675" fill="url(#grad${i})" />
      <rect width="1200" height="675" fill="url(#glow${i})" />
      
      <!-- Grid Dots -->
      ${dots}

      <!-- Decorative Circles & Shapes -->
      <circle cx="1050" cy="180" r="140" fill="none" stroke="${theme.accent}" stroke-width="2" opacity="0.3" />
      <circle cx="1050" cy="180" r="90" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="8 8" opacity="0.2" />
      <rect x="950" y="420" width="180" height="180" rx="24" fill="${theme.accent}" opacity="0.05" transform="rotate(-12 1040 510)" />

      <!-- Category Pill Badge -->
      <rect x="80" y="80" width="${Math.max(140, post.category.length * 14 + 40)}" height="44" rx="22" fill="${theme.accent}" fill-opacity="0.15" stroke="${theme.accent}" stroke-width="1.5"/>
      <text x="${80 + Math.max(140, post.category.length * 14 + 40) / 2}" y="108" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="800" fill="${theme.accent}" text-anchor="middle" letter-spacing="2px">${escapeXml(post.category.toUpperCase())}</text>

      <!-- Post Title -->
      ${textElements}

      <!-- Bottom Separator Line -->
      <line x1="80" y1="560" x2="1120" y2="560" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1"/>

      <!-- Footer Brand -->
      <circle cx="96" cy="600" r="16" fill="${theme.accent}"/>
      <path d="M91 600 L95 604 L102 596" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <text x="126" y="606" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#ffffff" opacity="0.9">DISPOSEMAIL</text>
      <text x="260" y="606" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#ffffff" opacity="0.5">•</text>
      <text x="280" y="606" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#ffffff" opacity="0.6">Privacy Insights &amp; Tech Guide</text>
    </svg>`;

    const filename = `${post.slug}.png`;
    const filepath = path.join(outDir, filename);

    await sharp(Buffer.from(svg))
      .png({ quality: 90 })
      .toFile(filepath);

    console.log(`[${i+1}/${englishPosts.length}] Generated ${filename}`);
  }

  console.log('Successfully generated all cover images!');
}

generateCovers().catch(console.error);
