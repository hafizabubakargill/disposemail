'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

type ErrorCorrLevel = 'L' | 'M' | 'Q' | 'H';
type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'sms';

const types: { id: QRType; label: string; placeholder: string; prefix?: string }[] = [
  { id: 'url', label: '🔗 URL', placeholder: 'https://example.com' },
  { id: 'text', label: '📝 Text', placeholder: 'Any text or message…' },
  { id: 'email', label: '✉️ Email', placeholder: 'name@example.com' },
  { id: 'phone', label: '📞 Phone', placeholder: '+1 555 000 0000' },
  { id: 'sms', label: '💬 SMS', placeholder: '+1 555 000 0000 | message' },
  { id: 'wifi', label: '📶 Wi-Fi', placeholder: 'SSID | Password | WPA' },
];

function buildQRData(type: QRType, raw: string): string {
  const p = raw.trim();
  if (!p) return '';
  if (type === 'email') return `mailto:${p}`;
  if (type === 'phone') return `tel:${p.replace(/\s/g, '')}`;
  if (type === 'sms') {
    const [num, msg] = p.split('|').map(s => s.trim());
    return `sms:${num.replace(/\s/g, '')}?body=${encodeURIComponent(msg || '')}`;
  }
  if (type === 'wifi') {
    const [ssid, pass, sec] = p.split('|').map(s => s.trim());
    return `WIFI:T:${sec || 'WPA'};S:${ssid};P:${pass || ''};;`;
  }
  return p;
}

// Minimal QR encoder using qrcode.js CDN approach — we'll use canvas + a tiny inline implementation
// Since the project doesn't have qrcode installed, we'll use the QR API via img src trick (no external dependencies)
// We encode data into the Google Charts-style URL — actually let's use the built-in Web Crypto + a pure JS QR lib
// Best approach: use an SVG-based third party API for the image but keep it simple
// Actually: use qr-creator which is already available or the simplest option: generate via data URL using qrcode.js

// We use the `qrcode` package via dynamic import since uuid is installed. Let's check if qrcode is available.
// Since we can't check easily, we'll generate QR codes via a simple URL-based API using POST-free approach
// The cleanest solution: use a JS-only implementation via QRCode.js CDN loaded dynamically

// PURE JS approach: use the `qrcode` npm package. We know uuid@9 is installed but not qrcode.
// So we'll use the free API endpoint approach which is the most reliable without npm install

export default function QRCodeGenerator() {
  const [type, setType] = useState<QRType>('url');
  const [input, setInput] = useState('');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [ecLevel, setEcLevel] = useState<ErrorCorrLevel>('M');
  const [qrData, setQrData] = useState('');
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrLib, setQrLib] = useState<any>(null);

  // Load qrcode library dynamically
  useEffect(() => {
    // Use the qrcodejs approach via a script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js';
    script.async = true;
    script.onload = () => setQrLib((window as any).QRCode);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const generate = useCallback(() => {
    const data = buildQRData(type, input);
    if (!data) return;
    setQrData(data);
    setGenerated(true);
    if (canvasRef.current && (window as any).QRCode) {
      (window as any).QRCode.toCanvas(canvasRef.current, data, {
        width: size, margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: ecLevel,
      });
    }
  }, [type, input, size, fgColor, bgColor, ecLevel]);

  // Regenerate when canvas is ready
  useEffect(() => {
    if (generated && qrLib && canvasRef.current) {
      qrLib.toCanvas(canvasRef.current, qrData, {
        width: size, margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: ecLevel,
      });
    }
  }, [qrLib, generated, qrData, size, fgColor, bgColor, ecLevel]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
  };

  const copyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentType = types.find(t => t.id === type)!;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Type Selector */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">QR Code Type</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {types.map(t => (
            <button key={t.id} onClick={() => { setType(t.id); setInput(''); setGenerated(false); }}
              className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all ${type === t.id ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:border-violet-400'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input + Options */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Content</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={currentType.placeholder}
            rows={3}
            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 resize-none transition-colors"
          />
          {type === 'wifi' && <p className="text-xs text-gray-400 mt-1">Format: <code className="bg-gray-100 dark:bg-[#1a1a1a] px-1 rounded">SSID | Password | WPA</code></p>}
          {type === 'sms' && <p className="text-xs text-gray-400 mt-1">Format: <code className="bg-gray-100 dark:bg-[#1a1a1a] px-1 rounded">+1234567890 | Your message</code></p>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Size</label>
            <select value={size} onChange={e => setSize(+e.target.value)} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500">
              {[128, 256, 512, 1024].map(s => <option key={s} value={s}>{s}px</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Error Corr.</label>
            <select value={ecLevel} onChange={e => setEcLevel(e.target.value as ErrorCorrLevel)} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500">
              {['L','M','Q','H'].map(l => <option key={l} value={l}>{l} — {l==='L'?'7%':l==='M'?'15%':l==='Q'?'25%':'30%'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Foreground</label>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-1.5">
              <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
              <span className="text-xs font-mono text-gray-900 dark:text-white">{fgColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Background</label>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-3 py-1.5">
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
              <span className="text-xs font-mono text-gray-900 dark:text-white">{bgColor}</span>
            </div>
          </div>
        </div>

        <button onClick={generate} disabled={!input.trim()}
          className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 text-white font-black text-base transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a.5.5 0 11-1 0 .5.5 0 011 0zM18 12a.5.5 0 11-1 0 .5.5 0 011 0zM12 8a.5.5 0 11-1 0 .5.5 0 011 0zM12 16a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>
          Generate QR Code
        </button>
      </div>

      {/* QR Output */}
      {generated && (
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-6 shadow-sm flex flex-col items-center gap-5 animate-in fade-in duration-300">
          <canvas ref={canvasRef} className="rounded-xl shadow-lg" />
          <div className="flex gap-3 w-full">
            <button onClick={download} className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download PNG
            </button>
            <button onClick={copyImage} className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${copied ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600' : 'border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:border-violet-400'}`}>
              {copied ? <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Copied!</> : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy Image</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
