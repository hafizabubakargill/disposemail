'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { classifyDomain, DisposableVerdict } from '@/lib/disposable-domains';
import { tr } from '@/lib/tr';

interface Result {
    domain: string;
    verdict: DisposableVerdict;
    mx: string[] | null; // null = lookup failed, [] = none found
    exists: boolean;
}

const cleanDomain = (input: string) => {
    let d = input.trim().toLowerCase();
    d = d.replace(/^https?:\/\//, '').split('/')[0];
    if (d.includes('@')) d = d.split('@').pop() || '';
    return d;
};

export default function DisposableEmailChecker() {
    const locale = useLocale();
    const t = (x: string) => tr(locale, x);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState('');

    const check = async (e: React.FormEvent) => {
        e.preventDefault();
        const domain = cleanDomain(input);
        if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) {
            setError(t('Enter a valid email address or domain, for example name@example.com.'));
            setResult(null);
            return;
        }
        setError('');
        setLoading(true);
        let mx: string[] | null = null;
        let exists = true;
        try {
            const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=15`, {
                headers: { Accept: 'application/dns-json' },
            });
            if (res.ok) {
                const json = await res.json();
                exists = json.Status !== 3;
                mx = (json.Answer || []).filter((a: any) => a.type === 15).map((a: any) => String(a.data).split(' ').pop() || '');
            }
        } catch {
            mx = null;
        }
        setResult({ domain, verdict: classifyDomain(domain), mx, exists });
        setLoading(false);
    };

    const headline = (r: Result) => {
        if (!r.exists) return { text: t('This domain does not exist'), tone: 'red' };
        if (r.verdict === 'known') return { text: t('Known disposable email provider'), tone: 'amber' };
        if (r.verdict === 'own') return { text: t('This is a DisposeMail domain (disposable)'), tone: 'amber' };
        return { text: t('Not on our list of known disposable domains'), tone: 'green' };
    };

    const tones: Record<string, string> = {
        red: 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
        amber: 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800',
        green: 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800',
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={check} className="flex flex-col sm:flex-row gap-3">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={t("name@example.com or example.com")}
                    aria-label={t("Email address or domain")}
                    className="flex-1 px-5 py-4 rounded-2xl border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111] text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
                <button type="submit" disabled={loading || !input.trim()} className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50">
                    {loading ? t('Checking…') : t('Check')}
                </button>
            </form>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            {result && (
                <div className={`mt-6 p-6 rounded-2xl border ${tones[headline(result).tone]} text-left`}>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{headline(result).text}</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3"><strong>{t('Domain:')}</strong> {result.domain}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        <strong>{t('Mail servers (MX):')}</strong>{' '}
                        {result.mx === null ? t('lookup failed, try again') : result.mx.length ? result.mx.join(', ') : t('none found, so this domain cannot normally receive email')}
                    </p>
                    {result.verdict === 'unlisted' && result.exists && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {t('This is not proof the domain is permanent. Our list covers well-known providers only, and new disposable domains appear every day.')}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
