import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Navbar' });
    
    return {
        title: t('about') + ' | DisposeMail',
        description: "Learn about the mission and technology behind DisposeMail.",
        alternates: {
            canonical: `https://disposemail.xyz/${locale === 'en' ? '' : locale + '/'}about`,
        }
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
