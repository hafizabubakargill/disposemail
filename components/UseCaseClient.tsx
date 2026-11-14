'use client';

import React from "react";
import { Hero } from "@/components/Hero";
import { useEmailSession } from "@/hooks/useEmailSession";
import Inbox from "@/components/Inbox";
import { tr } from '@/lib/tr';
import { useLocale } from 'next-intl';
import type { UseCaseDetails } from '@/lib/use-case-details';

interface UseCaseClientProps {
    serviceName: string;
    useCaseTitle: string;
    useCaseDescription: string;
    details?: UseCaseDetails;
}

export default function UseCaseClient({ serviceName, useCaseTitle, useCaseDescription, details }: UseCaseClientProps) {
    const locale = useLocale();
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
                    {tr(locale, 'Specialized Protection for {service}').replace('{service}', serviceName)}
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


            {details && (
                <section className="max-w-3xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-[#1a1a1a] text-gray-600 dark:text-gray-400">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Last reviewed: November 2026</p>
                    <h2 className="text-3xl font-black tracking-tight mb-6 text-gray-900 dark:text-white">Using a temporary email with {serviceName}: what works and what does not</h2>
                    <p className="leading-relaxed mb-10">{details.intro}</p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">What {serviceName} sends to your email</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-10">{details.emails.map((e) => <li key={e}>{e}</li>)}</ul>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 p-6">
                            <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-3">A temporary address can work for</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm">{details.works.map((e) => <li key={e}>{e}</li>)}</ul>
                        </div>
                        <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 p-6">
                            <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-3">It is a poor fit for</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm">{details.doesNot.map((e) => <li key={e}>{e}</li>)}</ul>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Better options for an account you want to keep</h3>
                    <ul className="list-disc pl-6 space-y-2 mb-10">{details.better.map((e) => <li key={e}>{e}</li>)}</ul>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">How to use DisposeMail for a quick sign-up</h3>
                    <ol className="list-decimal pl-6 space-y-2 mb-10">{details.steps.map((e) => <li key={e}>{e}</li>)}</ol>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequently asked questions</h3>
                    <div className="space-y-6 mb-10">
                        {details.faq.map((f) => (
                            <div key={f.q}>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{f.q}</h4>
                                <p className="leading-relaxed text-sm">{f.a}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-sm leading-relaxed">
                        DisposeMail is independent and is not affiliated with {serviceName}. Using any temporary address to break a service&apos;s rules is not something we support. Read our <a className="text-blue-600 dark:text-blue-400 font-semibold underline" href="/blog/throwaway-email-address-guide-2026">throwaway email guide</a> and <a className="text-blue-600 dark:text-blue-400 font-semibold underline" href="/privacy">privacy policy</a> for how the service works.
                    </p>
                </section>
            )}

            <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gray-100 dark:border-[#1a1a1a]">
                <h2 className="text-3xl font-black tracking-tight mb-12 text-center md:text-left">{tr(locale, 'Why use temporary email for {service}?').replace('{service}', serviceName)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-600 dark:text-gray-400">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{tr(locale, "Privacy First")}</h3>
                        <p className="text-sm leading-relaxed">{tr(locale, "Don't let {service} link your social activity to your permanent digital identity. A disposable address creates a secure barrier.").replace('{service}', serviceName)}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{tr(locale, "Spam Neutralization")}</h3>
                        <p className="text-sm leading-relaxed">{tr(locale, "Stop the flood of notification emails and marketing drips. Your temporary inbox expires, and so does the noise.")}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{tr(locale, "Security Against Breaches")}</h3>
                        <p className="text-sm leading-relaxed">{tr(locale, 'If {service} or an associated service is breached, your primary email remains safe and unknown to hackers.').replace('{service}', serviceName)}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{tr(locale, "Instant Access")}</h3>
                        <p className="text-sm leading-relaxed">{tr(locale, "Generate your address in one click, verify your account, and get back to what matters. No registration required.")}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
