import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
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
            <div className="w-full min-h-[80vh] flex flex-col items-center p-6 sm:p-12 border-t border-gray-200 dark:border-[#1a1a1a] relative">
                {/* Background Details */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

                <div className="max-w-4xl w-full text-left space-y-12 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-500 mb-2 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] dark:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                            {t('page_title')}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                            {t('page_subtitle')}
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Endpoint 1: Generate */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1f1f1f] shadow-xl dark:shadow-2xl relative group overflow-hidden transition-all duration-300 hover:border-blue-500/30">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">{t('endpoint_generate')}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 relative z-10">{t('endpoint_generate_desc')}</p>

                            <div className="space-y-4 relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <span className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 font-mono text-sm font-bold rounded-lg border border-green-500/20 self-start">POST</span>
                                    <code className="text-blue-700 dark:text-blue-300 font-mono bg-blue-500/10 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-500/10 dark:border-blue-800/30 flex-1 truncate text-sm">
                                        https://disposemail.xyz/api/v1/addresses
                                    </code>
                                </div>
                                <div className="mt-4 bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-[#222]">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('response')}</h4>
                                    <pre className="text-gray-800 dark:text-gray-300 font-mono text-sm overflow-x-auto">
                                        {`{
  "address": "random891@disposemail.xyz",
  "expires_at": "2026-03-06T15:58:00Z"
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Endpoint 2: Messages */}
                        <div className="p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1f1f1f] shadow-xl dark:shadow-2xl relative group overflow-hidden transition-all duration-300 hover:border-purple-500/30">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">{t('endpoint_messages')}</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 relative z-10">{t('endpoint_messages_desc')}</p>

                            <div className="space-y-4 relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-mono text-sm font-bold rounded-lg border border-blue-500/20 self-start">GET</span>
                                    <code className="text-purple-700 dark:text-purple-300 font-mono bg-purple-500/10 dark:bg-purple-900/20 px-4 py-2 rounded-lg border border-purple-500/10 dark:border-purple-800/30 flex-1 truncate text-sm">
                                        https://disposemail.xyz/api/v1/addresses/:address/messages
                                    </code>
                                </div>
                                <div className="mt-4 bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-[#222]">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('response')}</h4>
                                    <pre className="text-gray-800 dark:text-gray-300 font-mono text-sm overflow-x-auto">
                                        {`{
  "messages": [
    {
      "id": "msg_98abc123",
      "from": "verify@netflix.com",
      "subject": "Your verification code",
      "body": "Your code is 491029.",
      "received_at": "2026-03-06T14:59:12Z"
    }
  ]
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Rate Limiting Notice */}
                        <div className="p-6 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 mt-8">
                            <div className="flex items-start gap-4">
                                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <h3 className="text-orange-800 dark:text-orange-400 font-bold mb-1">{t('rate_limit')}</h3>
                                    <p className="text-orange-700 dark:text-orange-200/80 text-sm leading-relaxed">{t('rate_limit_desc')}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </NextIntlClientProvider>
    );
}
