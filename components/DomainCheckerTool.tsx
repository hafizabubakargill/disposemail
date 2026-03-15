'use client';
import { useState } from 'react';

// Cloudflare DNS types
const DNS_TYPES = { A: 1, AAAA: 28, MX: 15, TXT: 16, NS: 2 };

interface MXRecord { exchange: string; preference: number; }
interface ARecord { address: string; }
interface AAAARecord { address: string; }
interface TXTRecord { text: string; }

interface NSRecord { target: string; }
interface AllRecords {
    mx: MXRecord[];
    a: ARecord[];
    aaaa: AAAARecord[];
    txt: TXTRecord[];
    ns: NSRecord[];
}

export default function DomainCheckerTool() {
    const [domain, setDomain] = useState('');
    const [records, setRecords] = useState<AllRecords | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'invalid'>('idle');

    const cleanDomain = (input: string) => {
        let d = input.trim().toLowerCase();
        d = d.replace(/^https?:\/\//, '');
        d = d.split('/')[0];
        if (d.includes('@')) d = d.split('@')[1];
        return d;
    };

    const fetchDnsRecord = async (targetDomain: string, type: number) => {
        try {
            const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(targetDomain)}&type=${type}`, {
                headers: { 'Accept': 'application/dns-json' }
            });
            if (!res.ok) return null;
            const json = await res.json();
            // Status 3 is NXDOMAIN (doesn't exist)
            if (json.Status === 3) throw new Error('NXDOMAIN');
            return json.Answer || [];
        } catch (e) {
            return null;
        }
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
            // Fetch A, AAAA, MX, and TXT concurrently for fast speed
            const [aAns, aaaaAns, mxAns, txtAns, nsAns] = await Promise.all([
                fetchDnsRecord(targetDomain, DNS_TYPES.A),
                fetchDnsRecord(targetDomain, DNS_TYPES.AAAA),
                fetchDnsRecord(targetDomain, DNS_TYPES.MX),
                fetchDnsRecord(targetDomain, DNS_TYPES.TXT),
                fetchDnsRecord(targetDomain, DNS_TYPES.NS)
            ]);

            // If ALL returned null, the domain likely doesn't exist
            if (aAns === null && aaaaAns === null && mxAns === null && txtAns === null && nsAns === null) {
                setStatus('invalid');
                setError(`Domain "${targetDomain}" might not exist or couldn't be resolved.`);
                setLoading(false);
                return;
            }

            const parsedRecords: AllRecords = {
                mx: [], a: [], aaaa: [], txt: [], ns: []
            };

            // Parse A (IPv4)
            if (aAns && Array.isArray(aAns)) {
                parsedRecords.a = aAns.filter((r: any) => r.type === DNS_TYPES.A).map((r: any) => ({ address: r.data }));
            }
            
            // Parse AAAA (IPv6)
            if (aaaaAns && Array.isArray(aaaaAns)) {
                parsedRecords.aaaa = aaaaAns.filter((r: any) => r.type === DNS_TYPES.AAAA).map((r: any) => ({ address: r.data }));
            }

            // Parse MX (Mail)
            if (mxAns && Array.isArray(mxAns)) {
                parsedRecords.mx = mxAns.filter((r: any) => r.type === DNS_TYPES.MX).map((r: any) => {
                    const parts = r.data.split(' ');
                    if (parts.length === 2 && !isNaN(Number(parts[0]))) {
                        return { preference: Number(parts[0]), exchange: parts[1].replace(/\.$/, '') };
                    }
                    return { preference: 0, exchange: r.data.replace(/\.$/, '') };
                }).sort((a, b) => a.preference - b.preference);
            }

            // Parse TXT (SPF/DMARC/Verifs)
            if (txtAns && Array.isArray(txtAns)) {
                parsedRecords.txt = txtAns.filter((r: any) => r.type === DNS_TYPES.TXT).map((r: any) => ({ 
                    // Cloudflare often wraps TXT data in double quotes. Remove them cleanly.
                    text: r.data.replace(/^"|"$/g, '') 
                }));
            }

            // Parse NS (Nameservers)
            if (nsAns && Array.isArray(nsAns)) {
                parsedRecords.ns = nsAns.filter((r: any) => r.type === DNS_TYPES.NS).map((r: any) => ({ target: r.data.replace(/\.$/, '') }));
            }

            setRecords(parsedRecords);
            setStatus('success');
        } catch (err: any) {
            setError('Failed to check domain. Please try again.');
            setStatus('idle');
        } finally {
            setLoading(false);
        }
    };

    const hasNoRecords = status === 'success' && records && 
                         records.mx.length === 0 && records.a.length === 0 && 
                         records.aaaa.length === 0 && records.txt.length === 0 && records.ns.length === 0;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 md:p-8 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 mx-auto flex items-center justify-center text-3xl mb-6 shadow-lg rotate-3 cursor-default hover:rotate-6 transition-transform">
                    {status === 'success' ? '⚡' : status === 'invalid' ? '❌' : '🌐'}
                </div>
                
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">Check All DNS Records</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Instantly fetch Name Servers (NS), Mail Servers (MX), IP Addresses (A/AAAA), and Text Verification (TXT) records simultaneously.</p>

                <form onSubmit={checkDomain} className="relative max-w-xl mx-auto mb-8">
                    <input 
                        type="text" 
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        placeholder="e.g. gmail.com or user@company.com" 
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl pl-5 pr-32 py-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono"
                    />
                    <button type="submit" disabled={loading || !domain.trim()} className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Checking...' : 'Lookup Records'}
                    </button>
                </form>

                {error && (
                    <div className="max-w-xl mx-auto text-red-500 bg-red-50 dark:bg-red-900/10 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/30 text-sm font-bold animate-in fade-in slide-in-from-top-2 mb-6">
                        {error}
                    </div>
                )}
            </div>

            {status === 'success' && records && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    
                    {/* LEFT COLUMN: MX & A/AAAA */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* MX RECORDS */}
                        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 shadow-sm">
                            <h3 className="flex items-center gap-2 font-black text-gray-900 dark:text-white mb-4">
                                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-1.5 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></span>
                                Mail Servers (MX)
                            </h3>
                            {records.mx.length === 0 ? (
                                <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/10 dark:text-amber-400 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900/20">No MX records found. This domain cannot receive emails.</p>
                            ) : (
                                <div className="space-y-2">
                                    {records.mx.map((rec, idx) => (
                                        <div key={idx} className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] gap-2">
                                            <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                                                <div className="w-7 h-7 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0" title="Priority">
                                                    {rec.preference}
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-300 font-mono truncate">{rec.exchange}</span>
                                            </div>
                                            <button onClick={() => navigator.clipboard.writeText(rec.exchange)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Copy</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* A & AAAA RECORDS */}
                        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 shadow-sm">
                            <h3 className="flex items-center gap-2 font-black text-gray-900 dark:text-white mb-4">
                                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>
                                IP Addresses (A / AAAA)
                            </h3>
                            {records.a.length === 0 && records.aaaa.length === 0 ? (
                                <p className="text-sm text-gray-500">No IPv4 or IPv6 records found. The domain does not resolve to a server.</p>
                            ) : (
                                <div className="space-y-2">
                                    {records.a.map((rec, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a]">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">IPv4</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-300 font-mono">{rec.address}</span>
                                            </div>
                                            <a href={`/ip-lookup?target=${rec.address}`} target="_blank" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Lookup IP</a>
                                        </div>
                                    ))}
                                    {records.aaaa.map((rec, idx) => (
                                        <div key={idx} className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] gap-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">IPv6</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-300 font-mono truncate">{rec.address}</span>
                                            </div>
                                            <a href={`/ip-lookup?target=${rec.address}`} target="_blank" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0">Lookup IP</a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: TXT RECORDS */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 shadow-sm h-full max-h-[600px] overflow-y-auto custom-scrollbar">
                            <h3 className="flex items-center gap-2 font-black text-gray-900 dark:text-white mb-1">
                                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-1.5 rounded-lg"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></span>
                                Text Records (TXT)
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">Often used for email security (SPF, DMARC) and site ownership verification.</p>
                            
                            {records.txt.length === 0 ? (
                                <p className="text-sm text-gray-500">No TXT verification records found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {records.txt.map((rec, idx) => {
                                        let isSPF = rec.text.includes('v=spf1');
                                        let isDMARC = rec.text.includes('v=DMARC1');
                                        let tagClass = isSPF ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : isDMARC ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
                                        
                                        return (
                                            <div key={idx} className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a]">
                                                { (isSPF || isDMARC) && (
                                                    <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-md mb-2 ${tagClass}`}>
                                                        {isSPF ? 'SPF Record' : 'DMARC Record'}
                                                    </span>
                                                )}
                                                <p className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all leading-relaxed whitespace-pre-wrap">{rec.text}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {hasNoRecords && (
                <div className="text-center p-8">
                    <p className="text-sm text-gray-500">This domain appears to be empty or misconfigured. No major DNS records found.</p>
                </div>
            )}
        </div>
    );
}
