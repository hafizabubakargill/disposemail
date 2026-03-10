'use client';
import { useState } from 'react';

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'dinersclub';

// ─── SVG brand logos ───────────────────────────────────────────────────────────
function CardLogo({ brand, size = 'sm' }: { brand: CardBrand; size?: 'sm' | 'lg' }) {
  const h = size === 'lg' ? 'h-7' : 'h-5';
  if (brand === 'visa') return (
    <svg viewBox="0 0 750 471" className={h} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="750" height="471" rx="40" fill="white"/>
      <path d="M278.2 334.7L311 136.8h49.9l-32.8 197.8h-49.9zM524.3 140.4c-9.9-3.7-25.4-7.6-44.7-7.6-49.2 0-83.9 24.9-84.1 60.6-.3 26.4 24.7 41.1 43.6 49.9 19.3 8.9 25.8 14.6 25.7 22.5-.1 12.2-15.4 17.7-29.7 17.7-19.8 0-30.4-2.8-46.7-9.7l-6.4-2.9-7 41c11.7 5.1 33.2 9.5 55.6 9.7 52.5 0 86.5-24.6 86.9-62.7.2-20.9-13.1-36.7-41.7-49.8-17.4-8.5-28.1-14.1-27.9-22.7 0-7.6 9-15.7 28.4-15.7 16.3-.3 28 3.3 37.2 7l4.5 2.1 6.3-38.4zM611.4 136.8H582c-9.1 0-15.9 2.5-19.9 11.7L483.3 334.7h52.4s8.6-22.7 10.5-27.7h64c1.5 6.5 6.1 27.7 6.1 27.7h46.3L611.4 136.8zm-61.7 131.1c4.1-10.6 20-51.6 20-51.6-.3 0 4.1-10.7 6.6-17.6l3.4 15.9s9.5 43.9 11.5 53.3H549.7zM232.6 136.8l-48.8 135-5.2-25.6c-9.1-29.3-37.4-61.2-69.1-77.1l44.6 165.5 52.7-.1 78.5-197.8-52.7.1z" fill="#1A1F71"/>
      <path d="M154.2 136.8H74l-.7 3.6c62.5 15.2 103.8 51.8 120.9 95.8L176.3 148c-2.9-9.1-9.5-11-17.1-11.2z" fill="#F9A533"/>
    </svg>
  );
  if (brand === 'mastercard') return (
    <svg viewBox="0 0 152 95" className={h} xmlns="http://www.w3.org/2000/svg">
      <circle cx="58" cy="47.5" r="47.5" fill="#EB001B"/>
      <circle cx="94" cy="47.5" r="47.5" fill="#F79E1B"/>
      <path d="M76 13.2c9.6 7.3 15.8 18.7 15.8 31.5S85.6 70 76 77.3C66.4 70 60.2 58.6 60.2 45.8S66.4 20.5 76 13.2z" fill="#FF5F00"/>
    </svg>
  );
  if (brand === 'amex') return (
    <svg viewBox="0 0 80 26" className={h} xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="26" rx="4" fill="white"/>
      <text x="40" y="19" textAnchor="middle" fill="#006FCF" fontSize="14" fontWeight="900" fontFamily="Arial">AMEX</text>
    </svg>
  );
  if (brand === 'discover') return (
    <svg viewBox="0 0 120 38" className={h} xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="38" rx="4" fill="white"/>
      <text x="8" y="26" fill="#231F20" fontSize="16" fontWeight="bold" fontFamily="Arial">Discover</text>
      <circle cx="105" cy="19" r="14" fill="#F76E20"/>
    </svg>
  );
  if (brand === 'jcb') return (
    <svg viewBox="0 0 60 38" className={h} xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="38" rx="4" fill="white"/>
      <rect x="0" y="0" width="20" height="38" rx="4" fill="#1E3B8C"/>
      <rect x="20" y="0" width="20" height="38" fill="#E31837"/>
      <rect x="40" y="0" width="20" height="38" rx="4" fill="#007B40"/>
      <text x="30" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">JCB</text>
    </svg>
  );
  if (brand === 'dinersclub') return (
    <svg viewBox="0 0 80 38" className={h} xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="38" rx="4" fill="white"/>
      <circle cx="28" cy="19" r="16" fill="#004B87"/>
      <circle cx="36" cy="19" r="16" fill="white"/>
      <circle cx="42" cy="19" r="16" fill="#004B87" fillOpacity="0.65"/>
      <text x="62" y="24" fill="#004B87" fontSize="11" fontWeight="bold" fontFamily="Arial">DINERS</text>
    </svg>
  );
  return null;
}

