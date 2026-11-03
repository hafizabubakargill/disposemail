import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import DisposableEmailChecker from '@/components/DisposableEmailChecker';
import { KNOWN_DISPOSABLE_DOMAINS } from '@/lib/disposable-domains';
import { Link } from '@/i18n-nav';
import { tr, localizeMeta } from '@/lib/tr';

const baseMetadata: Metadata = {
    title: 'Disposable Email Checker: Is This Email Domain Disposable?',
    description: 'Check whether an email address or domain belongs to a known disposable email provider, and see its MX records. Free, no signup.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return localizeMeta(baseMetadata, locale);
}

const L = 'text-blue-600 dark:text-blue-400 font-semibold underline';

export default async function DisposableEmailCheckerPage() {
    const locale = await getLocale();
    const t = (s: string) => tr(locale, s);
    return (
        <div className="max-w-4xl mx-auto px-6 py-20 min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
                    {t('Disposable Email Checker')}<span className="text-blue-500">.</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    {t('Paste an email address or domain to see whether it belongs to a known disposable email provider and whether it has mail servers.')}
                </p>
            </div>
            <DisposableEmailChecker />

            <section className="mt-20 space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('How the check works')}</h2>
                <p>{t("Two things are checked in your browser. First, the domain is compared with a list of well-known disposable email providers that we maintain by hand, plus the domains DisposeMail itself uses. Second, a DNS query looks up the domain's MX records, which say whether it is set up to receive email. The lookup goes to Cloudflare's public DNS service; we do not store what you enter.")}</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('What the result does and does not tell you')}</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>{t('Listed: the domain is a known disposable provider, so addresses on it are usually short-lived.')}</li>
                    <li>{t('Not listed: only means we do not have it on our list. Thousands of disposable domains exist and new ones appear daily, so this is not a guarantee.')}</li>
                    <li>{t('No MX records: the domain normally cannot receive email, which is useful when you are validating signups.')}</li>
                    <li>{t('A top-level domain such as .xyz says nothing by itself. Plenty of legitimate businesses use it.')}</li>
                </ul>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('For developers: handling disposable addresses')}</h2>
                <p>{t('If you run a signup form, decide what disposable addresses mean for your service before you block them. Blocking can turn away privacy-conscious users, while allowing them can increase abuse and fake accounts. A reasonable middle ground is to allow them but require email confirmation, rate-limit signups, and treat the account as lower trust. Whatever you choose, verify the address by sending a confirmation message rather than relying on a list alone.')}</p>
                <p>
                    <Link className={L} href="/domain-checker">{t('Email DNS and MX lookup')}</Link>
                    {' · '}
                    <Link className={L} href="/">{t('Get a temporary address')}</Link>
                </p>
                <details className="text-sm">
                    <summary className="cursor-pointer font-semibold">{t('Providers on our list')} ({KNOWN_DISPOSABLE_DOMAINS.length})</summary>
                    <p className="mt-3 break-words">{KNOWN_DISPOSABLE_DOMAINS.join(', ')}</p>
                </details>
            </section>
        </div>
    );
}
