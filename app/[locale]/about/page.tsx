'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function About() {
    const t = useTranslations('About');
    return (
        <main className="min-h-screen bg-transparent text-foreground p-8 md:p-24 relative overflow-hidden transition-colors">
            <div className="max-w-4xl mx-auto z-10 relative">
                <h1 className="text-4xl md:text-6xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tighter">
                    {t('title')}
                </h1>

                <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400 max-w-none space-y-8">
                    <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-[#222] shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('mission_title')}</h2>
                        <p>
                            {t.rich('mission_desc', {
                                strong: (chunks) => <strong>{chunks}</strong>
                            })}
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-[#222] shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('why_exist_title')}</h2>
                            <p>
                                {t('why_exist_desc')}
                            </p>
                        </section>

                        <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-[#222] shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('tech_title')}</h2>
                            <p>
                                {t('tech_desc')}
                            </p>
                        </section>
                    </div>

                    <section className="bg-blue-600/5 dark:bg-blue-600/10 p-8 rounded-3xl border border-blue-600/20 shadow-sm">
                        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{t('commitment_title')}</h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li>{t.rich('item1', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                            <li>{t.rich('item2', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                            <li>{t.rich('item3', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                            <li>{t.rich('item4', { strong: (chunks) => <strong>{chunks}</strong> })}</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-[#222] shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('transparency_title')}</h2>
                        <p>
                            {t('transparency_desc')}
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-[#222] flex justify-between items-center">
                    <a href="/" className="text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400 font-bold uppercase tracking-widest text-xs transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        {t('back_inbox')}
                    </a>
                </div>
            </div>
        </main>
    );
}
