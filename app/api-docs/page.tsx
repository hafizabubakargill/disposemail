import React from 'react';

export default function ApiDocs() {
    return (
        <main className="min-h-screen bg-[#050505] text-white p-8 md:p-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="max-w-4xl mx-auto z-10 relative">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    API Documentation
                </h1>
                <p className="text-gray-400 mb-12">Programmatic access to DisposeMail services.</p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-200 mb-4">1. Get Emails</h2>
                        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                            <div className="bg-[#161616] p-4 border-b border-[#222] font-mono text-sm flex gap-4">
                                <span className="text-green-400 font-bold">GET</span>
                                <span>https://disposemail.xyz/api/emails</span>
                            </div>
                            <div className="p-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Query Parameters</h4>
                                <ul className="text-gray-300 font-mono text-sm mb-6">
                                    <li><span className="text-blue-400">address</span> (required): The email address to fetch messages for.</li>
                                </ul>

                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Example Response</h4>
                                <pre className="bg-black p-4 rounded-lg text-xs text-gray-400 overflow-x-auto">
                                    {`[
  {
    "id": "c12fd409...",
    "address": "demo@disposemail.xyz",
    "from_address": "sender@example.com",
    "subject": "Verification Code",
    "text": "Your code is 1234",
    "received_at": 1769460979808
  }
]`}
                                </pre>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-200 mb-4">2. Webhooks</h2>
                        <p className="text-gray-400 mb-4">You can configure Cloudflare Workers to forward emails to our ingestion endpoint.</p>
                        <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
                            <div className="bg-[#161616] p-4 border-b border-[#222] font-mono text-sm flex gap-4">
                                <span className="text-blue-400 font-bold">POST</span>
                                <span>https://disposemail.xyz/api/webhook/email</span>
                            </div>
                            <div className="p-6 text-gray-400 text-sm">
                                Accepts raw standard RFC 822 email content in the body.
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-12 text-center text-gray-500">
                    <a href="/" className="hover:text-blue-400 transition-colors">← Back to Home</a>
                </div>
            </div>
        </main>
    );
}
