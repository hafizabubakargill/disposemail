import type { Metadata } from 'next';
import IpLookupTool from '@/components/IpLookupTool';

export const metadata: Metadata = {
    title: 'IP Address Lookup | What is my IP? — DisposeMail',
    description: 'Instantly find your public IP address, ISP, ASN, location, and timezone. Completely free, no-log IP checker.',
    alternates: { canonical: 'https://disposemail.xyz/ip-lookup' },
    openGraph: {
        title: 'IP Address Lookup Tool',
        description: 'Check your public IPv4/IPv6 address, exact location, ISP, and ASN.',
        url: 'https://disposemail.xyz/ip-lookup',
        type: 'website',
    },
};

export default function IpLookupPage({ params: { locale } }: { params: { locale: string } }) {
    return (
        <div className="max-w-6xl mx-auto px-6 py-20 min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
                    IP Address Lookup<span className="text-orange-500">.</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Instantly identify your public IPv4 or IPv6 address, exact geographical location, Internet Service Provider (ISP), and ASN data.
                </p>
            </div>
            <IpLookupTool />
        </div>
    );
}
