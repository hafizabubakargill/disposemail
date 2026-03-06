'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
    const t = useTranslations('Privacy');
    return (
        <main className="flex min-h-screen flex-col items-center bg-transparent px-6 py-20">
            <div className="max-w-3xl w-full bg-white dark:bg-[#111] p-10 rounded-[32px] border border-gray-100 dark:border-[#222] shadow-xl relative z-10">
                <a href="/" className="text-blue-600 hover:text-blue-500 mb-8 inline-block font-bold uppercase tracking-widest text-[11px] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    {t('back_inbox')}
                </a>

                <h1 className="text-5xl font-black mb-8 text-gray-900 dark:text-white tracking-tighter">{t('title')}</h1>

                <div className="space-y-10 text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            {t('sec1_title')}
                        </h2>
                        <p>
                            {t('sec1_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            {t('sec2_title')}
                        </h2>
                        <p>
                            {t.rich('sec2_desc', { strong: (chunks) => <strong>{chunks}</strong> })}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            {t('sec3_title')}
                        </h2>
                        <p>
                            {t('sec3_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            {t('sec4_title')}
                        </h2>
                        <p>
                            {t('sec4_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            {t('sec5_title')}
                        </h2>
                        <p>
                            {t('sec5_desc')}
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 dark:border-[#222] text-[11px] text-gray-400 font-bold uppercase tracking-widest flex justify-between">
                    <span>{t('effective_date')}</span>
                    <span className="text-blue-600">{t('verified')}</span>
                </div>
            </div>
        </main>
    );
}
