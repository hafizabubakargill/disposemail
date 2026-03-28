'use client';

import { useState, useEffect } from 'react';

export default function HashGeneratorTool() {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState({ sha1: '', sha256: '', sha512: '' });
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        async function computeHashes() {
            if (!input) {
                setHashes({ sha1: '', sha256: '', sha512: '' });
                return;
            }
            try {
                const encoder = new TextEncoder();
                const data = encoder.encode(input);

                const compute = async (algo: string) => {
                    const hashBuffer = await crypto.subtle.digest(algo, data);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                };

                const [sha1, sha256, sha512] = await Promise.all([
                    compute('SHA-1'),
                    compute('SHA-256'),
                    compute('SHA-512')
                ]);

                setHashes({ sha1, sha256, sha512 });
            } catch (e) {
                console.error("Hashing failed:", e);
            }
        }
        computeHashes();
    }, [input]);

    const handleCopy = (hash: string, type: string) => {
        if (!hash) return;
        navigator.clipboard.writeText(hash);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const hashBox = (title: string, value: string, type: string) => (
        <div className="flex flex-col mb-4 p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222]">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</span>
                <button
                    onClick={() => handleCopy(value, type)}
                    disabled={!value}
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md transition-all ${copied === type ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-slate-200 dark:bg-[#222] text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-[#333]'} disabled:opacity-50`}
                >
                    {copied === type ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="w-full text-slate-900 dark:text-slate-100 font-mono text-xs md:text-sm break-all">
                {value || <span className="text-gray-400 dark:text-gray-600">Waiting for input...</span>}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 pl-2">Enter Cleartext to Hash</label>
                <textarea
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-[300px] p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#2a2a2a] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/50 resize-none shadow-sm"
                    placeholder="Type or paste your text here..."
                />
                <div className="flex items-center gap-2 mt-3 px-2">
                    <span className="text-xs font-bold text-gray-400">Byte Length: <span className="text-gray-900 dark:text-white">{new TextEncoder().encode(input).length} bytes</span></span>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 pl-2">Generated Hashes</label>
                <div className="p-1">
                    {hashBox("SHA-256 (Recommended)", hashes.sha256, "sha256")}
                    {hashBox("SHA-512 (High Security)", hashes.sha512, "sha512")}
                    {hashBox("SHA-1 (Legacy / Git)", hashes.sha1, "sha1")}
                </div>
            </div>
        </div>
    );
}
