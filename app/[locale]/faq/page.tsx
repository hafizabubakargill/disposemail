'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function FAQ() {
    const t = useTranslations('FAQ');
    return (
        <main className="min-h-screen bg-transparent p-8 md:p-24 relative overflow-hidden transition-colors">
            <div className="max-w-4xl mx-auto z-10 relative">
                <a href="/" className="text-blue-600 hover:text-blue-500 mb-8 inline-block font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    {t('back_home')}
                </a>
                <h1 className="text-4xl md:text-6xl font-black mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tighter">
                    {t('title')}
                </h1>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
                            <span className="w-8 h-px bg-blue-600"></span> {t('fundamental')}
                        </h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{t('q3')}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {t('a3')}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{t('q1')}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {t.rich('a1', { strong: (chunks) => <strong>{chunks}</strong> })}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-purple-600 mb-6 flex items-center gap-2">
                            <span className="w-8 h-px bg-purple-600"></span> {t('technical')}
                        </h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{t('q5')}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {t('a5')}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{t('q6')}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {t('a6')}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{t('q7')}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {t('a7')}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-20 p-12 rounded-[40px] bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black tracking-tight mb-4">{t('still_questions')}</h2>
                        <p className="text-blue-100 max-w-xl mb-8">
                            {t('support_desc')}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="mailto:support@disposemail.xyz" className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
                                {t('support_btn')}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </a>
                            <a href="/" className="px-8 py-4 bg-blue-500/20 text-white border border-blue-400/30 rounded-2xl font-bold hover:bg-blue-500/40 transition-all">
                                {t('create_btn')}
                            </a>
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-10 flex gap-1 items-center opacity-20 pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        <span className="text-[10px] font-black tracking-widest uppercase">{t('secure_anon')}</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
