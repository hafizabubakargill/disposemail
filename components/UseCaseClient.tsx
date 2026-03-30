'use client';

import React from "react";
import { Hero } from "@/components/Hero";
import { useEmailSession } from "@/hooks/useEmailSession";
import Inbox from "@/components/Inbox";

import { useTranslations } from 'next-intl';

interface UseCaseClientProps {
    serviceName: string;
    useCaseTitle: string;
    useCaseDescription: string;
}

export default function UseCaseClient({ serviceName, useCaseTitle, useCaseDescription }: UseCaseClientProps) {
    const t = useTranslations('UseCase');
    const {
        email,
        timeLeft,
        progress,
        handleRefresh,
        isCustom,
        setIsCustom,
        customPrefix,
        setCustomPrefix,
        isMounted,
        sessionToken
    } = useEmailSession();

    return (
        <div className="flex flex-col min-h-screen">
            <div className="pt-20 pb-10 text-center px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest mb-8 border border-blue-100 dark:border-blue-900/20 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    {t('specializedProtection', { serviceName })}
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white leading-[0.9]">
                    {useCaseTitle}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-3xl mx-auto mb-12 px-4">
                    {useCaseDescription}
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
                        <Inbox emailAddress={email} sessionToken={sessionToken} />
                    </div>
                </section>
            )}

            <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gray-100 dark:border-[#1a1a1a]">
                <h2 className="text-3xl font-black tracking-tight mb-12 text-center md:text-left">{t('whyUse', { serviceName })}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 dark:text-gray-400">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('privacyFirst')}</h3>
                        <p className="text-sm leading-relaxed">{t('privacyFirstDesc', { serviceName })}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('spamNeutralization')}</h3>
                        <p className="text-sm leading-relaxed">{t('spamNeutralizationDesc', { serviceName })}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('securityAgainstBreaches')}</h3>
                        <p className="text-sm leading-relaxed">{t('securityAgainstBreachesDesc', { serviceName })}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('instantAccess')}</h3>
                        <p className="text-sm leading-relaxed">{t('instantAccessDesc', { serviceName })}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
