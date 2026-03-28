'use client';

import { useState } from 'react';

export default function JsonFormatterTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [activeIndent, setActiveIndent] = useState<number | null>(null);

    const format = (spaces: number | null) => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            const formatted = spaces === null ? JSON.stringify(parsed) : JSON.stringify(parsed, null, spaces);
            setOutput(formatted);
            setError(null);
            setActiveIndent(spaces);
        } catch (err: any) {
            setError(err.message || 'Invalid JSON Syntax');
            setOutput('');
        }
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-center gap-3 bg-gray-100 dark:bg-[#1a1a1a] p-2 rounded-2xl w-full max-w-[500px] mx-auto border border-gray-200 dark:border-[#2a2a2a]">
                <button
                    onClick={() => format(2)}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeIndent === 2 && !error ? 'bg-white dark:bg-[#2c2c2c] text-yellow-600 dark:text-yellow-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    2 Spaces
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                <button
                    onClick={() => format(4)}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeIndent === 4 && !error ? 'bg-white dark:bg-[#2c2c2c] text-yellow-600 dark:text-yellow-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    4 Spaces
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                <button
                    onClick={() => format(null)}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeIndent === null && output && !error ? 'bg-white dark:bg-[#2c2c2c] text-yellow-600 dark:text-yellow-400 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    Minify
                </button>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-200 dark:border-red-900/30 p-4 rounded-2xl font-mono text-sm shadow-sm animate-in fade-in flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-[500px]">
                {/* Input */}
                <div className="flex flex-col relative w-full h-full">
                    <span className="absolute -top-3 left-4 bg-white dark:bg-[#0a0a0a] px-2 text-[10px] font-black uppercase tracking-widest text-yellow-500">
                        Input JSON
                    </span>
                    <textarea
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`w-full h-full p-5 pt-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none resize-none shadow-sm ${error ? 'border-red-400 dark:border-red-500/50 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 dark:border-[#2a2a2a] focus:ring-2 focus:ring-yellow-500/50'}`}
                        placeholder='{"hello": "world"}'
                        spellCheck="false"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col relative w-full h-full">
                    <span className="absolute -top-3 left-4 bg-white dark:bg-[#0a0a0a] px-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        {activeIndent === null ? 'Minified Output' : 'Formatted Output'}
                    </span>
                    <textarea
                        readOnly
                        value={output}
                        className="w-full h-full p-5 pt-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222] text-slate-800 dark:text-slate-200 font-mono text-sm focus:outline-none resize-none shadow-inner"
                        placeholder="Parsed output will appear here..."
                        spellCheck="false"
                    />
                    
                    <button onClick={handleCopy} disabled={!output} className="absolute bottom-5 right-5 bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-full shadow-lg disabled:opacity-0 transition-all scale-95 hover:scale-105 active:scale-95">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
