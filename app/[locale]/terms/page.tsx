'use client';

import { useTranslations } from 'next-intl';

export default function TermsOfService() {
    const t = useTranslations('Terms');
    return (
        <main className="flex min-h-screen flex-col items-center px-6 py-20 bg-transparent">
            <div className="max-w-3xl w-full bg-white dark:bg-[#111] p-10 rounded-2xl border border-gray-200 dark:border-[#222] shadow-xl relative z-10">
                <a href="/" className="text-blue-600 hover:text-blue-500 mb-8 inline-block font-medium">← {t('back_inbox')}</a>

                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white font-sans tracking-tight">{t('title')}</h1>

                <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">{t('sec1_title')}</h2>
                        <p>
                            {t('sec1_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">{t('sec2_title')}</h2>
                        <p>
                            {t('sec2_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('sec3_title')}</h2>
                        <p>
                            {t('sec3_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('sec4_title')}</h2>
                        <p>
                            {t('sec4_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('sec5_title')}</h2>
                        <p>
                            {t('sec5_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> {t('sec6_title')}
                        </h2>
                        <p>
                            {t('sec6_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> {t('sec7_title')}
                        </h2>
                        <p>
                            {t('sec7_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> {t('sec8_title')}
                        </h2>
                        <p>
                            {t('sec8_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> {t('sec9_title')}
                        </h2>
                        <p>
                            {t('sec9_desc')}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> {t('sec10_title')}
                        </h2>
                        <p>
                            {t('sec10_desc')}
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-[#222] text-sm text-gray-500 font-bold uppercase tracking-widest">
                    {t('last_updated')}
                </div>
            </div>
        </main>
    );
}
