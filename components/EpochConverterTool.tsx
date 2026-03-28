'use client';

import { useState, useEffect } from 'react';

export default function EpochConverterTool() {
    const [currentSec, setCurrentSec] = useState(Math.floor(Date.now() / 1000));
    
    // Convert Epoch to Human State
    const [inputEpoch, setInputEpoch] = useState<string>('');
    const [parsedDate, setParsedDate] = useState<Date | null>(null);

    // Convert Human to Epoch State
    const [inputHuman, setInputHuman] = useState<string>('');
    const [parsedEpoch, setParsedEpoch] = useState<number | null>(null);

    // Tick the clock
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSec(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Handle Epoch -> Human parsing
    useEffect(() => {
        if (!inputEpoch) {
            setParsedDate(null);
            return;
        }
        let val = Number(inputEpoch);
        if (isNaN(val)) {
            setParsedDate(null);
            return;
        }
        // Auto-detect seconds vs milliseconds (if length >= 12, assume ms)
        if (inputEpoch.length < 12) {
            val *= 1000;
        }
        const d = new Date(val);
        setParsedDate(isNaN(d.getTime()) ? null : d);
    }, [inputEpoch]);

    // Handle Human -> Epoch parsing
    useEffect(() => {
        if (!inputHuman) {
            setParsedEpoch(null);
            return;
        }
        const d = new Date(inputHuman);
        if (!isNaN(d.getTime())) {
            setParsedEpoch(Math.floor(d.getTime() / 1000));
        } else {
            setParsedEpoch(null);
        }
    }, [inputHuman]);

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-10">
            
            {/* Live Clock Header */}
            <div className="flex flex-col items-center justify-center p-8 bg-amber-50 dark:bg-[#1a1500] rounded-3xl border border-amber-200 dark:border-amber-900/30 text-center">
                <span className="text-xs font-black uppercase tracking-widest text-amber-500 mb-2">Current UNIX Epoch Time</span>
                <div className="text-5xl md:text-7xl font-mono font-bold text-gray-900 dark:text-amber-400 tracking-tight">
                    {currentSec}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                
                {/* Epoch to Human */}
                <div className="flex flex-col bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm overflow-hidden relative">
                    <span className="absolute -top-3 left-4 bg-white dark:bg-[#0a0a0a] px-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        Convert Timestamp to Date
                    </span>
                    
                    <label className="text-xs font-bold text-gray-500 mb-2 mt-2">Enter Epoch (Seconds or Milliseconds)</label>
                    <input
                        type="text"
                        value={inputEpoch}
                        onChange={(e) => setInputEpoch(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] p-4 text-gray-900 dark:text-gray-100 font-mono text-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-2xl mb-6 shadow-inner"
                        placeholder="e.g. 1774390000"
                    />

                    {parsedDate ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-gray-400">Local Time</span>
                                <span className="text-gray-900 dark:text-white font-mono text-sm">{parsedDate.toString()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-gray-400">UTC / GMT</span>
                                <span className="text-gray-900 dark:text-white font-mono text-sm">{parsedDate.toUTCString()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-gray-400">ISO 8601</span>
                                <span className="text-gray-900 dark:text-white font-mono text-sm">{parsedDate.toISOString()}</span>
                            </div>
                            <div className="flex flex-col pt-3 border-t border-gray-100 dark:border-[#222]">
                                <span className="text-[10px] font-black uppercase text-amber-500">Relative Delta</span>
                                <span className="text-gray-900 dark:text-amber-400 font-mono text-sm">
                                    {((parsedDate.getTime() - Date.now()) / 1000 / 60 / 60 / 24).toFixed(2)} days {parsedDate.getTime() > Date.now() ? 'in the future' : 'ago'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-mono border border-dashed border-gray-200 dark:border-[#222] rounded-2xl min-h-[150px]">
                            Awaiting valid timestamp...
                        </div>
                    )}
                </div>

                {/* Human to Epoch */}
                <div className="flex flex-col bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-[#2a2a2a] p-6 shadow-sm overflow-hidden relative">
                    <span className="absolute -top-3 left-4 bg-white dark:bg-[#0a0a0a] px-2 text-[10px] font-black uppercase tracking-widest text-sky-500">
                        Convert Date to Timestamp
                    </span>
                    
                    <label className="text-xs font-bold text-gray-500 mb-2 mt-2">Enter Human Readable Date String</label>
                    <textarea
                        value={inputHuman}
                        onChange={(e) => setInputHuman(e.target.value)}
                        className="w-full h-[70px] bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] p-4 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-2xl mb-6 shadow-inner resize-none"
                        placeholder="e.g. 2026-10-31T00:00:00Z  or  October 31, 2026"
                    />

                    {parsedEpoch ? (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center py-6 bg-slate-50 dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-[#222]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">UNIX Epoch (Seconds)</span>
                                <span className="text-3xl font-mono font-bold text-sky-600 dark:text-sky-400">{parsedEpoch}</span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(parsedEpoch.toString())}
                                    className="mt-3 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 rounded-md hover:bg-sky-200 dark:hover:bg-sky-800/40 transition-colors"
                                >
                                    Copy Seconds
                                </button>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Epoch Milliseconds</span>
                                <span className="text-lg font-mono font-bold text-gray-600 dark:text-gray-400">{parsedEpoch * 1000}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-mono border border-dashed border-gray-200 dark:border-[#222] rounded-2xl min-h-[150px]">
                            Awaiting valid date string...
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
