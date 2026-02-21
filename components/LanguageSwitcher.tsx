'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useState } from 'react';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
        { code: 'pt', label: 'Português' },
        { code: 'ru', label: 'Русский' },
        { code: 'zh', label: '中文' }
    ];

    const currentLanguage = languages.find(l => l.code === locale) || languages[0];

    const switchLanguage = (newLocale: string) => {
        setIsOpen(false);
        if (newLocale === locale) return;

        startTransition(() => {
            // pathname usually starts with /en or /es due to next-intl middleware
            const parts = pathname.split('/');
            // If the first part is a locale, replace it
            if (parts.length > 1 && languages.map(l => l.code).includes(parts[1])) {
                parts[1] = newLocale;
                router.replace(parts.join('/'));
            } else {
                // Prepend locale if missing (edge case)
                router.replace(`/${newLocale}${pathname}`);
            }
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center gap-1.5 p-2 px-3 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-[#333]"
                aria-label="Change Language"
                aria-expanded={isOpen}
            >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                <span className="uppercase tracking-widest">{currentLanguage.code}</span>
                <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => switchLanguage(lang.code)}
                                    className={`px-4 py-2.5 text-xs text-left font-bold transition-colors ${locale === lang.code
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                                        }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
