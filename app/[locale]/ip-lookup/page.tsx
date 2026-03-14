import type { Metadata } from 'next';
import IpLookupTool from '@/components/IpLookupTool';

export const metadata: Metadata = {
    title: 'IP Address Lookup | What Is My IP? Find IPv4, IPv6 & ISP — DisposeMail',
    description: 'Check what is your public IP address instantly. Our free IP lookup tool detects your IPv4 or IPv6 address, exact city location, country, Internet Service Provider (ISP), ASN, postal code, and timezone. No sign-up, no logs, completely private.',
    keywords: ['what is my ip', 'ip address lookup', 'find my ip', 'ipv4 ipv6 checker', 'isp lookup', 'asn lookup', 'ip geolocation', 'ip location tracker', 'free ip tool'],
    alternates: { canonical: 'https://disposemail.xyz/ip-lookup' },
    openGraph: {
        title: 'Free IP Address Lookup — What Is My IP? | DisposeMail',
        description: 'Instantly detect your public IPv4/IPv6 address, ISP, ASN, exact geographic location, timezone, and postal code. Free, private, no logs.',
        url: 'https://disposemail.xyz/ip-lookup',
        type: 'website',
        siteName: 'DisposeMail',
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
