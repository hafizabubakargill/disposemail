import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    // We get the translations specifically for the requested locale
    const t = await getTranslations({ locale, namespace: 'ApiDocs' });

    return {
        title: t('meta_title'),
        description: t('meta_desc'),
        alternates: {
            canonical: `https://disposemail.xyz/${locale === 'en' ? '' : locale + '/'}api-docs`,
        }
    };
}

export default async function ApiDocsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages();
    const t = await getTranslations({ locale, namespace: 'ApiDocs' });

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <div className="w-full bg-[#050505] min-h-[70vh] flex flex-col items-center justify-center p-6 border-t border-[#1a1a1a]">
                <div className="max-w-2xl text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600/10 text-purple-500 mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        {t('page_title')}
                    </h1>

                    <p className="text-lg text-gray-400">
                        {t('page_subtitle')}
                    </p>

                    <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-start gap-4 text-left">
                            <div className="mt-1 text-blue-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-300 leading-relaxed font-medium">
                                {t('coming_soon')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </NextIntlClientProvider>
    );
}
