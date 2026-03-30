import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { englishPosts } from '@/lib/blog-data/en';
import { useCases } from '@/lib/use-cases';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Sitemap' });
    const baseUrl = 'https://disposemail.xyz';
    const canonical = `${baseUrl}${locale === 'en' ? '' : '/' + locale}/sitemap`;

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: canonical,
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
            url: canonical,
            type: 'website',
        },
    };
}

const STATIC_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Privacy Blog' },
    { href: '/free-tools', label: 'Free Privacy Tools' },
    { href: '/ip-lookup', label: 'IP Address Lookup' },
    { href: '/domain-checker', label: 'Email Domain Checker' },
    { href: '/password-generator', label: 'Secure Password Generator' },
    { href: '/identity-generator', label: 'Fictional Identity Generator' },
    { href: '/secure-notes', label: 'Encrypted Secure Notes' },
    { href: '/data-breach-checker', label: 'Data Breach Checker' },
    { href: '/faq', label: 'Frequently Asked Questions' },
    { href: '/api-docs', label: 'API Developer Documentation' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact Support' },
];

export default async function SitemapPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Sitemap' });
    const currentUseCases = useCases[locale] || useCases.en;

    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <header className="mb-16 text-center">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4">
                    {t('title')}
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                    {t('subtitle')}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Platform Pages */}
                <section>
                    <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-blue-600 dark:bg-blue-400"></span>
                        {t('static_title')}
                    </h2>
                    <ul className="space-y-4">
                        {STATIC_LINKS.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="space-y-16">
                    {/* Use Cases */}
                    <section>
                        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-emerald-600 dark:bg-emerald-400"></span>
                            {t('use_cases_title')}
                        </h2>
                        <ul className="space-y-4">
                            {currentUseCases.map(uc => (
                                <li key={uc.slug}>
                                    <Link href={`/${uc.slug}`} className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
                                        {uc.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Blog Posts */}
                    <section>
                        <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-orange-600 dark:bg-orange-400"></span>
                            {t('blog_title')}
                        </h2>
                        <ul className="space-y-4">
                            {englishPosts.slice(0, 10).map(post => (
                                <li key={post.slug}>
                                    <Link href={`/blog/${post.slug}`} className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition-colors">
                                        {post.title}
                                    </Link>
                                </li>
                            ))}
                            {englishPosts.length > 10 && (
                                <li>
                                    <Link href="/blog" className="text-sm font-bold text-gray-400 hover:text-blue-500 underline transition-colors">
                                        View all articles...
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </section>
                </div>
            </div>

            {/* Back to Home */}
            <div className="mt-20 pt-8 border-t border-gray-100 dark:border-white/5 flex justify-center">
                <Link href="/" className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:scale-105 transition-transform">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
