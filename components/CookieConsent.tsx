'use client';

import { useState, useEffect } from 'react';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('disposemail_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('disposemail_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-in slide-in-from-bottom-5 duration-500 pointer-events-none">
            <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border border-gray-200 dark:border-[#222] rounded-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] pointer-events-auto">
                <div className="flex items-start md:items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-10 h-10 shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="leading-relaxed">
                        <strong className="text-gray-900 dark:text-white block mb-1">We value your privacy</strong>
                        We use necessary cookies to make our site work. We'd also like to set optional analytics and advertising cookies to help us improve the site and keep it free. For more detailed information, see our <a href="/privacy" className="text-blue-600 hover:text-blue-500 underline decoration-blue-500/30 underline-offset-4">Privacy Policy</a>.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                    <button 
                        onClick={acceptCookies}
                        className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap"
                    >
                        Accept All
                    </button>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all active:scale-95"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
