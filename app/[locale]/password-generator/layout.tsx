import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    
    try {
        const t = await getTranslations({ locale, namespace: 'PasswordGenerator' });
        return {
            title: t('title')
        };
    } catch(err) {
        return {};
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
