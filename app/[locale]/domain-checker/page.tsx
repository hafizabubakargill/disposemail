import type { Metadata } from 'next';
import DomainCheckerTool from '@/components/DomainCheckerTool';

export const metadata: Metadata = {
    title: 'Email Domain Checker | Verify MX Records — DisposeMail',
    description: 'Instantly check if any domain or email address is configured to receive emails. Query live DNS MX records directly and securely.',
    alternates: { canonical: 'https://disposemail.xyz/domain-checker' },
    openGraph: {
        title: 'Email Domain MX Checker',
        description: 'Live DNS lookup tool to verify if a domain has MX records and can receive emails.',
        url: 'https://disposemail.xyz/domain-checker',
        type: 'website',
    },
};

export default function DomainCheckerPage({ params: { locale } }: { params: { locale: string } }) {
    return (
        <div className="max-w-6xl mx-auto px-6 py-20 min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
                    Email Domain Checker<span className="text-indigo-500">.</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Instantly verify if a domain is configured to receive email by querying its Mail Exchange (MX) DNS records.
                </p>
            </div>
            <DomainCheckerTool />
        </div>
    );
}
