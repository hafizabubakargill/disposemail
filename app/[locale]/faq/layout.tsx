import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ | DisposeMail — Disposable Email Questions Answered',
    description: 'Frequently asked questions about DisposeMail. Learn how disposable email works, why it expires, what subdomain emails are, and how to stay anonymous online.',
    alternates: { canonical: 'https://disposemail.xyz/faq' },
    openGraph: {
        title: 'FAQ — DisposeMail Disposable Email',
        description: 'Everything you need to know about DisposeMail: how temp emails work, security, privacy, and how to use them.',
        url: 'https://disposemail.xyz/faq',
        type: 'website',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
