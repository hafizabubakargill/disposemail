import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact DisposeMail | Privacy & Support',
    description: 'Contact the DisposeMail team for support, privacy inquiries, or partnership opportunities. We respond within 24 hours.',
    alternates: { canonical: 'https://disposemail.xyz/contact' },
    openGraph: {
        title: 'Contact DisposeMail',
        description: 'Reach out to DisposeMail for support, privacy inquiries, or any questions about our free disposable email service.',
        url: 'https://disposemail.xyz/contact',
        type: 'website',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
