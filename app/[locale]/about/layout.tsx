import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About DisposeMail | Secure Disposable Email Service',
    description: 'Learn about DisposeMail — a privacy-first disposable email service built to protect your identity online. No registration, no tracking, auto-expiry, and real-time delivery.',
    alternates: { canonical: 'https://disposemail.xyz/about' },
    openGraph: {
        title: 'About DisposeMail | Secure Disposable Email Service',
        description: 'Learn about DisposeMail — privacy-first temporary email with no registration, no tracking, and real-time inbox.',
        url: 'https://disposemail.xyz/about',
        type: 'website',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
