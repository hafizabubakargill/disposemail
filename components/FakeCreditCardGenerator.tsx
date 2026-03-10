'use client';
import { useState } from 'react';

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'dinersclub';

interface CardSpec {
  label: string;
  logo: string;
  color: string;
  prefixes: string[];
  length: number;
  cvvLength: number;
  format: string; // # = digit group position
}

const CARD_SPECS: Record<CardBrand, CardSpec> = {
  visa: {
    label: 'Visa', logo: 'VISA', color: 'from-blue-700 to-blue-900',
    prefixes: ['4532','4916','4929','4024','4485','4716','4539'],
    length: 16, cvvLength: 3, format: '#### #### #### ####',
  },
  mastercard: {
    label: 'Mastercard', logo: 'MC', color: 'from-red-700 to-orange-700',
    prefixes: ['5425','2221','5105','5301','5562','5431'],
    length: 16, cvvLength: 3, format: '#### #### #### ####',
  },
  amex: {
    label: 'American Express', logo: 'AMEX', color: 'from-teal-600 to-teal-800',
    prefixes: ['371449','341134','378282','370000'],
    length: 15, cvvLength: 4, format: '#### ###### #####',
  },
  discover: {
    label: 'Discover', logo: 'DISC', color: 'from-orange-500 to-orange-700',
    prefixes: ['6011111111111','6011000990139','6011987654321'],
    length: 16, cvvLength: 3, format: '#### #### #### ####',
  },
  jcb: {
    label: 'JCB', logo: 'JCB', color: 'from-green-700 to-green-900',
    prefixes: ['3530111333300000','3566002020360505','3530'],
    length: 16, cvvLength: 3, format: '#### #### #### ####',
  },
  dinersclub: {
    label: "Diner's Club", logo: 'DC', color: 'from-gray-700 to-gray-900',
    prefixes: ['30569309025904','38520000023237','36148900647913'],
    length: 14, cvvLength: 3, format: '#### ###### ####',
  },
};

const BRANDS = Object.keys(CARD_SPECS) as CardBrand[];

// Luhn algorithm — generate a valid number
function luhnComplete(partial: string): string {
  const doubled = [...partial].reverse().map((d, i) => {
    let n = parseInt(d);
    if (i % 2 === 0) { n *= 2; if (n > 9) n -= 9; }
    return n;
  });
  const sum = doubled.reduce((a, b) => a + b, 0);
  const check = (10 - (sum % 10)) % 10;
  return partial + check;
}

function randomDigit() { return String(Math.floor(Math.random() * 10)); }

function generateCard(spec: CardSpec): { number: string; formatted: string; cvv: string; expiry: string } {
  const prefix = spec.prefixes[Math.floor(Math.random() * spec.prefixes.length)];
  const partial = prefix + Array.from({ length: spec.length - prefix.length - 1 }, randomDigit).join('');
  const fullNumber = luhnComplete(partial);
  
  // Format
  let formatted = '';
  let pos = 0;
  for (const ch of spec.format) {
    if (ch === '#') { formatted += fullNumber[pos++] ?? ''; }
    else formatted += ch;
  }

  const cvv = Array.from({ length: spec.cvvLength }, randomDigit).join('');
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const year = String(new Date().getFullYear() + 1 + Math.floor(Math.random() * 5)).slice(-2);
  return { number: fullNumber, formatted, cvv, expiry: `${month}/${year}` };
}

function CopyBtn({ value, sm }: { value: string; sm?: boolean }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(value); setC(true); setTimeout(() => setC(false), 1500); }}
      className={`${sm ? 'p-1' : 'p-2'} rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all`}>
      {c ? <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
    </button>
  );
}

interface Generated { brand: CardBrand; number: string; formatted: string; cvv: string; expiry: string; }

export default function FakeCreditCardGenerator() {
  const [brand, setBrand] = useState<CardBrand>('visa');
  const [count, setCount] = useState(3);
  const [results, setResults] = useState<Generated[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    const spec = CARD_SPECS[brand];
    setResults(Array.from({ length: count }, () => ({ brand, ...generateCard(spec) })));
  };

  const copyAll = () => {
    const text = results.map(r =>
      `Card: ${r.formatted}\nExpiry: ${r.expiry}\nCVV: ${r.cvv}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const spec = CARD_SPECS[brand];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Disclaimer */}
      <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl">
        <svg className="w-5 h-5 shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
        <p className="text-xs text-red-700 dark:text-red-400 font-medium leading-relaxed">
          <strong>For testing only.</strong> These are Luhn-valid test numbers recognized by payment processors in sandbox/test mode. They are <strong>NOT real card numbers</strong> and cannot be used for actual purchases. Using them for fraud is illegal.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Card Network</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {BRANDS.map(b => (
              <button key={b} onClick={() => setBrand(b)}
                className={`py-2.5 px-2 rounded-xl border text-xs font-black transition-all ${brand === b ? `bg-gradient-to-br ${CARD_SPECS[b].color} border-transparent text-white shadow-lg` : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:border-rose-300'}`}>
                {CARD_SPECS[b].logo}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Count — {count}</label>
          <input type="range" min={1} max={10} value={count} onChange={e => setCount(+e.target.value)} className="w-full h-2 rounded-full accent-rose-500" />
        </div>

        <button onClick={generate}
          className={`w-full py-4 rounded-2xl bg-gradient-to-r ${spec.color} hover:opacity-90 active:scale-95 text-white font-black text-base transition-all shadow-lg flex items-center justify-center gap-2`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          Generate {count} {spec.label} Card{count > 1 ? 's' : ''}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{results.length} test card{results.length > 1 ? 's' : ''} generated</p>
            <button onClick={copyAll} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedAll ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400'}`}>
              {copiedAll ? '✓ Copied!' : 'Copy all'}
            </button>
          </div>

          {results.map((r, i) => (
            <div key={i} className={`rounded-2xl bg-gradient-to-br ${CARD_SPECS[r.brand].color} p-5 text-white shadow-xl`}>
              {/* Card visual */}
              <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-7 bg-yellow-300 rounded-md opacity-80" /> {/* chip */}
                <span className="text-sm font-black tracking-widest opacity-90">{CARD_SPECS[r.brand].logo}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-mono font-bold tracking-widest">{r.formatted}</p>
                <CopyBtn value={r.number} />
              </div>
              <div className="flex justify-between mt-4 text-xs font-bold tracking-widest opacity-80">
                <div>
                  <p className="text-[9px] opacity-60 mb-0.5">EXPIRES</p>
                  <div className="flex items-center gap-1">{r.expiry}<CopyBtn value={r.expiry} /></div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] opacity-60 mb-0.5">CVV</p>
                  <div className="flex items-center gap-1">{r.cvv}<CopyBtn value={r.cvv} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
