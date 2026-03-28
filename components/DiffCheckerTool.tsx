'use client';

import { useState } from 'react';
import { diffLines } from 'diff';

export default function DiffCheckerTool() {
    const [original, setOriginal] = useState('const a = "hello";\nconsole.log(a);\n// This is old');
    const [modified, setModified] = useState('const a = "hello world";\nconsole.log(a);\n// This is new\n// added line');
    
    // We compute the diff in real-time or via button depending on performance.
    // For large texts, manual trigger is safer, but for React state, 
    // real-time diff execution natively takes <5ms usually.
    const diffResult = diffLines(original, modified);

    const additions = diffResult.filter(r => r.added).reduce((acc, r) => acc + r.count!, 0);
    const deletions = diffResult.filter(r => r.removed).reduce((acc, r) => acc + r.count!, 0);

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
            
            {/* Input Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 pl-2">Original Text</label>
                    <textarea
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                        className="w-full h-[250px] p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#2a2a2a] text-gray-800 dark:text-gray-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 rounded-2xl resize-none shadow-sm"
                        placeholder="Paste old code here..."
                        spellCheck="false"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 pl-2">Modified Text</label>
                    <textarea
                        value={modified}
                        onChange={(e) => setModified(e.target.value)}
                        className="w-full h-[250px] p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#2a2a2a] text-gray-800 dark:text-gray-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 rounded-2xl resize-none shadow-sm"
                        placeholder="Paste new code here..."
                        spellCheck="false"
                    />
                </div>
            </div>

            {/* Results Panel */}
            <div className="flex flex-col w-full mt-4 rounded-3xl bg-white dark:bg-[#111] border border-gray-200 dark:border-[#2a2a2a] shadow-lg overflow-hidden">
                <div className="flex items-center justify-between bg-gray-100 dark:bg-[#1a1a1a] px-5 py-3 border-b border-gray-200 dark:border-[#2a2a2a]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Diff Output (LCS Computed)</span>
                    <div className="flex items-center gap-3 font-mono text-xs font-bold">
                        <span className="text-green-600 dark:text-green-400">+ {additions} additions</span>
                        <span className="text-red-500 dark:text-red-400">- {deletions} deletions</span>
                    </div>
                </div>

                <div className="p-4 overflow-x-auto">
                    <pre className="font-mono text-xs md:text-sm leading-relaxed" style={{ WebkitFontSmoothing: 'antialiased' }}>
                        {diffResult.map((part, index) => {
                            if (part.added) {
                                return (
                                    <div key={index} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 border-l-4 border-green-500 w-full inline-block min-w-max">
                                        <span className="mr-2 opacity-50 select-none">+</span>
                                        {part.value.replace(/\n$/, '')}
                                    </div>
                                );
                            }
                            if (part.removed) {
                                return (
                                    <div key={index} className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-0.5 border-l-4 border-red-500 w-full inline-block min-w-max line-through decoration-red-500/50">
                                        <span className="mr-2 opacity-50 select-none">-</span>
                                        {part.value.replace(/\n$/, '')}
                                    </div>
                                );
                            }
                            return (
                                <div key={index} className="text-gray-600 dark:text-gray-400 px-2 py-0.5 border-l-4 border-transparent w-full inline-block min-w-max">
                                    <span className="mr-2 opacity-30 select-none"> </span>
                                    {part.value.replace(/\n$/, '')}
                                </div>
                            );
                        })}
                    </pre>
                </div>
            </div>
        </div>
    );
}
