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

    const [showQR, setShowQR] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(3600); // 1 hour in seconds
    const [progress, setProgress] = useState(100);
    // Get random domain helper
    const getRandomDomain = () => DOMAINS[Math.floor(Math.random() * DOMAINS.length)];

    const [selectedDomain, setSelectedDomain] = useState(() => DOMAINS[0]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
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
            const domain = getRandomDomain();
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
        const domain = getRandomDomain();
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

    const handleDomainChange = (newDomain: string) => {
        setSelectedDomain(newDomain);
        if (email) {
            const userPart = email.split('@')[0];
            const newEmail = `${userPart}@${newDomain}`;
            localStorage.setItem('disposemail_address', newEmail);
            localStorage.setItem('disposemail_created', Date.now().toString());
            setEmail(newEmail);
            setTimeLeft(3600);
            setProgress(100);
        }
    };

    if (!isMounted || !email) return null;

    return (
        <main className="flex min-h-screen flex-col items-center relative overflow-x-hidden">
            {/* Background Grid Effect */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

            {/* Navbar */}
            <nav className="w-full flex justify-between items-center px-6 md:px-8 py-6 z-50 max-w-7xl relative">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
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
                    <div className="absolute top-20 left-0 right-0 bg-white dark:bg-[#111] border-y border-gray-200 dark:border-[#222] p-6 flex flex-col gap-4 z-50 md:hidden animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
                        <a href="/api-docs" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2">API Documentation</a>
                        <a href="/faq" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2">FAQ</a>
                        <a href="/about" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2">About Us</a>
                        <a href="/privacy" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2">Privacy Policy</a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="w-full max-w-4xl px-4 mt-8 md:mt-20 z-10 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-6">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                    END-TO-END ENCRYPTED
                </div>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
                    Your Privacy, <br />
                    <span className="text-gray-900 dark:text-white">Disposable.</span>
                </h1>

                <p className="text-gray-600 dark:text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-10">
                    Instantly generated, secure temporary email for anonymous browsing. <br className="hidden md:block" />
                    No registration. No tracking. Just privacy.
                </p>

                {/* Custom Prefix & Pill UI */}
                <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
                    <div className="flex bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-full p-1 overflow-hidden transition-colors shadow-sm">
                        <button
                            type="button"
                            onClick={() => setIsCustom(!isCustom)}
                            className={`text-xs px-6 py-2.5 rounded-full transition-all font-bold ${isCustom ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            {isCustom ? 'Custom Mode' : 'Random Mode'}
                        </button>

                        {isCustom && (
                            <form onSubmit={handleRefresh} className="flex items-center">
                                <input
                                    id="custom-prefix"
                                    name="custom-prefix"
                                    type="text"
                                    placeholder="custom-name"
                                    value={customPrefix}
                                    onChange={(e) => setCustomPrefix(e.target.value)}
                                    className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-gray-200 w-24 md:w-32 px-4 py-2 font-medium"
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    className="mr-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all"
                                >
                                    SET
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
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
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
