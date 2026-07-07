import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Official DisposeMail Chrome Extension | Instant Temp Emails',
    description: 'Protect your inbox from spam in 1 click! Generate temporary email addresses directly from your browser toolbar and auto-fill signup forms on any website.',
    alternates: { canonical: 'https://disposemail.xyz/extension' },
    keywords: ['disposemail chrome extension', 'temp email extension', 'disposable email chrome', 'privacy extension', 'anti spam chrome extension'],
};

export default async function ExtensionLandingPage() {
    const extensionUrl = "https://chromewebstore.google.com/detail/disposemail-%E2%80%94-instant-tem/pfeljfajppgglbddgknmpgaioimijfjo";

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-200 dark:border-blue-500/30">
                    <span>⚡ Available on Chrome Web Store</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                    Your Real Inbox, <br className="hidden md:inline"/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                        Protected Everywhere.
                    </span>
                </h1>

                <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
                    Generate secure temporary email addresses instantly from your browser toolbar. Autofill registration forms with one click and keep spam out of your personal life forever.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href={extensionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
                    >
                        <svg className="w-6 h-6 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                        <span>Add to Chrome — It&apos;s Free</span>
                    </a>
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gray-100 dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 font-bold text-base hover:bg-gray-200 dark:hover:bg-[#252525] transition-all"
                    >
                        Use Web Version
                    </Link>
                </div>
                
                <div className="flex items-center justify-center gap-6 mt-8 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">✅ 100% Free Forever</span>
                    <span className="flex items-center gap-1.5">✅ No Registration Required</span>
                    <span className="flex items-center gap-1.5">✅ Lightweight & Fast</span>
                </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="p-8 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] shadow-lg shadow-gray-200/50 dark:shadow-none relative overflow-hidden group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                        ⚡
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Instant Toolbar Inbox</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Need an email address right now? Just click the puzzle icon in your Chrome toolbar. Get a live address with a real-time countdown timer without ever opening a new browser tab.
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] shadow-lg shadow-gray-200/50 dark:shadow-none relative overflow-hidden group">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                        🪄
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Signup Autofill</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Whenever you focus an email field on any website (Netflix, newsletters, free trials), our helper badge pops up so you can fill in a fresh temporary email with a single click.
                    </p>
                </div>

                <div className="p-8 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] shadow-lg shadow-gray-200/50 dark:shadow-none relative overflow-hidden group">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                        🛠️
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Built-in Developer Utilities</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        Access our suite of privacy & developer tools directly from the extension popup: test credit cards, secure passwords, QR codes, and more at your fingertips.
                    </p>
                </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="p-10 md:p-16 rounded-3xl bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 text-white text-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_50%)] pointer-events-none"></div>
                
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Ready to reclaim your inbox privacy?</h2>
                <p className="text-gray-300 max-w-xl mx-auto mb-8 text-base md:text-lg">
                    Join thousands of smart developers and privacy advocates protecting their personal emails every day.
                </p>
                <a
                    href={extensionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-gray-950 font-black text-base shadow-lg hover:bg-blue-50 hover:scale-105 transition-all"
                >
                    <span>🧩 Install DisposeMail Extension Now</span>
                </a>
            </div>
        </div>
    );
}
