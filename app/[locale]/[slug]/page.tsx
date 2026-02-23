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

import UseCaseClient from "@/components/UseCaseClient";

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

export default async function UseCasePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    const useCase = getUseCase(slug, locale);
    const messages = await getMessages();

    if (!useCase) {
        notFound();
    }

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <UseCaseClient
                serviceName={useCase.service}
                useCaseTitle={useCase.title}
                useCaseDescription={useCase.description}
            />
        </NextIntlClientProvider>
    );
}

