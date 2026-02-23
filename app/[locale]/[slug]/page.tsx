import { getUseCase, useCases } from "@/lib/use-cases";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { useEmailSession } from "@/hooks/useEmailSession";
import Inbox from "@/components/Inbox";

export async function generateStaticParams() {
    const locales = ['en', 'es', 'pt', 'ru', 'zh'];
    const params: { locale: string; slug: string }[] = [];

    locales.forEach(locale => {
        const localeCases = useCases[locale] || useCases.en;
        localeCases.forEach(uc => {
            params.push({ locale, slug: uc.slug });
        });
    });

    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;
    const useCase = getUseCase(slug, locale);

    if (!useCase) return {};

    return {
        title: useCase.title,
        description: useCase.description,
        alternates: {
            canonical: `https://disposemail.xyz/${locale === 'en' ? '' : locale + '/'}${slug}`,
        }
    };
}

export default function UseCasePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = React.use(params as any) as any;
    const useCase = getUseCase(slug, locale);
    const messages = React.use(getMessages() as any) as any;

    const {
        email,
        timeLeft,
        progress,
        handleRefresh,
        isCustom,
        setIsCustom,
        customPrefix,
        setCustomPrefix,
        isMounted
    } = useEmailSession();

    if (!useCase) {
        notFound();
    }

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <div className="flex flex-col min-h-screen">
                <div className="pt-20 pb-10 text-center px-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 dark:border-blue-900/20 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        Specialized Protection for {useCase.service}
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white leading-[0.9]">
                        {useCase.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-3xl mx-auto mb-12 px-4">
                        {useCase.description}
                    </p>
                </div>

                {isMounted && email && (
                    <section className="relative -mt-10 overflow-hidden">
                        <Hero
                            email={email}
                            timeLeft={timeLeft}
                            progress={progress}
                            handleRefresh={handleRefresh}
                            isCustom={isCustom}
                            setIsCustom={setIsCustom}
                            customPrefix={customPrefix}
                            setCustomPrefix={setCustomPrefix}
                        />
                        <div className="w-full px-4 mb-20">
                            <Inbox emailAddress={email} />
                        </div>
                    </section>
                )}

                <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gray-100 dark:border-[#1a1a1a]">
                    <h2 className="text-3xl font-black tracking-tight mb-12 text-center md:text-left">Why use temporary email for {useCase.service}?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 dark:text-gray-400">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Privacy First</h3>
                            <p className="text-sm leading-relaxed">Don't let {useCase.service} link your social activity to your permanent digital identity. A disposable address creates a secure barrier.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Spam Neutralization</h3>
                            <p className="text-sm leading-relaxed">Stop the flood of notification emails and marketing drips. Your temporary inbox expires, and so does the noise.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Security Against Breaches</h3>
                            <p className="text-sm leading-relaxed">If {useCase.service} or an associated service is breached, your primary email remains safe and unknown to hackers.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Instant Access</h3>
                            <p className="text-sm leading-relaxed">Generate your address in one click, verify your account, and get back to what matters. No registration required.</p>
                        </div>
                    </div>
                </section>
            </div>
        </NextIntlClientProvider>
    );
}
