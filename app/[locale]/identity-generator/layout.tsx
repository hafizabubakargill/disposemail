import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Random Identity Generator — Fake Name, Address & Phone | DisposeMail',
    description: 'Generate a complete random identity — fake name, address, phone number, and more for 8 countries (US, UK, Canada, Australia, Germany, France, Pakistan, India). 100% free, no registration.',
    openGraph: {
        title: 'Random Identity Generator — Fake Name, Address & Phone | DisposeMail',
        description: 'Instantly generate a random name, address, phone number, and full profile for 8 countries. 100% client-side, no data stored.',
        type: 'website',
        url: 'https://disposemail.com/identity-generator',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Random Identity Generator | DisposeMail',
        description: 'Generate fake names, addresses & phone numbers for 8 countries — free, instant, no registration.',
    },
    alternates: {
        canonical: 'https://disposemail.com/identity-generator',
    },
    keywords: [
        'fake name generator',
        'random identity generator',
        'random address generator',
        'fake address USA',
        'random phone number generator',
        'fake person generator',
        'random profile generator',
        'anonymous identity online',
        'fake name and address',
        'random name generator',
    ],
};

export default function IdentityGeneratorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
