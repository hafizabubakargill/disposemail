import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Blog' });
    
    return {
        title: t('title') + ' | DisposeMail',
        description: "Read the latest news, guides, and insights on online privacy from our experts.",
        alternates: {
            canonical: `https://disposemail.xyz/${locale === 'en' ? '' : locale + '/'}blog`,
        }
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
