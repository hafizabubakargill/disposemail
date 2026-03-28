'use client';

import { useState, useMemo } from 'react';

export default function RegexTesterTool() {
    const [pattern, setPattern] = useState('[A-Z]\\w+');
    const [flags, setFlags] = useState('g');
    const [testString, setTestString] = useState('Hello World! This is a Regex Tester.');

    const availableFlags = ['g', 'i', 'm', 's'];

    const toggleFlag = (f: string) => {
        if (flags.includes(f)) {
            setFlags(flags.replace(f, ''));
        } else {
            setFlags(flags + f);
        }
    };

    const results = useMemo(() => {
        if (!pattern) return { matches: [], error: null, time: 0 };
        try {
            const start = performance.now();
            const re = new RegExp(pattern, flags);
            const matches = [];
            let match;
            
            // Limit matches to prevent infinite loops on empty matching patterns
            let count = 0;
            const MAX_MATCHES = 1000;

            if (flags.includes('g')) {
                while ((match = re.exec(testString)) !== null && count < MAX_MATCHES) {
                    if (match[0].length === 0) {
                        re.lastIndex++; // Prevent infinite loops
                    }
                    matches.push({
                        value: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                    count++;
                }
            } else {
                match = re.exec(testString);
                if (match) {
                    matches.push({
                        value: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                }
            }

            const end = performance.now();
            return { matches, error: null, time: (end - start).toFixed(2) };
        } catch (e: any) {
            return { matches: [], error: e.message, time: 0 };
        }
    }, [pattern, flags, testString]);

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
            
            {/* Top Bar - Expression Config */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col relative w-full h-[60px]">
                    <span className="absolute -top-3 left-4 bg-white dark:bg-[#0a0a0a] px-2 text-[10px] font-black uppercase tracking-widest text-pink-500">
                        Regular Expression
                    </span>
                    <div className="flex items-center w-full h-full px-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#2a2a2a] shadow-sm">
                        <span className="text-gray-400 font-mono font-bold mr-1">/</span>
                        <input
                            type="text"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            className="w-full bg-transparent text-gray-900 dark:text-gray-100 font-mono focus:outline-none placeholder-gray-300 dark:placeholder-gray-700"
                            placeholder="Enter pattern..."
                            spellCheck="false"
                        />
                        <span className="text-gray-400 font-mono font-bold ml-1">/</span>
                    </div>
                </div>

                <div className="flex flex-col relative w-full sm:w-[150px] shrink-0 h-[60px]">
                    <span className="absolute -top-3 left-4 bg-white dark:bg-[#0a0a0a] px-2 text-[10px] font-black uppercase tracking-widest text-pink-500">
                        Flags
                    </span>
                    <div className="flex items-center justify-between w-full h-full px-3 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#2a2a2a] shadow-sm">
                        {availableFlags.map(f => (
                            <button
                                key={f}
                                onClick={() => toggleFlag(f)}
                                className={`w-6 h-6 rounded-md font-mono text-xs font-bold transition-all ${flags.includes(f) ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {results.error && (
                <div className="bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-200 dark:border-red-900/30 p-4 rounded-2xl font-mono text-sm shadow-sm animate-in fade-in flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <span>{results.error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-h-[400px]">
                {/* Input Array */}
                <div className="flex flex-col relative w-full h-full">
                    <span className="absolute -top-3 left-4 bg-white dark:bg-[#0a0a0a] px-2 text-[10px] font-black uppercase tracking-widest text-sky-500">
                        Test String
                    </span>
                    <textarea
                        value={testString}
                        onChange={(e) => setTestString(e.target.value)}
                        className="w-full h-full min-h-[400px] p-5 pt-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#2a2a2a] text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none shadow-sm"
                        placeholder="Type text to match against..."
                        spellCheck="false"
                    />
                </div>

                {/* Match Results */}
                <div className="flex flex-col relative w-full h-full rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222] overflow-hidden">
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-[#1a1a1a] px-5 py-3 border-b border-gray-200 dark:border-[#2a2a2a]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Matches: {results.matches.length}</span>
                        {!results.error && <span className="text-[10px] font-bold text-gray-400">{results.time}ms</span>}
                    </div>
                    <div className="p-5 overflow-y-auto max-h-[400px]">
                        {results.matches.length === 0 && !results.error ? (
                            <p className="text-gray-400 font-mono text-sm">No matches found.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {results.matches.map((m, i) => (
                                    <div key={i} className="p-3 bg-white dark:bg-[#1c1c1c] border border-gray-100 dark:border-[#2a2a2a] rounded-xl font-mono text-sm">
                                        <div className="flex justify-between items-start mb-2 border-b border-gray-50 dark:border-[#2a2a2a] pb-2">
                                            <span className="text-gray-500 text-xs font-bold">Match {i + 1} <span className="font-normal">(Index: {m.index})</span></span>
                                        </div>
                                        <div className="text-emerald-600 dark:text-emerald-400 break-words mb-2">{m.value}</div>
                                        
                                        {m.groups.length > 0 && (
                                            <div className="flex flex-col gap-1 mt-2 p-2 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg text-xs">
                                                {m.groups.map((g, gi) => (
                                                    <div key={gi} className="flex gap-2">
                                                        <span className="text-pink-500">Group {gi + 1}:</span>
                                                        <span className="text-gray-700 dark:text-gray-300 break-all">{g !== undefined ? g : <span className="text-gray-400 italic">undefined</span>}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
