import type { Metadata } from 'next';
import IpLookupTool from '@/components/IpLookupTool';
import { tr, localizeMeta } from '@/lib/tr';

const baseMetadata = {
    title: 'What Is My IP Address? Free IP Lookup (IPv4, IPv6, ISP)',
    description: 'See your public IP address and look up any IPv4 or IPv6 address: approximate location, internet provider, ASN and time zone. Free, no signup.',
    keywords: ['what is my ip', 'ip address lookup', 'find my ip', 'ipv4 ipv6 checker', 'isp lookup', 'asn lookup', 'ip geolocation', 'ip location tracker', 'free ip tool'],
    openGraph: {
        title: 'Free IP Address Lookup: What Is My IP? | DisposeMail',
        description: 'See your public IPv4 or IPv6 address, internet provider, ASN, approximate location and time zone.',
        url: 'https://disposemail.xyz/ip-lookup',
        type: 'website',
        siteName: 'DisposeMail',
    },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return localizeMeta(baseMetadata as any, locale);
}

export default async function IpLookupPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return (
        <div className="max-w-6xl mx-auto px-6 py-20 min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
                    {tr(locale, "IP Address Lookup")}<span className="text-orange-500">.</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    {tr(locale, "Identify your public IPv4 or IPv6 address, approximate location, Internet Service Provider (ISP) and ASN data.")}
                </p>
            </div>
            <IpLookupTool />
            {locale === 'en' && (
                <section className="max-w-3xl mx-auto mt-20 text-left space-y-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Last reviewed: November 2026</p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What does an IP lookup show?</h2>
                    <p>An IP address identifies a network connection, not a person. This tool shows the public address your connection appears to use, or the address you enter, together with the approximate city, region and country, the internet provider or organisation that owns the address block, its network number (ASN), and the time zone. These details come from databases that map address ranges to networks and places.</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">How accurate is the location?</h3>
                    <p>The country is usually right. The city is often close but can be wrong, especially on mobile networks and for providers that register addresses at a head office. A lookup cannot give a street address and cannot say who is using the connection.</p>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Common uses</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Checking what websites see, for example after turning a VPN on or off.</li>
                        <li>Finding the public address to add to a firewall or database allow-list.</li>
                        <li>Seeing which network a suspicious login or message came from.</li>
                        <li>Troubleshooting whether you are behind a shared or changing address.</li>
                    </ul>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Frequently asked questions</h3>
                    <div className="space-y-4">
                        <div><h4 className="font-bold text-gray-900 dark:text-white mb-1">Can someone find my home address from my IP?</h4><p className="text-sm">No. Only your internet provider can link an address to a customer, and it releases that information only under legal process.</p></div>
                        <div><h4 className="font-bold text-gray-900 dark:text-white mb-1">Why is the city wrong?</h4><p className="text-sm">Location data is an estimate. Mobile networks, VPNs and provider registrations commonly cause errors.</p></div>
                        <div><h4 className="font-bold text-gray-900 dark:text-white mb-1">Why does my IP change?</h4><p className="text-sm">Many providers assign dynamic addresses that change when your router restarts, and mobile users change address as they move between networks.</p></div>
                        <div><h4 className="font-bold text-gray-900 dark:text-white mb-1">Does a VPN make me anonymous?</h4><p className="text-sm">It changes the address websites see, but accounts, cookies and browser details can still identify you.</p></div>
                    </div>
                    <p className="text-sm">Read our <a className="text-blue-600 dark:text-blue-400 font-semibold underline" href="/blog/what-is-my-ip-address-lookup-tool-guide">full IP address guide</a> and our <a className="text-blue-600 dark:text-blue-400 font-semibold underline" href="/privacy">privacy policy</a> for how lookups are handled.</p>
                </section>
            )}
        </div>
    );
}
