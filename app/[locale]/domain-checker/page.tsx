import type { Metadata } from 'next';
import DomainCheckerTool from '@/components/DomainCheckerTool';
import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n-nav';
import { tr, localizeMeta } from '@/lib/tr';

const baseMetadata: Metadata = {
    title: 'Email DNS & MX Lookup: Check Email Hosting for Any Domain',
    description: 'Instantly query all DNS records for any domain. Check MX records (mail servers), A/AAAA IP addresses, and TXT records including SPF and DMARC policies. Free, live DNS verification tool — no signup needed.',
    keywords: ['dns lookup', 'mx record checker', 'email domain checker', 'spf record lookup', 'dmarc checker', 'dns record tool', 'check mx records', 'email verification dns', 'domain checker tool', 'a record lookup'],
    openGraph: {
        title: 'Email DNS & MX Lookup | DisposeMail',
        description: 'Lookup MX records (email servers), A/AAAA IP addresses, and TXT records (SPF, DMARC) for any domain. Live, private, client-side DNS queries.',
        url: 'https://disposemail.xyz/domain-checker',
        type: 'website',
        siteName: 'DisposeMail',
    },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return localizeMeta(baseMetadata, locale);
}

export default async function DomainCheckerPage() {
    const locale = await getLocale();
    return (
        <div className="max-w-6xl mx-auto px-6 py-20 min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
                    {tr(locale, 'Email DNS & MX Lookup')}<span className="text-indigo-500">.</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">{tr(locale, 'Instantly check MX mail servers, A/AAAA server IPs, and TXT records (SPF & DMARC) for any domain — live, private, and completely free.')}</p>
            </div>
            <DomainCheckerTool />

            <section className="max-w-3xl mx-auto mt-20 text-left space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tr(locale, 'What does an email DNS check show?')}</h2>
                <p>{tr(locale, "Every domain that receives email publishes DNS records that say which servers handle its mail. This tool looks those records up so you can see where a domain's email is hosted and whether it is set up correctly.")}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tr(locale, 'MX records: who hosts the email')}</h3>
                <p>{tr(locale, 'MX (mail exchanger) records name the servers that accept mail for a domain. If the MX records point to Google, Microsoft 365 or Zoho, that is the email host. If a domain has no MX records, it normally cannot receive email at all, which is the first thing to check when messages bounce.')}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tr(locale, 'SPF and DMARC: who may send as the domain')}</h3>
                <p>{tr(locale, 'SPF and DMARC are TXT records. SPF lists the servers allowed to send mail for the domain, and DMARC tells receivers what to do with messages that fail the check. Missing or loose records make spoofing and spam-folder delivery more likely.')}</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{tr(locale, 'Common uses')}</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>{tr(locale, "Finding out which provider hosts a company's email before you migrate or integrate.")}</li>
                    <li>{tr(locale, 'Debugging why mail to a domain bounces or lands in spam.')}</li>
                    <li>{tr(locale, 'Checking that a domain you are about to use for email has MX, SPF and DMARC configured.')}</li>
                    <li>{tr(locale, "Verifying a new domain's DNS changes have propagated.")}</li>
                </ul>
                <p>{tr(locale, 'Looking for a quick inbox rather than DNS data?')} <Link href="/" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">{tr(locale, 'Generate a free temporary email address')}</Link></p>
            </section>
        </div>
    );
}
