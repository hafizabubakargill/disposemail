'use client';

import { useState } from 'react';

export default function UrlEncoderTool() {
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [input, setInput] = useState('');

    const output = (() => {
        if (!input) return '';
        try {
            return mode === 'encode' 
                ? encodeURIComponent(input)
                : decodeURIComponent(input);
        } catch (e) {
            return "Error parsing invalid URI sequence.";
        }
    })();

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col">
            
            {/* Toggle Bar */}
            <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1.5 rounded-2xl w-full max-w-[240px] mx-auto mb-8 border border-gray-200 dark:border-[#2a2a2a]">
                <button
                    onClick={() => setMode('encode')}
                    className={`flex-1 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'encode' ? 'bg-white dark:bg-[#2c2c2c] text-sky-600 dark:text-sky-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    Encode
                </button>
                <button
                    onClick={() => setMode('decode')}
                    className={`flex-1 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'decode' ? 'bg-white dark:bg-[#2c2c2c] text-sky-600 dark:text-sky-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    Decode
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Input */}
                <div className="flex flex-col relative w-full h-[300px]">
                    <span className="absolute -top-3 left-4 bg-white dark:bg-[#0a0a0a] px-2 text-[10px] font-black uppercase tracking-widest text-sky-500">
                        Input
                    </span>
                    <textarea
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-full p-5 pt-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#2a2a2a] text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none shadow-sm"
                        placeholder={mode === 'encode' ? "https://example.com/?query=hello world" : "https%3A%2F%2Fexample.com%2F... "}
                    />
                    <div className="absolute bottom-4 right-5 text-[10px] font-bold text-gray-400 bg-white/80 dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">
                        {input.length} chars
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col relative w-full h-[300px]">
                    <span className="absolute -top-3 left-4 bg-white dark:bg-[#0a0a0a] px-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        Output
                    </span>
                    <textarea
                        readOnly
                        value={output}
                        className={`w-full h-full p-5 pt-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222] text-sm focus:outline-none resize-none shadow-inner ${output.startsWith('Error') ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}
                    />
                    <div className="absolute bottom-4 right-5 text-[10px] font-bold text-gray-400 bg-white/80 dark:bg-black/80 px-2 py-1 rounded backdrop-blur-sm">
                        {output.length} chars
                    </div>
                    {/* Floating Action Button */}
                    <button onClick={handleCopy} disabled={!output || output.startsWith('Error')} className="absolute bottom-4 left-4 bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-full shadow-lg disabled:opacity-0 transition-all scale-95 hover:scale-105 active:scale-95">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    </button>
                </div>
            </div>
            
        </div>
    );
}
