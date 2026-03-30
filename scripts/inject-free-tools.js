const fs = require('fs');
const path = require('path');

const enFile = path.join(__dirname, '../messages/en.json');
const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));

// Inject translations for the 3 featured tools row on Homepage
enContent['HomeFeaturedTools'] = {
  "tool1_title": "Secure Notes",
  "tool1_desc": "Create encrypted passwords, secrets, or messages that automatically self-destruct from the server the instant they are read.",
  "tool2_title": "Data Breach Checker",
  "tool2_desc": "Securely verify if your email, passwords, or data have been exposed in known database leaks across the dark web.",
  "tool3_title": "Password Generator",
  "tool3_desc": "Generate strong, secure, and memorable passwords with custom rules — length, symbols, numbers, and easy to remember."
};

// Inject translations for Free Tools Page Header
enContent['FreeToolsPage'] = {
  "title": 'Free Privacy &<br />Developer Tools<span className="text-blue-500">.</span>',
  "subtitle": "Many free tools for privacy, anonymity, and development. 100% client-side where possible — nothing leaves your browser.",
  "badge": "All Tools Free — No Registration"
};

// Tool metadata array. The labels, badges, and descs. 
// Features will remain English to prevent UI overflow or we can ignore them for brevity
enContent['ToolsList'] = {
  "SecuritySection": "🔒 Security & Identity",
  "SecurityDesc": "Stay anonymous and protect yourself online — no registration required.",
  "EncodingSection": "🔑 Encoding & Cryptography",
  "EncodingDesc": "Format, encode, decode, and hash digital signatures directly in your browser.",
  "DevSection": "🛠️ Developer Tools & Formatters",
  "DevDesc": "Powerful utilities for formatting code, diff checking, and validating regex.",
  "NetSection": "🌍 Network & Time Utilities",
  "NetDesc": "DNS query checkers, time converters, and network mapping.",

  "t_disp_lbl": "Disposable Email",
  "t_disp_desc": "Instant, secure temp email addresses. Receive real emails anonymously — no sign-up, no tracking, auto-delete after 1 hour.",
  "t_pass_lbl": "Password Generator",
  "t_pass_desc": "Generate strong, secure, and memorable passwords with custom rules — length, symbols, numbers, and easy-to-remember mode.",
  "t_id_lbl": "Identity Generator",
  "t_id_desc": "Generate a complete fictional identity — name, address, phone number, DOB, and username for 8 countries.",
  "t_breach_lbl": "Data Breach Checker",
  "t_breach_desc": "Securely verify if your email, passwords, or data have been exposed in known database leaks across the dark web.",
  "t_note_lbl": "Secure Notes",
  "t_note_desc": "Create encrypted passwords, secrets, or messages that automatically self-destruct from the server the instant they are read.",
  "t_card_lbl": "Test Card Generator",
  "t_card_desc": "Generate Luhn-valid test credit card numbers for Visa, Mastercard, Amex, Discover, JCB, and Diner's Club.",
  "t_b64_lbl": "Base64 Encoder",
  "t_b64_desc": "Encode and decode Base64 text, files, and images instantly in your browser. Supports URL-safe mode and Data URL output.",
  "t_hash_lbl": "Hash Generator",
  "t_hash_desc": "Generate cryptographic hashes instantly. Sub-millisecond computation for MD5, SHA-1, SHA-256, and SHA-512 hashes.",
  "t_jwt_lbl": "JWT Decoder",
  "t_jwt_desc": "Decode JSON Web Tokens (JWT) safely in-browser. Inspect header algorithms and payload claims instantly without network requests.",
  "t_url_lbl": "URL Encoder / Decoder",
  "t_url_desc": "Encode or decode URL-safe strings safely. Essential utility for building query parameters and parsing strict URLs.",
  "t_qr_lbl": "QR Code Generator",
  "t_qr_desc": "Generate QR codes for URLs, text, email, phone, SMS, and Wi-Fi. Custom colors, size, and error correction.",
  "t_json_lbl": "JSON Formatter",
  "t_json_desc": "Format, prettify, or minify JSON data. Validates syntax strictly and pinpoints trailing commas or JSON syntax errors.",
  "t_diff_lbl": "Diff Checker",
  "t_diff_desc": "Compare two text blocks instantly. Highlights insertions and deletions using a lightning-fast LCS string diffing engine.",
  "t_uuid_lbl": "UUID Generator",
  "t_uuid_desc": "Generate UUIDs in every version: v1 (time-based), v4 (random), v7 (time-ordered), v5 (name hash), NIL, and GUIDs.",
  "t_reg_lbl": "Regex Tester",
  "t_reg_desc": "Test Regular Expressions smoothly. Write query patterns with active string highlighters and group capture breakdown.",
  "t_col_lbl": "Color Converter",
  "t_col_desc": "Translate colors between HEX, RGB, and HSL values. Real-time swatch previews and automated harmony palette generation.",
  "t_epo_lbl": "Epoch Converter",
  "t_epo_desc": "Convert UNIX timestamps into human-readable ISO and GMT formats. Bi-directional datetime to UNIX timestamp rendering.",
  "t_ip_lbl": "IP Address Lookup",
  "t_ip_desc": "Instantly find your public IP address, ISP, ASN, exact location, and timezone. Completely free, no-log IP checker.",
  "t_dom_lbl": "Email Domain Checker",
  "t_dom_desc": "Instantly verify if any domain is configured to receive emails. Query live DNS MX records securely from your browser.",
  
  "badge_new": "New",
  "badge_free": "Free",
  "badge_core": "Core",
  "btn_launch": "Launch Tool"
};

fs.writeFileSync(enFile, JSON.stringify(enContent, null, 2));
console.log("Successfully injected free tools UI strings to en.json!");
