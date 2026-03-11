import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | DisposeMail',
    description: 'Read DisposeMail\'s terms of service. Our disposable email service is provided free, for lawful use only. Emails auto-expire and no personal information is stored.',
    alternates: { canonical: 'https://disposemail.xyz/terms' },
    openGraph: {
        title: 'Terms of Service — DisposeMail',
        description: 'DisposeMail terms of service: free to use, no storage, no personal data, for lawful purposes only.',
        url: 'https://disposemail.xyz/terms',
        type: 'website',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
