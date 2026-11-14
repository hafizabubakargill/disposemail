import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import Link from "next/link";

// DisposeMail has no public API. This page says so honestly and is kept out of the index and sitemap.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ApiDocs' });
    return {
        title: t('meta_title'),
        description: t('meta_desc'),
        robots: { index: false, follow: true },
        alternates: { canonical: `https://disposemail.xyz/${locale === 'en' ? '' : locale + '/'}api-docs` },
    };
}

export default async function ApiDocsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ApiDocs' });
    const prefix = locale === 'en' ? '' : `/${locale}`;
    const linkClass = "text-blue-600 dark:text-blue-400 font-semibold underline";

    return (
        <div className="w-full min-h-[70vh] flex flex-col items-center p-6 sm:p-12">
            <div className="max-w-3xl w-full space-y-10 text-gray-600 dark:text-gray-400 leading-relaxed">
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">{t('page_title')}</h1>
                    <p className="text-lg">{t('page_subtitle')}</p>
                </div>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('status_title')}</h2>
                    <p>{t('status_body')}</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('today_title')}</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{t('today_1')}</li>
                        <li>{t('today_2')}</li>
                        <li>{t('today_3')}</li>
                        <li>{t('today_4')}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('testing_title')}</h2>
                    <p className="mb-3">{t('testing_body')}</p>
                    <Link className={linkClass} href="/blog/why-developers-need-disposable-email-apis-qa-testing-2026">{t('testing_link')}</Link>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('contact_title')}</h2>
                    <p className="mb-3">{t('contact_body')}</p>
                    <Link className={linkClass} href={`${prefix}/contact`}>{t('contact_link')}</Link>
                </section>
            </div>
        </div>
    );
}
