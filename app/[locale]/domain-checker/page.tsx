import type { Metadata } from 'next';
import DomainCheckerTool from '@/components/DomainCheckerTool';

export const metadata: Metadata = {
    title: 'DNS Lookup Tool | Check MX, A, TXT & AAAA Records — DisposeMail',
    description: 'Instantly query all DNS records for any domain. Check MX records (mail servers), A/AAAA IP addresses, and TXT records including SPF and DMARC policies. Free, live DNS verification tool — no signup needed.',
    keywords: ['dns lookup', 'mx record checker', 'email domain checker', 'spf record lookup', 'dmarc checker', 'dns record tool', 'check mx records', 'email verification dns', 'domain checker tool', 'a record lookup'],
    alternates: { canonical: 'https://disposemail.xyz/domain-checker' },
    openGraph: {
        title: 'Free DNS Lookup Tool — Check All DNS Records | DisposeMail',
        description: 'Lookup MX records (email servers), A/AAAA IP addresses, and TXT records (SPF, DMARC) for any domain. Live, private, client-side DNS queries.',
        url: 'https://disposemail.xyz/domain-checker',
        type: 'website',
        siteName: 'DisposeMail',
    },
};

export default function DomainCheckerPage({ params: { locale } }: { params: { locale: string } }) {
    return (
        <div className="max-w-6xl mx-auto px-6 py-20 min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
                    DNS Lookup Tool<span className="text-indigo-500">.</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Instantly check MX mail servers, A/AAAA server IPs, and TXT records (SPF & DMARC) for any domain — live, private, and completely free.
                </p>
            </div>
            <DomainCheckerTool />
        </div>
    );
}
