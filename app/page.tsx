'use client';

import { useEffect, useState } from "react";
import Inbox from "@/components/Inbox";
import { ModeToggle } from "@/components/ModeToggle";
import { DOMAINS, DEFAULT_DOMAIN } from "@/lib/domains";

export default function Home() {
    const [email, setEmail] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isCustom, setIsCustom] = useState(false);
    const [customPrefix, setCustomPrefix] = useState('');

    const [menuOpen, setMenuOpen] = useState(false);

    // Get random domain helper
    const getRandomDomain = () => DOMAINS[Math.floor(Math.random() * DOMAINS.length)];

    useEffect(() => {
        // Generate or retrieve existing email session
        let stored = localStorage.getItem('disposemail_address');
        const created = localStorage.getItem('disposemail_created');
        const now = Date.now();

        if (stored && created && (now - parseInt(created)) > 60 * 60 * 1000) {
            stored = null; // Expired
        }

        if (!stored) {
            const userPart = Math.random().toString(36).substring(2, 10);
            stored = `${userPart}@${getRandomDomain()}`;
            localStorage.setItem('disposemail_address', stored);
            localStorage.setItem('disposemail_created', now.toString());
        }

        setEmail(stored);
    }, []);

    const handleCopy = () => {
        if (email) {
            navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRefresh = () => {
        const userPart = isCustom && customPrefix.length > 0
            ? customPrefix.toLowerCase().replace(/[^a-z0-9]/g, '')
            : Math.random().toString(36).substring(2, 10);

        const newEmail = `${userPart}@${getRandomDomain()}`;
        localStorage.setItem('disposemail_address', newEmail);
        localStorage.setItem('disposemail_created', Date.now().toString());
        setEmail(newEmail);
    };

    if (!email) return null;

    return (
        <main className="flex min-h-screen flex-col items-center relative overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Navbar */}
            <nav className="w-full flex justify-between items-center px-6 md:px-8 py-6 z-50 max-w-7xl relative">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">DisposeMail</span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
                        <a href="/api-docs" className="hover:text-blue-600 dark:hover:text-white transition-colors">API</a>
                        <a href="/faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">FAQ</a>
                        <a href="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">About</a>
                        <a href="/privacy" className="hover:text-blue-600 dark:hover:text-white transition-colors">Privacy</a>
                    </div>
                    <ModeToggle />
                </div>

                {/* Mobile Hamburger Button */}
                <div className="flex md:hidden items-center gap-3">
                    <ModeToggle />
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-lg transition-colors"
                    >
                        {menuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {menuOpen && (
                    <div className="absolute top-20 left-0 right-0 bg-white dark:bg-[#111] border-y border-gray-200 dark:border-[#222] p-6 flex flex-col gap-4 z-50 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
                        <a href="/api-docs" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2">API Documentation</a>
                        <a href="/faq" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2">FAQ</a>
                        <a href="/about" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2">About Us</a>
                        <a href="/privacy" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2">Privacy Policy</a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="w-full max-w-4xl px-4 mt-12 md:mt-20 z-10 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-6">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                    END-TO-END ENCRYPTED
                </div>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
                    Your Privacy, <br />
                    <span className="text-gray-900 dark:text-white">Disposable.</span>
                </h1>

                <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-10">
                    Instantly generated, secure temporary email for anonymous browsing. <br className="hidden md:block" />
                    No registration. No tracking. Just privacy.
                </p>

                {/* Custom Prefix Toggle */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={() => setIsCustom(!isCustom)}
                        className={`text-sm px-4 py-2 rounded-full border transition-all ${isCustom ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'border-gray-200 dark:border-[#222] text-gray-500 hover:border-gray-300'}`}
                    >
                        {isCustom ? "✨ Custom Active" : "🛠️ Personalize Address"}
                    </button>
                    {isCustom && (
                        <div className="flex items-center bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-lg px-3 py-1 animate-in slide-in-from-left-2 duration-300">
                            <input
                                type="text"
                                placeholder="custom-name"
                                value={customPrefix}
                                onChange={(e) => setCustomPrefix(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-200 w-32"
                            />
                            <button
                                onClick={handleRefresh}
                                className="ml-2 text-blue-500 hover:text-blue-400 text-xs font-bold"
                            >
                                USE
                            </button>
                        </div>
                    )}
                </div>

                {/* Email Box */}
                <div className="bg-white dark:bg-[#111] p-2 pr-2 rounded-2xl border border-gray-200 dark:border-[#222] shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto backdrop-blur-sm relative group mb-4 transition-colors">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative bg-gray-50 dark:bg-[#111] w-full rounded-[14px] flex items-center p-4 transition-colors">
                        <span className="text-gray-500 mr-2 md:mr-3 select-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </span>

                        <div className="flex-1 overflow-hidden text-left">
                            <input
                                type="text"
                                readOnly
                                value={email}
                                className="bg-transparent border-none outline-none text-gray-900 dark:text-gray-200 font-mono text-base md:text-lg w-full placeholder-gray-400 dark:placeholder-gray-600 pl-1 md:pl-2"
                            />
                        </div>

                    </div>
                    <div className="relative flex flex-col md:flex-row gap-2 w-full md:w-auto p-1">
                        <button
                            onClick={handleCopy}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:min-w-[120px]"
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Copied
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                    Copy Address
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="bg-[#222] hover:bg-[#333] text-white py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 w-full md:w-auto"
                            title="Generate New Address"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            <span className="md:hidden text-sm font-medium">Generate New Email</span>
                        </button>
                    </div>
                </div>

                <p className="text-gray-500 text-sm mb-8">
                    Emails auto-delete after 1 hour. <a href="/faq" className="text-blue-500/60 cursor-pointer hover:text-blue-400 font-medium underline underline-offset-4">Learn more</a>
                </p>

                {/* Ad Banner (Top) - Hidden in Production until active */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="max-w-2xl mx-auto mb-16 px-4">
                        <div className="bg-white dark:bg-[#111] border border-dashed border-gray-200 dark:border-[#222] rounded-xl p-4 min-h-[100px] flex items-center justify-center">
                            <span className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-widest">Ad Placement Area</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Inbox Section */}
            <div className="w-full px-4 z-10 pb-20">
                <Inbox emailAddress={email} />
            </div>

        </main>
    );
}