// ─── Card Spec ─────────────────────────────────────────────────────────────────
interface CardSpec {
  label: string;
  color: string;
  prefixes: string[];
  length: number;
  cvvLength: number;
  format: string;
}

const CARD_SPECS: Record<CardBrand, CardSpec> = {
  visa:       { label: 'Visa',             color: 'from-blue-700 to-blue-900',     prefixes: ['4532','4916','4929','4024','4485','4716','4539'],              length: 16, cvvLength: 3, format: '#### #### #### ####' },
  mastercard: { label: 'Mastercard',        color: 'from-red-700 to-orange-700',    prefixes: ['5425','2221','5105','5301','5562','5431'],                     length: 16, cvvLength: 3, format: '#### #### #### ####' },
  amex:       { label: 'American Express',  color: 'from-teal-600 to-teal-800',     prefixes: ['371449','341134','378282','370000'],                           length: 15, cvvLength: 4, format: '#### ###### #####'   },
  discover:   { label: 'Discover',          color: 'from-orange-500 to-orange-700', prefixes: ['6011111111111','6011000990139','6011987654321'],                length: 16, cvvLength: 3, format: '#### #### #### ####' },
  jcb:        { label: 'JCB',              color: 'from-green-700 to-green-900',   prefixes: ['3530111333300000','3566002020360505','3530'],                   length: 16, cvvLength: 3, format: '#### #### #### ####' },
  dinersclub: { label: "Diner's Club",      color: 'from-gray-700 to-gray-900',     prefixes: ['30569309025904','38520000023237','36148900647913'],             length: 14, cvvLength: 3, format: '#### ###### ####'   },
};

const BRANDS = Object.keys(CARD_SPECS) as CardBrand[];

// ─── Luhn ──────────────────────────────────────────────────────────────────────
function luhnComplete(partial: string): string {
  const sum = [...partial].reverse().reduce((acc, d, i) => {
    let n = parseInt(d);
    if (i % 2 === 0) { n *= 2; if (n > 9) n -= 9; }
    return acc + n;
  }, 0);
  return partial + ((10 - (sum % 10)) % 10);
}

function randomDigit() { return String(Math.floor(Math.random() * 10)); }

function generateCard(spec: CardSpec) {
  const prefix = spec.prefixes[Math.floor(Math.random() * spec.prefixes.length)];
  const partial = prefix + Array.from({ length: spec.length - prefix.length - 1 }, randomDigit).join('');
  const fullNumber = luhnComplete(partial);
  let formatted = '', pos = 0;
  for (const ch of spec.format) formatted += ch === '#' ? (fullNumber[pos++] ?? '') : ch;
  const cvv = Array.from({ length: spec.cvvLength }, randomDigit).join('');
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const year = String(new Date().getFullYear() + 1 + Math.floor(Math.random() * 5)).slice(-2);
  return { number: fullNumber, formatted, cvv, expiry: `${month}/${year}` };
}

// ─── CopyBtn ───────────────────────────────────────────────────────────────────
function CopyBtn({ value }: { value: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(value); setC(true); setTimeout(() => setC(false), 1500); }}
      className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all shrink-0">
      {c
        ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
        : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>}
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
interface Generated { brand: CardBrand; number: string; formatted: string; cvv: string; expiry: string; }

