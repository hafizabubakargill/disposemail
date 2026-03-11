import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | DisposeMail Disposable Email',
    description: 'Read DisposeMail\'s privacy policy. We collect no personal data, store no logs, and auto-delete all emails after expiry. Your anonymity is our core commitment.',
    alternates: { canonical: 'https://disposemail.xyz/privacy' },
    openGraph: {
        title: 'Privacy Policy — DisposeMail',
        description: 'DisposeMail collects no personal data, stores no logs, and auto-deletes all emails. Read our full privacy policy.',
        url: 'https://disposemail.xyz/privacy',
        type: 'website',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
