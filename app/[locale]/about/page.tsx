import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n-nav';

// Edit these two values to change who is named on the About page.
const AUTHOR_NAME = 'Hafiz Abubakar Gill';
const SUPPORT_EMAIL = 'support@disposemail.xyz';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'About' });
    return {
        title: { absolute: `${t('title')} | DisposeMail` },
        description: t('mission_desc').replace(/<[^>]+>/g, ''),
    };
}

const card = 'bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-[#222] shadow-sm';
const h2 = 'text-2xl font-bold text-gray-900 dark:text-white mb-4';
const strong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'About' });

    const personJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        mainEntity: {
            '@type': 'Organization',
            name: 'DisposeMail',
            url: 'https://disposemail.xyz',
            email: SUPPORT_EMAIL,
            founder: { '@type': 'Person', name: AUTHOR_NAME },
        },
    };

    return (
        <main className="min-h-screen bg-transparent text-foreground p-8 md:p-24 relative overflow-hidden transition-colors">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
            <div className="max-w-4xl mx-auto z-10 relative">
                <h1 className="text-4xl md:text-6xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tighter">
                    {t('title')}
                </h1>

                <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400 max-w-none space-y-8">
                    <section className={card}>
                        <h2 className={h2}>{t('mission_title')}</h2>
                        <p>{t.rich('mission_desc', { strong })}</p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className={card}>
                            <h2 className={h2}>{t('why_exist_title')}</h2>
                            <p>{t('why_exist_desc')}</p>
                        </section>
                        <section className={card}>
                            <h2 className={h2}>{t('tech_title')}</h2>
                            <p>{t('tech_desc')}</p>
                        </section>
                    </div>

                    <section className="bg-blue-600/5 dark:bg-blue-600/10 p-8 rounded-3xl border border-blue-600/20 shadow-sm">
                        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{t('commitment_title')}</h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li>{t.rich('item1', { strong })}</li>
                            <li>{t.rich('item2', { strong })}</li>
                            <li>{t.rich('item3', { strong })}</li>
                            <li>{t.rich('item4', { strong })}</li>
                        </ul>
                    </section>

                    <section className={card}>
                        <h2 className={h2}>{t('author_title')}</h2>
                        <div className="flex items-start gap-5">
                            <div aria-hidden="true" className="shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-xl font-black">
                                {AUTHOR_NAME.split(' ').map(w => w[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                                <p className="!mt-0 font-bold text-gray-900 dark:text-white">{AUTHOR_NAME}</p>
                                <p className="!mt-1">{t('author_bio', { name: AUTHOR_NAME })}</p>
                            </div>
                        </div>
                    </section>

                    <section className={card}>
                        <h2 className={h2}>{t('transparency_title')}</h2>
                        <p>{t('transparency_desc', { email: SUPPORT_EMAIL })}</p>
                        <Link href="/contact" className="inline-block mt-2 text-blue-600 dark:text-blue-400 font-bold">
                            {t('contact_cta')} →
                        </Link>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-[#222] flex justify-between items-center">
                    <Link href="/" className="text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400 font-bold uppercase tracking-widest text-xs transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        {t('back_inbox')}
                    </Link>
                </div>
            </div>
        </main>
    );
}
