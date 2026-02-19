'use client';

import { useEffect, useState } from "react";
import Inbox from "@/components/Inbox";
import { ModeToggle } from "@/components/ModeToggle";
import { generateRandomDomain, DEFAULT_DOMAIN } from "@/lib/domains";

export default function Home() {
    const [email, setEmail] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isCustom, setIsCustom] = useState(false);
    const [customPrefix, setCustomPrefix] = useState('');

    const [showQR, setShowQR] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(3600); // 1 hour in seconds
    const [progress, setProgress] = useState(100);

    const [selectedDomain, setSelectedDomain] = useState(() => DEFAULT_DOMAIN);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Generate or retrieve existing email session
        let stored = localStorage.getItem('disposemail_address');
        const created = localStorage.getItem('disposemail_created');
        const now = Date.now();

        if (stored && created) {
            const diff = now - parseInt(created);
            if (diff > 60 * 60 * 1000) {
                stored = null; // Expired
            } else {
                const remaining = Math.max(0, 3600 - Math.floor(diff / 1000));
                setTimeLeft(remaining);
                setProgress((remaining / 3600) * 100);
                setSelectedDomain(stored.split('@')[1] || DEFAULT_DOMAIN);
            }
        }

        if (!stored) {
            const domain = generateRandomDomain();
            const userPart = Math.random().toString(36).substring(2, 10);
            stored = `${userPart}@${domain}`;
            localStorage.setItem('disposemail_address', stored);
            localStorage.setItem('disposemail_created', now.toString());
            setTimeLeft(3600);
            setProgress(100);
            setSelectedDomain(domain);
        }

        setEmail(stored);

        // Countdown Timer
        const timer = setInterval(() => {
            const createdTime = localStorage.getItem('disposemail_created');
            if (createdTime) {
                const elapsed = Math.floor((Date.now() - parseInt(createdTime)) / 1000);
                const remaining = Math.max(0, 3600 - elapsed);
                setTimeLeft(remaining);
                setProgress((remaining / 3600) * 100);

                if (remaining <= 0) {
                    handleRefresh();
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCopy = () => {
        if (email) {
            // Android Haptic Feedback
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                // Fallback for older/insecure contexts
                const textArea = document.createElement("textarea");
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }
                document.body.removeChild(textArea);
            }
        }
    };

    const handleRefresh = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const domain = generateRandomDomain();
        const userPart = isCustom && customPrefix.length > 0
            ? customPrefix.toLowerCase().replace(/[^a-z0-9]/g, '')
            : Math.random().toString(36).substring(2, 10);

        const newEmail = `${userPart}@${domain}`;
        localStorage.setItem('disposemail_address', newEmail);
        localStorage.setItem('disposemail_created', Date.now().toString());
        setEmail(newEmail);
        setTimeLeft(3600);
        setProgress(100);
        setSelectedDomain(domain);
    };

    // Removed handleDomainChange as selection is now random/automated

    if (!isMounted || !email) return null;

    return (
        <div className="w-full">
            {/* Hero Section */}
            <div className="w-full max-w-4xl mx-auto px-4 mt-8 md:mt-20 z-10 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-500/20 text-xs font-mono mb-6 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2 animate-pulse"></span>
                    END-TO-END ENCRYPTED
                </div>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
                    Your Privacy, <br />
                    <span className="text-gray-900 dark:text-white">Disposable.</span>
                </h1>

                <p className="text-gray-700 dark:text-gray-300 text-base md:text-xl max-w-2xl mx-auto mb-10">
                    Instantly generated, secure temporary email for anonymous browsing. <br className="hidden md:block" />
                    No registration. No tracking. Just privacy.
                </p>

                {/* Custom Prefix & Pill UI */}
                <div className="mb-12 flex justify-center">
                    <div className="flex items-center bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] rounded-full p-1 shadow-sm hover:shadow-md transition-all">
                        <button
                            type="button"
                            onClick={() => setIsCustom(!isCustom)}
                            className={`text-[10px] md:text-xs px-6 py-2.5 rounded-full transition-all font-black uppercase tracking-widest ${isCustom ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-[#161616]'}`}
                        >
                            {isCustom ? 'Custom User: Active' : 'Personalize Address'}
                        </button>

                        {isCustom && (
                            <form onSubmit={handleRefresh} className="flex items-center animate-in slide-in-from-left-2 duration-300">
                                <input
                                    id="custom-prefix"
                                    name="custom-prefix"
                                    type="text"
                                    placeholder="enter-name..."
                                    value={customPrefix}
                                    onChange={(e) => setCustomPrefix(e.target.value)}
                                    className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-gray-200 w-28 md:w-40 px-4 py-2 font-bold placeholder-gray-400"
                                    autoComplete="off"
                                    aria-label="Custom username prefix"
                                />
                                <button
                                    type="submit"
                                    className="mr-1 bg-blue-600 border border-blue-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                                >
                                    CREATE
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Email Box & Visual Progress */}
                <div className="max-w-2xl mx-auto mb-4 relative">
                    <div className="bg-white dark:bg-[#111] p-2 pr-2 rounded-2xl border border-gray-200 dark:border-[#222] shadow-2xl flex flex-col md:flex-row items-center gap-2 backdrop-blur-sm relative group transition-colors">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <div className="relative bg-gray-50 dark:bg-[#141414] w-full rounded-[14px] flex items-center p-4 transition-colors">
                            <span className="text-gray-500 mr-2 md:mr-3 select-none">
                                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </span>

                            <div className="flex-1 overflow-hidden text-left">
                                <input
                                    id="generated-email-address"
                                    name="generated-email-address"
                                    type="text"
                                    readOnly
                                    value={email}
                                    className="bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-mono text-base md:text-xl w-full placeholder-gray-400 dark:placeholder-gray-600 pl-1 md:pl-2 font-medium"
                                    aria-label="Generated Email Address"
                                />
                            </div>
                        </div>

                        <div className="relative flex flex-row gap-2 w-full md:w-auto p-1">
                            <button
                                onClick={handleCopy}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 md:px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 flex-1 md:min-w-[100px] shadow-[0_4px_10px_rgba(37,99,235,0.3)]"
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                        <span className="hidden md:inline">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 002-2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                        <span className="text-sm">Copy</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleRefresh}
                                className="bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-900 dark:text-white py-3 px-4 md:px-5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 flex-1 md:flex-none"
                                title="Generate New Address"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                <span className="text-sm font-semibold">New</span>
                            </button>
                            <button
                                onClick={() => setShowQR(!showQR)}
                                className={`py-3 px-4 rounded-xl transition-all active:scale-95 border flex items-center justify-center shadow-sm ${showQR ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-[#111] border-gray-200 dark:border-[#222] text-gray-700 dark:text-gray-300'}`}
                                aria-label="Show QR Code"
                                title="Show QR Code"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                            </button>
                        </div>
                    </div>

                    {/* QR Code Popover (Better Placement) */}
                    {showQR && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-20 animate-in slide-in-from-bottom-2 fade-in duration-200">
                            <div className="bg-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col items-center">
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100"></div>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('mailto:' + email)}`}
                                    alt="QR Code"
                                    className="w-40 h-40"
                                    onLoad={() => console.log('QR Loaded')}
                                />
                                <span className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-widest font-bold">Scan to Share Address</span>
                            </div>
                        </div>
                    )}

                    {/* Progress Bar & Countdown */}
                    <div className="mt-4 px-4">
                        <div className="flex justify-between items-center mb-1 text-[10px] md:text-xs font-mono uppercase tracking-widest text-gray-500">
                            <span className="flex items-center gap-1.5 font-bold">
                                Inbox Expiring in
                            </span>
                            <span className="text-blue-500 font-black">{formatTime(timeLeft)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-[#222] rounded-full overflow-hidden shadow-inner">
                            <div
                                className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)] ${progress < 20 ? 'bg-red-500' : 'bg-blue-600'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-8 dark:text-gray-300">
                    Emails auto-delete after 1 hour. <a href="/faq" className="text-blue-700 dark:text-blue-400 cursor-pointer hover:underline font-bold underline underline-offset-4" aria-label="Learn more about email expiration">Learn more about expiration</a>
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
            <div className="w-full px-4 z-10 pb-12">
                <Inbox emailAddress={email} />
            </div>

            {/* --- AD VALUE: FEATURES GRID --- */}
            <div className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-[#222]">
                <h2 className="text-3xl font-black tracking-tighter text-center mb-12 text-gray-900 dark:text-white">Enterprise-Grade Architecture</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Real-Time Sockets</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">No refreshing needed. Emails are pushed to your browser instantly via secure WebSockets.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-4 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">TLS Encryption</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Every connection is secured with industry-standard TLS encryption to prevent eavesdropping.</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-4 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">Multi-Domain</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Bypass filters with our rotating list of premium domains and subdomains.</p>
                    </div>
                </div>
            </div>

            {/* --- ADSENSE COMPLIANCE CONTENT --- */}
            <div className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-[#222]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Why DisposeMail? */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-gray-100">
                            Secure your Digital Life<span className="text-blue-700 dark:text-blue-400">.</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                            DisposeMail provides instant, temporary email addresses to protect your primary inbox from spam, trackers, and data breaches. Our "Zero-Loss" architecture ensures your trial registrations and verification codes arrive with 100% reliability.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700">
                                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-1">Privacy First</h3>
                                <p className="text-[10px] text-gray-700 dark:text-gray-300 uppercase font-black">No cookies, no logs.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                                <h3 className="font-bold text-green-900 dark:text-green-300 mb-1">Zero Cost</h3>
                                <p className="text-xs text-center font-bold text-green-800 dark:text-green-200">100% FREE FOREVER.</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Quick Links */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest text-[11px]">Frequently Asked Questions</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">How long do emails last?</h4>
                                <p className="text-sm text-gray-500">Your address and all received emails are automatically purged after 60 minutes for maximum security.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">Is it free to use?</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Yes, DisposeMail is a forever-free tool powered by high-quality ads to keep our infrastructure growing.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How it Works / Steps */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-xl shadow-blue-600/20">1</div>
                        <h3 className="font-bold text-lg mb-2">Generate</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Hit 'New' to get a random address or set your own custom name.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-xl shadow-blue-600/20">2</div>
                        <h3 className="font-bold text-lg mb-2">Register</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Use your temporary mail on any website, trial, or newsletter.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-xl shadow-blue-600/20">3</div>
                        <h3 className="font-bold text-lg mb-2">Receive</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Watch emails arrive in real-time. We parse full HTML and attachments.</p>
                    </div>
                </div>
            </div>

            {/* --- AD VALUE: USE CASES --- */}
            <div className="w-full bg-white dark:bg-[#080808] py-20 px-6 border-t border-gray-100 dark:border-[#222]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black tracking-tighter mb-8 text-center text-gray-900 dark:text-white">Common Use Cases</h2>
                    <div className="space-y-4">
                        <details className="group p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] open:bg-blue-50 dark:open:bg-blue-900/10 transition-colors">
                            <summary className="font-bold cursor-pointer list-none flex justify-between items-center bg-transparent text-gray-900 dark:text-gray-100">
                                <span>1. Software Testing & QA</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                Developers use specific disposable addresses to test user registration flows without cluttering real databases or needing to create thousands of Gmail accounts.
                            </p>
                        </details>
                        <details className="group p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] open:bg-blue-50 dark:open:bg-blue-900/10 transition-colors">
                            <summary className="font-bold cursor-pointer list-none flex justify-between items-center bg-transparent text-gray-900 dark:text-gray-100">
                                <span>2. E-Commerce Discounts</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                Sign up for "First Order" coupons on shopping sites without committing your primary email to their daily marketing newsletters.
                            </p>
                        </details>
                        <details className="group p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] open:bg-blue-50 dark:open:bg-blue-900/10 transition-colors">
                            <summary className="font-bold cursor-pointer list-none flex justify-between items-center bg-transparent text-gray-900 dark:text-gray-100">
                                <span>3. Protecting Privacy in Forums</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                Register for online communities or download whitepapers while keeping your personal identity secure and anonymous.
                            </p>
                        </details>
                    </div>
                </div>
            </div>

            {/* --- EXTRA VALUE SECTION FOR ADSENSE --- */}
            <div className="w-full bg-gray-50/50 dark:bg-[#0a0a0a]/50 py-24 px-6 border-y border-gray-100 dark:border-[#111]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">Why Use a Disposable Email?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Discover how DisposeMail protects your digital footprint and keeps your data away from unwanted trackers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-8 rounded-[32px] bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h3 className="font-black text-lg mb-3">Spam Prevention</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Stop giving your real email to every website. Use DisposeMail for one-time registrations and keep your primary inbox clean of marketing clutter.</p>
                        </div>
                        <div className="p-8 rounded-[32px] bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-purple-600/10 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h3 className="font-black text-lg mb-3">Identity Security</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Data breaches happen every day. By using a temporary address, your real identity is never linked to the services you trial, keeping your credentials safe from hackers.</p>
                        </div>
                        <div className="p-8 rounded-[32px] bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-green-600/10 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="font-black text-lg mb-3">Instant Access</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">No confirmation, no setup, no passwords. Just hit 'New' and your inbox is ready to receive verification codes and activation links in milliseconds.</p>
                        </div>
                        <div className="p-8 rounded-[32px] bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-orange-600/10 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <h3 className="font-black text-lg mb-3">Multiple Domains</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Switch between multiple high-reputation domains to bypass filters and sign-up restrictions that might block standard temporary email providers.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
