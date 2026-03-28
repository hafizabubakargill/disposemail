'use client';

import { useState } from 'react';

export default function JwtDecoderTool() {
    const [token, setToken] = useState('');
    const [decoded, setDecoded] = useState<{ header: any, payload: any, error: string | null }>({ header: null, payload: null, error: null });

    const handleDecode = (val: string) => {
        setToken(val);
        if (!val.trim()) {
            setDecoded({ header: null, payload: null, error: null });
            return;
        }

        try {
            const parts = val.split('.');
            if (parts.length !== 3 && parts.length !== 2) { // Allow 2 parts in case of unsecured JWTs
                throw new Error("Invalid JWT format (must have 3 parts).");
            }

            // Helper to decode Base64Url
            const decodeB64Url = (str: string) => {
                const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
                return JSON.parse(decodeURIComponent(escape(atob(base64))));
            };

            const header = decodeB64Url(parts[0]);
            const payload = decodeB64Url(parts[1]);

            setDecoded({ header, payload, error: null });
        } catch (err: any) {
            setDecoded({ header: null, payload: null, error: err.message || "Failed to parse JWT." });
        }
    };

    const renderJson = (title: string, obj: any, colorPrefix: string) => (
        <div className={`flex flex-col mb-4 p-4 bg-${colorPrefix}-50 dark:bg-${colorPrefix}-900/10 rounded-2xl border border-${colorPrefix}-200 dark:border-${colorPrefix}-900/40`}>
            <span className={`text-xs font-black uppercase tracking-widest text-${colorPrefix}-600 dark:text-${colorPrefix}-400 mb-2`}>{title}</span>
            <pre className="w-full text-slate-800 dark:text-slate-200 font-mono text-xs md:text-sm whitespace-pre-wrap word-break">
                {JSON.stringify(obj, null, 2)}
            </pre>
        </div>
    );

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 flex flex-col">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 pl-2">Encoded Token</label>
                <textarea
                    autoFocus
                    value={token}
                    onChange={(e) => handleDecode(e.target.value)}
                    className="w-full h-[400px] p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#2a2a2a] text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none break-all"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    spellCheck="false"
                />
            </div>

            <div className="w-full md:w-1/2 flex flex-col">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 pl-2">Decoded Claims</label>
                
                {decoded.error ? (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-200 dark:border-red-900/30 font-mono rounded-2xl text-sm">
                        {token ? decoded.error : "Waiting for input..."}
                    </div>
                ) : (
                    <div className="flex flex-col h-full animate-in fade-in duration-300">
                        {decoded.header && renderJson("Header (Algorithm)", decoded.header, "blue")}
                        {decoded.payload && renderJson("Payload (Data)", decoded.payload, "emerald")}
                    </div>
                )}
            </div>
        </div>
    );
}
