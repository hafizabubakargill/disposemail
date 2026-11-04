'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { tr } from '@/lib/tr';
import { readConsent, saveConsent, OPEN_CONSENT_EVENT } from '@/lib/consent';

export function CookieConsent() {
    const locale = useLocale();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!readConsent()) setIsVisible(true);
        const open = () => setIsVisible(true);
        window.addEventListener(OPEN_CONSENT_EVENT, open);
        return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
    }, []);

    const choose = (all: boolean) => {
        saveConsent({ analytics: all, ads: all });
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const btn = 'flex-1 sm:flex-none px-6 py-3 font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap';

    return (
        <div role="dialog" aria-label={tr(locale, 'We value your privacy')} className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-in slide-in-from-bottom-5 duration-500 pointer-events-none">
            <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-gray-200 dark:border-[#222] rounded-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] pointer-events-auto">
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    <strong className="text-gray-900 dark:text-white block mb-1">{tr(locale, 'We value your privacy')}</strong>
                    {tr(locale, 'We use necessary cookies to make the site work. With your permission we also use analytics and advertising cookies to improve the site and keep it free. You can change your choice at any time from Cookie settings in the footer.')}{' '}
                    <a href={locale === 'en' ? '/privacy' : `/${locale}/privacy`} className="text-blue-600 hover:text-blue-500 underline decoration-blue-500/30 underline-offset-4">{tr(locale, 'Privacy Policy')}</a>
                </p>
                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                    <button onClick={() => choose(false)} className={`${btn} bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222] text-gray-800 dark:text-gray-200`}>
                        {tr(locale, 'Reject non-essential')}
                    </button>
                    <button onClick={() => choose(true)} className={`${btn} bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20`}>
                        {tr(locale, 'Accept all')}
                    </button>
                </div>
            </div>
        </div>
    );
}
