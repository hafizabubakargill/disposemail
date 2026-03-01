import React from 'react';

export default function ApiDocs() {
    return (
        <main className="min-h-screen bg-transparent text-foreground p-8 md:p-24 relative overflow-hidden transition-colors">
            <div className="max-w-4xl mx-auto z-10 relative">
                <h1 className="text-4xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tighter">
                    API Reference
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-16 text-xl leading-relaxed max-w-2xl">Integrate DisposeMail directly into your applications. Our REST API allows you to programmatically manage temporary inboxes and retrieve messages in real-time.</p>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span> 1. Message Retrieval
                        </h2>
                        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] rounded-[32px] overflow-hidden shadow-sm">
                            <div className="bg-gray-50/50 dark:bg-[#161616]/50 p-6 border-b border-gray-100 dark:border-[#222] font-mono text-sm flex items-center gap-4">
                                <span className="bg-green-600/10 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">GET</span>
                                <span className="text-gray-800 dark:text-gray-200">https://disposemail.xyz/api/emails</span>
                            </div>
                            <div className="p-8">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Request Parameters</h4>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#222]">
                                        <code className="text-blue-600 font-bold">address</code>
                                        <div className="text-sm">
                                            <span className="text-gray-400 font-bold uppercase text-[10px]">Required</span>
                                            <p className="text-gray-500 mt-1">The full DisposeMail address (e.g., user@disposemail.xyz)</p>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">JSON Result Format</h4>
                                <pre className="bg-gray-900 p-6 rounded-2xl text-[11px] text-gray-300 overflow-x-auto shadow-inner">
                                    {`[
  {
    "id": "c12fd409-e5a1-4361-...",
    "address": "test@disposemail.xyz",
    "from_address": "sender@domain.com",
    "subject": "Verification",
    "text": "Your code: 8892",
    "is_html": true,
    "received_at": 1739276400000
  }
]`}
                                </pre>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-purple-600 rounded-full"></span> 2. Edge Ingestion
                        </h2>
                        <p className="text-gray-500 mb-6 max-w-2xl">Connect your own Cloudflare Workers or incoming mail handlers to our high-performance ingestion endpoint for real-time delivery.</p>
                        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] rounded-[32px] overflow-hidden shadow-sm">
                            <div className="bg-gray-50/50 dark:bg-[#161616]/50 p-6 border-b border-gray-100 dark:border-[#222] font-mono text-sm flex items-center gap-4">
                                <span className="bg-purple-600/10 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">POST</span>
                                <span className="text-gray-800 dark:text-gray-200">/api/webhook/email</span>
                            </div>
                            <div className="p-8 text-gray-500 text-sm italic leading-relaxed">
                                Accepts standard RAW email bodies (RFC 822). Requires <code className="font-bold text-purple-600">x-webhook-secret</code> header for authenticated delivery.
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-20 flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Developers first</p>
                    <a href="/" className="text-gray-900 dark:text-white hover:text-blue-600 transition-all font-bold group flex items-center gap-2">
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Homepage
                    </a>
                </div>
            </div>
        </main>
    );
}
