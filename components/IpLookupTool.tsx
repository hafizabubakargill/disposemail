'use client';
import { useState, useEffect } from 'react';

interface IPData {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    country_code: string;
    postal: string;
    latitude: number;
    longitude: number;
    timezone: string;
    org: string;
    asn: string;
}

export default function IpLookupTool() {
    const [data, setData] = useState<IPData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchIpData();
    }, []);

    const fetchIpData = async (targetIp: string = '') => {
        setLoading(true);
        setError('');
        try {
            const url = targetIp ? `https://ipapi.co/${targetIp}/json/` : 'https://ipapi.co/json/';
            const res = await fetch(url);
            if (!res.ok) throw new Error('Rate limited or lookup failed');
            const json = await res.json();
            if (json.error) throw new Error(json.reason || 'Invalid IP');
            setData(json);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch IP details');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!data) return;
        const textToCopy = [
            `IP Address: ${data.ip}`,
            `Location: ${data.city}, ${data.region}, ${data.country_name}`,
            `ISP / Org: ${data.org}`,
            `ASN: ${data.asn}`,
            `Timezone: ${data.timezone}`
        ].join('\n');

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error('Failed to copy', e);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Auto-detected IP Display */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                <h2 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Your IPv4 / IPv6 Address</h2>
                {loading ? (
                    <div className="animate-pulse h-12 w-64 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl mx-auto my-4 mt-2 mb-6"></div>
                ) : error ? (
                    <div className="text-red-500 bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-xl inline-block mt-2 mb-6 border border-red-200 dark:border-red-900/30 text-sm">{error}</div>
                ) : (
                    <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mt-2 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 flex items-center justify-center gap-3">
                        {data?.ip}
                        <button onClick={() => {
                            navigator.clipboard.writeText(data?.ip || '');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }} className="text-gray-400 hover:text-orange-500 transition-colors" title="Copy IP only">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Location</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {loading ? 'Loading...' : data ? `${data.city}, ${data.region}` : '--'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{loading ? '...' : data?.country_name || '--'}</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">ISP / Organization</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={data?.org}>
                                {loading ? 'Loading...' : data?.org || '--'}
                            </p>
                            <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">{loading ? '...' : data?.asn || '--'}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-[#222] flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center w-full md:w-auto overflow-hidden">
                        <div className="text-left min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Postal / ZIP</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{loading ? '...' : data?.postal || '--'}</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-[#333] hidden md:block shrink-0"></div>
                        <div className="text-left min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Timezone</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{loading ? '...' : data?.timezone || '--'}</p>
                        </div>
                    </div>
                    
                    <button onClick={handleCopy} disabled={!data} className="w-full md:w-auto py-2.5 px-6 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 border border-gray-200 dark:border-[#2a2a2a] text-gray-900 dark:text-white font-bold text-sm transition-all focus:ring-4 focus:ring-orange-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0">
                        {copied ? (
                            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Copied!</>
                        ) : (
                            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy All Details</>
                        )}
                    </button>
                </div>
            </div>

            {/* Custom IP Lookup */}
            <form onSubmit={e => { e.preventDefault(); const ip = new FormData(e.currentTarget).get('ip') as string; if(ip) fetchIpData(ip); }} 
                  className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-3xl p-6 shadow-sm">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Lookup any IP address</label>
                <div className="flex gap-2 relative">
                    <input 
                        type="text" 
                        name="ip"
                        placeholder="e.g. 8.8.8.8 or 2001:4860:4860::8888" 
                        pattern="^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$"
                        className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                    />
                    <button type="submit" disabled={loading} className="py-3 px-6 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                        Lookup
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">Supports both IPv4 and IPv6 addresses.</p>
            </form>
        </div>
    );
}
