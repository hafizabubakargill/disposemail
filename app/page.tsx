'use client';

import { useEffect, useState } from "react";
import Inbox from "@/components/Inbox";
import { ModeToggle } from "@/components/ModeToggle";
import { DOMAINS, DEFAULT_DOMAIN } from "@/lib/domains";

export default function Home() {
    const [email, setEmail] = useState<string | null>(null);
    const [selectedDomain, setSelectedDomain] = useState<string>(DEFAULT_DOMAIN);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Generate or retrieve existing email session
        let stored = localStorage.getItem('disposemail_address');

        // Check if expired (optional, but good for session management)
        const created = localStorage.getItem('disposemail_created');
        const now = Date.now();
        if (stored && created && (now - parseInt(created)) > 60 * 60 * 1000) {
            stored = null; // Expired
        }

        if (!stored) {
            const userPart = Math.random().toString(36).substring(2, 10);
            stored = `${userPart}@${DEFAULT_DOMAIN}`;
            localStorage.setItem('disposemail_address', stored);
            localStorage.setItem('disposemail_created', now.toString());
        }

        // Set state
        setEmail(stored);

        // Extract domain from stored email to set dropdown correctly
        const domainPart = stored.split('@')[1];
        if (DOMAINS.includes(domainPart)) {
            setSelectedDomain(domainPart);
        }
    }, []);

    const handleCopy = () => {
        if (email) {
            navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRefresh = () => {
        const userPart = Math.random().toString(36).substring(2, 10);
        const newEmail = `${userPart}@${selectedDomain}`; // Use currently selected domain
        localStorage.setItem('disposemail_address', newEmail);
        localStorage.setItem('disposemail_created', Date.now().toString());
        setEmail(newEmail);
        // We force reload to ensure socket/inbox state is clean, though strictly not necessary if Inbox handles prop change well.
        // For smoother UX, we could try avoiding reload, but reload ensures clean state.
        window.location.reload();
    };

    const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDomain = e.target.value;
        setSelectedDomain(newDomain);

        // When domain changes, we should probably generate a new email immediately 
        // OR wait for user to hit refresh? 
        // Better UX: Update the current user part with new domain immediately.
        if (email) {
            const userPart = email.split('@')[0];
            const newEmail = `${userPart}@${newDomain}`;
            setEmail(newEmail);
            localStorage.setItem('disposemail_address', newEmail);
        }
    };

    if (!email) return null; // or loading spinner

    return (
        <main className="flex min-h-screen flex-col items-center relative overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Navbar */}
            <nav className="w-full flex justify-between items-center px-8 py-6 z-10 max-w-7xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">DisposeMail</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
                        <a href="/api-docs" className="hover:text-blue-600 dark:hover:text-white transition-colors">API</a>
                        <a href="/faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">FAQ</a>
                        <a href="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">About</a>
                    </div>
                    <ModeToggle />
                </div>
            </nav>

            {/* Hero Section */}
            <div className="w-full max-w-4xl px-4 mt-20 z-10 text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono mb-6">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                    END-TO-END ENCRYPTED
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">
                    Your Privacy, <br />
                    <span className="text-gray-900 dark:text-white">Disposable.</span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                    Instantly generated, secure temporary email for anonymous browsing. <br />
                    No registration. No tracking. Just privacy.
                </p>

                {/* Email Box */}
                <div className="bg-white dark:bg-[#111] p-2 pr-2 rounded-2xl border border-gray-200 dark:border-[#222] shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto backdrop-blur-sm relative group mb-4 transition-colors">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative bg-gray-50 dark:bg-[#111] w-full rounded-[14px] flex items-center p-4 transition-colors">
                        <span className="text-gray-500 mr-3 select-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </span>

                        {/* Domain Selector Logic */}
                        <div className="flex-1 flex items-center overflow-hidden">
                            <span className="text-gray-900 dark:text-gray-200 font-mono text-lg truncate text-right">
                                {email.split('@')[0]}
                            </span>
                            <span className="text-gray-500 font-mono text-lg mx-1">@</span>
                            <select
                                value={selectedDomain}
                                onChange={handleDomainChange}
                                className="bg-transparent border-none outline-none text-gray-900 dark:text-gray-200 font-mono text-lg cursor-pointer hover:text-blue-500 transition-colors appearance-none pr-4"
                                style={{ backgroundImage: 'none' }}
                            >
                                {DOMAINS.map(domain => (
                                    <option key={domain} value={domain} className="bg-white dark:bg-[#222] text-black dark:text-white">
                                        {domain}
                                    </option>
                                ))}
                            </select>
                            {/* Custom arrow minimal */}
                            <svg className="w-4 h-4 text-gray-400 pointer-events-none -ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>

                    </div>
                    <div className="relative flex gap-2 w-full md:w-auto p-1">
                        <button
                            onClick={handleCopy}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[120px]"
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Copied
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                    Copy
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="bg-[#222] hover:bg-[#333] text-white p-3 rounded-xl transition-colors"
                            title="Generate New Address"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </button>
                    </div>
                </div>

                <p className="text-gray-500 text-sm mb-16">
                    Emails auto-delete after 1 hour. <a href="/faq" className="text-blue-500/60 cursor-pointer hover:text-blue-400">Learn more</a>
                </p>
            </div>

            {/* Inbox Section */}
            <div className="w-full px-4 z-10 pb-20">
                <Inbox emailAddress={email} />
            </div>

        </main>
    );
}
