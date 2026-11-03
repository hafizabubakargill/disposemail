import type { Metadata } from 'next';
import { localizeMeta } from '@/lib/tr';

const baseMetadata: Metadata = {
    title: 'Privacy & Security Blog | DisposeMail — Tips, Guides & News',
    description: 'Learn how to protect your digital privacy, stop spam, and stay anonymous online. Expert guides on disposable email, cybersecurity, and data protection from the DisposeMail team.',
    openGraph: {
        title: 'Privacy & Security Blog | DisposeMail',
        description: 'Expert guides on digital privacy, spam prevention, disposable email, and cybersecurity. Stay anonymous — stay safe.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Privacy & Security Blog | DisposeMail',
        description: 'Expert guides on digital privacy, spam prevention, and cybersecurity.',
    },
    keywords: [
        'disposable email tips', 'email privacy guide', 'stop spam email',
        'anonymous email', 'temporary email blog', 'cybersecurity tips',
        'online privacy', 'data protection',
    ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return localizeMeta(baseMetadata, locale);
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
