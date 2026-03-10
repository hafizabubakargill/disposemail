'use client';
import { useState, useCallback } from 'react';
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

// UUID v7 — time-ordered (not in uuid@9 package from npm) — implement inline
function uuidv7(): string {
  const now = Date.now();
  const timeHigh = Math.floor(now / 0x1000);
  const timeLow = now & 0xfff;
  const rand = new Uint8Array(10);
  crypto.getRandomValues(rand);
  const b = [
    (timeHigh >> 28) & 0xff,
    (timeHigh >> 20) & 0xff,
    (timeHigh >> 12) & 0xff,
    (timeHigh >> 4) & 0xff,
    ((timeHigh & 0xf) << 4) | ((timeLow >> 8) & 0xf),
    timeLow & 0xff,
    0x70 | (rand[0] & 0x0f),
    rand[1],
    0x80 | (rand[2] & 0x3f),
    rand[3],
    ...rand.slice(4),
  ];
  const hex = b.map(x => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

// UUID v5/v3 namespace SHA1 stub — proper implementation
async function uuidv5(name: string, namespace: string): Promise<string> {
  const nsBytes = namespace.replace(/-/g, '').match(/.{2}/g)!.map(b => parseInt(b, 16));
  const nameBytes = new TextEncoder().encode(name);
  const combined = new Uint8Array([...nsBytes, ...nameBytes]);
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-1', combined));
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = [...hash].map(x => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}

const NIL_UUID = '00000000-0000-0000-0000-000000000000';
const DNS_NS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL_NS = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

type VersionTab = 'v1' | 'v4' | 'v7' | 'v5' | 'nil' | 'guid';

const VERSIONS: { id: VersionTab; label: string; desc: string; color: string }[] = [
  { id: 'v1', label: 'v1', desc: 'Time-based', color: 'bg-blue-600' },
  { id: 'v4', label: 'v4', desc: 'Random', color: 'bg-violet-600' },
  { id: 'v7', label: 'v7', desc: 'Time-ordered', color: 'bg-emerald-600' },
  { id: 'v5', label: 'v5', desc: 'Name/SHA-1', color: 'bg-orange-500' },
  { id: 'nil', label: 'NIL', desc: 'Zero UUID', color: 'bg-gray-500' },
  { id: 'guid', label: 'GUID', desc: 'Windows style', color: 'bg-rose-500' },
];

function CopyBtn({ value }: { value: string }) {
  const [c, setC] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(value); setC(true); setTimeout(() => setC(false), 1500); }}
      className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
      {c ? <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
    </button>
  );
}

export default function UUIDGenerator() {
  const [tab, setTab] = useState<VersionTab>('v4');
  const [count, setCount] = useState(5);
  const [v5name, setV5name] = useState('');
  const [v5ns, setV5ns] = useState<'dns' | 'url'>('dns');
  const [results, setResults] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [uppercase, setUppercase] = useState(false);
  const [braces, setBraces] = useState(false);

  const format = (id: string) => {
    let s = uppercase ? id.toUpperCase() : id;
    if (braces) s = `{${s}}`;
    return s;
  };

  const generate = useCallback(async () => {
    let ids: string[] = [];
    if (tab === 'v1') ids = Array.from({ length: count }, () => uuidv1());
    else if (tab === 'v4') ids = Array.from({ length: count }, () => uuidv4());
    else if (tab === 'v7') ids = Array.from({ length: count }, () => uuidv7());
    else if (tab === 'v5') {
      const ns = v5ns === 'dns' ? DNS_NS : URL_NS;
      const name = v5name.trim() || 'example';
      const base = await uuidv5(name, ns);
      ids = [base]; // v5 is deterministic — same name = same UUID
    }
    else if (tab === 'nil') ids = Array.from({ length: count }, () => NIL_UUID);
    else if (tab === 'guid') ids = Array.from({ length: count }, () => `{${uuidv4().toUpperCase()}}`);
    setResults(ids);
  }, [tab, count, v5name, v5ns]);

  const copyAll = () => {
    navigator.clipboard.writeText(results.map(format).join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const v = VERSIONS.find(v => v.id === tab)!;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Version Tabs */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm">
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">UUID Version</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {VERSIONS.map(v => (
            <button key={v.id} onClick={() => { setTab(v.id); setResults([]); }}
              className={`py-2.5 px-2 rounded-xl border text-xs font-black transition-all flex flex-col items-center gap-0.5 ${tab === v.id ? `${v.color} border-transparent text-white shadow-lg` : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400 hover:border-blue-400'}`}>
              <span className="text-sm font-black">{v.label}</span>
              <span className="text-[9px] opacity-80 font-medium">{v.desc}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">
          {tab === 'v1' && 'Generated using current timestamp + MAC address (or random node). Time-based, but potentially identifiable.'}
          {tab === 'v4' && 'Randomly generated. Most widely used UUID version. No time or identity information encoded.'}
          {tab === 'v7' && 'Time-ordered random UUID (2024 standard). Sortable by creation time — ideal for database primary keys.'}
          {tab === 'v5' && 'Deterministic UUID using SHA-1 hash of a name + namespace. Same input always produces the same UUID.'}
          {tab === 'nil' && 'The NIL UUID — all bits set to zero. Used as a null/empty placeholder value.'}
          {tab === 'guid' && 'Microsoft-style GUID in Windows registry format with curly braces and uppercase hex.'}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm space-y-4">
        {tab === 'v5' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Name</label>
              <input value={v5name} onChange={e => setV5name(e.target.value)} placeholder="Enter name (e.g. example.com)"
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Namespace</label>
              <div className="flex gap-2">
                {(['dns', 'url'] as const).map(ns => (
                  <button key={ns} onClick={() => setV5ns(ns)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all ${v5ns === ns ? 'bg-orange-500 border-orange-500 text-white' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] text-gray-600 dark:text-gray-400'}`}>
                    {ns.toUpperCase()} ({ns === 'dns' ? 'domain names' : 'URLs'})
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : tab !== 'nil' ? (
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Count — {count}</label>
            <input type="range" min={1} max={20} value={count} onChange={e => setCount(+e.target.value)}
              className="w-full h-2 rounded-full accent-violet-600" />
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          {[{ label: 'UPPERCASE', state: uppercase, set: setUppercase }, { label: 'Braces { }', state: braces, set: setBraces }].map(opt => (
            <button key={opt.label} onClick={() => opt.set(!opt.state)}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${opt.state ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-4 rounded-full transition-colors relative ${opt.state ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${opt.state ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              {opt.label}
            </button>
          ))}
        </div>

        <button onClick={generate}
          className={`w-full py-4 rounded-2xl ${v.color} hover:opacity-90 active:scale-95 text-white font-black text-base transition-all shadow-lg flex items-center justify-center gap-2`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Generate {tab === 'v5' ? 'v5 UUID' : tab === 'nil' ? 'NIL UUID' : tab === 'guid' ? 'GUID' : `${count} UUID${count > 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl p-5 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{results.length} result{results.length > 1 ? 's' : ''}</p>
            <button onClick={copyAll} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedAll ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 hover:border border-gray-200'}`}>
              {copiedAll ? '✓ Copied all!' : 'Copy all'}
            </button>
          </div>
          <div className="space-y-2">
            {results.map((id, i) => (
              <div key={i} className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl px-4 py-3 font-mono text-sm text-gray-900 dark:text-white border border-gray-100 dark:border-[#2a2a2a]">
                <span className="truncate">{format(id)}</span>
                <CopyBtn value={format(id)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
