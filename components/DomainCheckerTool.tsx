'use client';
import { useState } from 'react';

interface MXRecord {
    exchange: string;
    preference: number;
}

interface DnsResponse {
    Status: number;
    Answer?: {
        name: string;
        type: number;
        data: string;
    }[];
}

export default function DomainCheckerTool() {
    const [domain, setDomain] = useState('');
    const [records, setRecords] = useState<MXRecord[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState<'idle' | 'valid' | 'invalid' | 'no-mx'>('idle');

    const cleanDomain = (input: string) => {
        let d = input.trim().toLowerCase();
        d = d.replace(/^https?:\/\//, '');
        d = d.split('/')[0];
        if (d.includes('@')) d = d.split('@')[1];
        return d;
    };

    const checkDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetDomain = cleanDomain(domain);
        if (!targetDomain) return;

        setDomain(targetDomain);
        setLoading(true);
        setError('');
        setRecords(null);
        setStatus('idle');

        try {
            // Use Cloudflare DNS-over-HTTPS
            // Type 15 is MX record
            const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(targetDomain)}&type=15`, {
                headers: { 'Accept': 'application/dns-json' }
            });

            if (!res.ok) throw new Error('DNS query failed');
            const json: DnsResponse = await res.json();

            // Status 0 is NOERROR, 3 is NXDOMAIN (domain doesn't exist)
            if (json.Status === 3) {
                setStatus('invalid');
                setError(`Domain "${targetDomain}" does not exist.`);
                return;
            }

            if (!json.Answer || json.Answer.length === 0) {
                setStatus('no-mx');
                return;
            }

            // Cloudflare returns MX data as strings like "10 mail.example.com."
            const mxRecords: MXRecord[] = json.Answer
                .filter(a => a.type === 15) // Double check it's an MX record
                .map(a => {
                    const parts = a.data.split(' ');
                    // Handle formats: "10 mail.example.com." or just "mail.example.com."
                    if (parts.length === 2 && !isNaN(Number(parts[0]))) {
                        return { preference: Number(parts[0]), exchange: parts[1].replace(/\.$/, '') };
                    }
                    return { preference: 0, exchange: a.data.replace(/\.$/, '') };
                })
                .sort((a, b) => a.preference - b.preference);

            if (mxRecords.length > 0) {
                setRecords(mxRecords);
                setStatus('valid');
            } else {
                setStatus('no-mx');
            }
        } catch (err: any) {
            setError('Failed to check domain. Please try again.');
            setStatus('idle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 md:p-8 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 mx-auto flex items-center justify-center text-3xl mb-6 shadow-lg rotate-3 cursor-default hover:rotate-6 transition-transform">
                    {status === 'valid' ? '✅' : status === 'invalid' ? '❌' : status === 'no-mx' ? '⚠️' : '🌐'}
                </div>
                
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">Check Email Capabilities</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Enter any domain or email address to instantly query its DNS MX records and see if it can receive emails.</p>

                <form onSubmit={checkDomain} className="relative max-w-xl mx-auto mb-8">
                    <input 
                        type="text" 
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        placeholder="e.g. gmail.com or user@company.com" 
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl pl-5 pr-32 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                    />
                    <button type="submit" disabled={loading || !domain.trim()} className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Checking...' : 'Check'}
                    </button>
                </form>

                {error && (
                    <div className="text-red-500 bg-red-50 dark:bg-red-900/10 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {status === 'no-mx' && (
                    <div className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 px-6 py-4 rounded-2xl border border-amber-200 dark:border-amber-900/30 text-left animate-in fade-in slide-in-from-top-2">
                        <h3 className="font-black text-lg mb-1 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            No Mail Servers Found
                        </h3>
                        <p className="text-sm">The domain <strong>{domain}</strong> exists, but it has no MX (Mail Exchange) records configured. This means it <strong>cannot receive emails</strong>.</p>
                    </div>
                )}

                {status === 'valid' && records && (
                    <div className="animate-in fade-in slide-in-from-top-2 text-left">
                        <div className="bg-green-50 dark:bg-green-900/10 px-6 py-4 rounded-2xl border border-green-200 dark:border-green-900/30 mb-6 flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <h3 className="font-black text-green-700 dark:text-green-400 text-lg mb-1">Domain can receive emails</h3>
                                <p className="text-sm text-green-600 dark:text-green-500"><strong>{domain}</strong> is properly configured with {records.length} Mail Exchange (MX) record{records.length !== 1 ? 's' : ''}.</p>
                            </div>
                        </div>

                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 px-2">MX Records (Priority Order)</h4>
                        <div className="space-y-2">
                            {records.map((rec, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded text-xs font-black bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0" title={`Priority: ${rec.preference}`}>
                                            {rec.preference}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate font-mono">{rec.exchange}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(rec.exchange)}
                                        className="p-2 text-gray-400 hover:text-indigo-500 transition-colors shrink-0"
                                        title="Copy Server Hostname"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 rounded-3xl border border-dashed border-gray-200 dark:border-[#2a2a2a] bg-transparent text-center">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">How it works</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto">
                    This tool queries Cloudflare's secure DNS-over-HTTPS (DoH) API directly from your browser to anonymously look up MX (Mail Exchange) records. 
                    No logs are stored, and queries are fast, encrypted, and entirely client-side.
                </p>
            </div>
        </div>
    );
}
