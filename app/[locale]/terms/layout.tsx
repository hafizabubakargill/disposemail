import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Footer' });
    
    return {
        title: t('terms') + ' | DisposeMail',
        description: "The terms of service for utilizing DisposeMail.",
        alternates: {
            canonical: `https://disposemail.xyz/${locale === 'en' ? '' : locale + '/'}terms`,
        }
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