export default function FakeCreditCardGenerator() {
  const [brand, setBrand] = useState<CardBrand>('visa');
  const [count, setCount] = useState(3);
  const [results, setResults] = useState<Generated[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => setResults(Array.from({ length: count }, () => ({ brand, ...generateCard(CARD_SPECS[brand]) })));

  const copyAll = () => {
    navigator.clipboard.writeText(results.map(r => `Card: ${r.formatted}\nExpiry: ${r.expiry}\nCVV: ${r.cvv}`).join('\n\n'));
    setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000);
  };

  const spec = CARD_SPECS[brand];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Disclaimer */}
      <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl">
        <svg className="w-5 h-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"/></svg>
        <p className="text-xs text-red-700 dark:text-red-400 font-medium leading-relaxed">
          <strong>For testing only.</strong> Luhn-valid test numbers for payment sandbox environments. <strong>NOT real card numbers</strong> — using for fraud is illegal.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Card Network</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {BRANDS.map(b => (
              <button key={b} onClick={() => setBrand(b)}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-2 transition-all ${brand === b ? `bg-gradient-to-br ${CARD_SPECS[b].color} border-transparent shadow-lg` : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] hover:border-rose-300 dark:hover:border-rose-700'}`}>
                <div className={`h-5 flex items-center justify-center rounded overflow-hidden ${brand === b ? '' : 'bg-white dark:bg-[#111] px-1'}`}>
                  <CardLogo brand={b} size="sm" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${brand === b ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>{b === 'dinersclub' ? 'Diners' : b === 'mastercard' ? 'MC' : b === 'amex' ? 'Amex' : CARD_SPECS[b].label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Count — {count}</label>
          <input type="range" min={1} max={10} value={count} onChange={e => setCount(+e.target.value)} className="w-full h-2 rounded-full accent-rose-500"/>
        </div>

        <button onClick={generate}
          className={`w-full py-4 rounded-2xl bg-gradient-to-r ${spec.color} hover:opacity-90 active:scale-95 text-white font-black text-base transition-all shadow-lg flex items-center justify-center gap-2`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          Generate {count} {spec.label} Card{count > 1 ? 's' : ''}
        </button>
      </div>

      {/* Cards */}
      {results.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{results.length} test card{results.length > 1 ? 's' : ''} generated</p>
            <button onClick={copyAll} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedAll ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}>
              {copiedAll ? '✓ Copied all!' : 'Copy all'}
            </button>
          </div>

          {results.map((r, i) => (
            <div key={i} className={`rounded-2xl bg-gradient-to-br ${CARD_SPECS[r.brand].color} p-5 text-white shadow-xl font-mono select-none`}>
              {/* Header: chip + logo */}
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-90 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5 w-6 h-5 p-0.5">
                    {[0,1,2,3].map(k => <div key={k} className="bg-yellow-600/40 rounded-sm"/>)}
                  </div>
                </div>
                <div className="h-8 bg-white/90 rounded-md px-2 flex items-center">
                  <CardLogo brand={r.brand} size="lg" />
                </div>
              </div>
              {/* Number */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-xl tracking-widest font-bold">{r.formatted}</p>
                <CopyBtn value={r.number}/>
              </div>
              {/* Expiry + CVV */}
              <div className="flex justify-between text-xs tracking-widest">
                <div>
                  <p className="text-[9px] opacity-50 mb-0.5">VALID THRU</p>
                  <div className="flex items-center gap-1 font-bold">{r.expiry}<CopyBtn value={r.expiry}/></div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] opacity-50 mb-0.5">CVV{r.cvv.length === 4 ? '2' : ''}</p>
                  <div className="flex items-center gap-1 font-bold">{r.cvv}<CopyBtn value={r.cvv}/></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
