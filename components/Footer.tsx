'use client';

import Link from "next/link";
import { useTranslations } from 'next-intl';

export function Footer() {
    const t = useTranslations('Footer');
    return (
        <footer className="w-full bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-[#1f1f1f] py-12 px-6 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <Link href="/" className="flex items-center space-x-3 mb-2 hover:opacity-80 transition-opacity">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">DisposeMail</span>
                    </Link>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">{t('copyright')}</p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-[11px] font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">
                    <Link href="/faq" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">{t('faq')}</Link>
                    <Link href="/privacy" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">{t('privacy')}</Link>
                    <Link href="/terms" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">{t('terms')}</Link>
                    <Link href="/api-docs" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">{t('api_docs')}</Link>
                    <a href="https://chromewebstore.google.com/detail/disposemail-%E2%80%94-instant-tem/pfeljfajppgglbddgknmpgaioimijfjo" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-black hover:underline transition-colors flex items-center gap-1"><svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg> Chrome Extension</a>
                    <a href="https://extensionlaunch.com/product/disposemail-instant-temp-email-pfeljf" target="_blank" rel="noopener noreferrer" className="text-orange-600 dark:text-orange-400 font-black hover:underline transition-colors flex items-center gap-1">🚀 ExtensionLaunch</a>
                    <a href="https://www.facebook.com/disposemail" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 font-bold hover:underline transition-colors flex items-center gap-1"><svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook</a>
                    <Link href="https://disposemail.xyz/sitemap-index.xml" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Sitemap</Link>
                    <a href='https://www.saashub.com/disposemail-xyz?utm_source=badge&utm_campaign=badge&utm_content=disposemail-xyz&badge_variant=color&badge_kind=approved' target='_blank' rel='noopener noreferrer' className="inline-block">
                        <img src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" alt="DisposeMail.xyz badge" className="max-w-[120px] h-auto hover:opacity-90 transition-opacity" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
