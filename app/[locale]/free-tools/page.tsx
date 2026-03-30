import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
    title: 'Free Privacy & Developer Tools | DisposeMail',
    description: 'A complete suite of free tools for privacy, anonymity, and development — disposable email, identity generator, QR code generator, UUID generator, Base64 encoder, and test credit card generator.',
    alternates: { canonical: 'https://disposemail.xyz/free-tools' },
    keywords: ['free privacy tools', 'free developer tools', 'disposable email', 'qr code generator', 'uuid generator', 'base64 encoder', 'identity generator', 'test credit card'],
};

export default async function FreeToolsPage({ params }: any) {
    // Next.js 15+ async params
    const resolvedParams = await params;
    const locale = resolvedParams?.locale || 'en';
    
    const t = await getTranslations({ locale, namespace: 'FreeToolsPage' });
    const tl = await getTranslations({ locale, namespace: 'ToolsList' });

    const TOOL_SECTIONS = [
        {
            section: tl('SecuritySection'),
            desc: tl('SecurityDesc'),
            tools: [
                {
                    href: '/', color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-900/30',
                    emoji: '📧', label: tl('t_disp_lbl'), badge: tl('badge_core'), badgeColor: 'bg-blue-600 text-white',
                    desc: tl('t_disp_desc'),
                    features: ['No registration', 'Custom addresses', 'Auto-expiry', 'Real inbox'],
                },
                {
                    href: '/password-generator', color: 'from-indigo-500 to-indigo-700', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-900/30',
                    emoji: '🔐', label: tl('t_pass_lbl'), badge: tl('badge_free'), badgeColor: 'bg-indigo-600 text-white',
                    desc: tl('t_pass_desc'),
                    features: ['Custom rules', 'Easy remember', 'Strength meter', 'Copy instantly'],
                },
                {
                    href: '/identity-generator', color: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-900/30',
                    emoji: '🎭', label: tl('t_id_lbl'), badge: tl('badge_free'), badgeColor: 'bg-emerald-600 text-white',
                    desc: tl('t_id_desc'),
                    features: ['8 countries', 'Real-format addresses', 'Copy all fields', '100% client-side'],
                },
                {
                    href: '/data-breach-checker', color: 'from-red-500 to-red-700', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-900/30',
                    emoji: '🛡️', label: tl('t_breach_lbl'), badge: tl('badge_free'), badgeColor: 'bg-red-600 text-white',
                    desc: tl('t_breach_desc'),
                    features: ['Billions of records', 'Anonymous check', 'Instant results', 'Source details'],
                },
                {
                    href: '/secure-notes', color: 'from-orange-500 to-orange-700', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-900/30',
                    emoji: '🔥', label: tl('t_note_lbl'), badge: tl('badge_free'), badgeColor: 'bg-orange-600 text-white',
                    desc: tl('t_note_desc'),
                    features: ['Burn-after-reading', 'E2E Encryption', 'Zero logs', 'One-time link'],
                },
                {
                    href: '/test-card-generator', color: 'from-rose-500 to-rose-700', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-900/30',
                    emoji: '💳', label: tl('t_card_lbl'), badge: tl('badge_free'), badgeColor: 'bg-rose-600 text-white',
                    desc: tl('t_card_desc'),
                    features: ['6 networks', 'Luhn-valid', 'Brand SVG logos', 'Sandbox only'],
                },
            ],
        },
        {
            section: tl('EncodingSection'),
            desc: tl('EncodingDesc'),
            tools: [
                {
                    href: '/base64', color: 'from-teal-500 to-teal-700', bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-100 dark:border-teal-900/30',
                    emoji: '💠', label: tl('t_b64_lbl'), badge: tl('badge_free'), badgeColor: 'bg-teal-600 text-white',
                    desc: tl('t_b64_desc'),
                    features: ['Text & file encode', 'URL-safe mode', 'Instant decode', '100% offline'],
                },
                {
                    href: '/hash-generator', color: 'from-slate-500 to-slate-700', bg: 'bg-slate-50 dark:bg-slate-900/20', border: 'border-slate-100 dark:border-slate-900/30',
                    emoji: '🔒', label: tl('t_hash_lbl'), badge: tl('badge_new'), badgeColor: 'bg-slate-600 text-white animate-pulse',
                    desc: tl('t_hash_desc'),
                    features: ['SHA-256 / SHA-512', 'Live generation', 'Zero upload', 'Fast computation'],
                },
                {
                    href: '/jwt-decoder', color: 'from-cyan-500 to-cyan-700', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-100 dark:border-cyan-900/30',
                    emoji: '🎫', label: tl('t_jwt_lbl'), badge: tl('badge_new'), badgeColor: 'bg-cyan-600 text-white animate-pulse',
                    desc: tl('t_jwt_desc'),
                    features: ['Header inspection', 'Payload claims', '100% Client-side', 'Safe preview'],
                },
                {
                    href: '/url-encoder', color: 'from-sky-500 to-sky-700', bg: 'bg-sky-50 dark:bg-sky-900/20', border: 'border-sky-100 dark:border-sky-900/30',
                    emoji: '🔗', label: tl('t_url_lbl'), badge: tl('badge_new'), badgeColor: 'bg-sky-600 text-white animate-pulse',
                    desc: tl('t_url_desc'),
                    features: ['EncodeURIComponent', 'Real-time toggle', 'Char counter', 'Special character support'],
                },
                {
                    href: '/qr-code-generator', color: 'from-violet-500 to-violet-700', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-900/30',
                    emoji: '🔲', label: tl('t_qr_lbl'), badge: tl('badge_free'), badgeColor: 'bg-violet-600 text-white',
                    desc: tl('t_qr_desc'),
                    features: ['6 content types', 'Custom colors', 'Download PNG', 'Error correction'],
                },
            ],
        },
        {
            section: tl('DevSection'),
            desc: tl('DevDesc'),
            tools: [
                {
                    href: '/json-formatter', color: 'from-yellow-500 to-yellow-700', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-100 dark:border-yellow-900/30',
                    emoji: '{}', label: tl('t_json_lbl'), badge: tl('badge_new'), badgeColor: 'bg-yellow-600 text-white animate-pulse',
                    desc: tl('t_json_desc'),
                    features: ['Minify & Prettify', '2/4 space indent', 'Syntax validation', 'Error pinpointing'],
                },
                {
                    href: '/diff-checker', color: 'from-green-500 to-green-700', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-900/30',
                    emoji: '⚖️', label: tl('t_diff_lbl'), badge: tl('badge_new'), badgeColor: 'bg-green-600 text-white animate-pulse',
                    desc: tl('t_diff_desc'),
                    features: ['Line-by-line diff', 'Color highlights', 'Delta metrics', 'Code comparison'],
                },
                {
                    href: '/uuid-generator', color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-900/30',
                    emoji: '🔑', label: tl('t_uuid_lbl'), badge: tl('badge_free'), badgeColor: 'bg-blue-600 text-white',
                    desc: tl('t_uuid_desc'),
                    features: ['v1 / v4 / v7 / v5', 'NIL & GUID', 'Bulk generate', 'UPPERCASE toggle'],
                },
                {
                    href: '/regex-tester', color: 'from-pink-500 to-pink-700', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-100 dark:border-pink-900/30',
                    emoji: '✨', label: tl('t_reg_lbl'), badge: tl('badge_new'), badgeColor: 'bg-pink-600 text-white animate-pulse',
                    desc: tl('t_reg_desc'),
                    features: ['g/i/m/s flags', 'Live highlights', 'Capture groups', 'Execution speed'],
                },
                {
                    href: '/color-converter', color: 'from-fuchsia-500 to-fuchsia-700', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20', border: 'border-fuchsia-100 dark:border-fuchsia-900/30',
                    emoji: '🎨', label: tl('t_col_lbl'), badge: tl('badge_new'), badgeColor: 'bg-fuchsia-600 text-white animate-pulse',
                    desc: tl('t_col_desc'),
                    features: ['HEX/RGB/HSL', 'Live swatch', 'Harmony palette', 'Copy formats'],
                },
            ],
        },
        {
            section: tl('NetSection'),
            desc: tl('NetDesc'),
            tools: [
                {
                    href: '/epoch-converter', color: 'from-amber-500 to-amber-700', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-900/30',
                    emoji: '⏳', label: tl('t_epo_lbl'), badge: tl('badge_new'), badgeColor: 'bg-amber-600 text-white animate-pulse',
                    desc: tl('t_epo_desc'),
                    features: ['Live ticking exact', 'Human ↔ UNIX', 'Local/UTC parse', 'Milliseconds support'],
                },
                {
                    href: '/ip-lookup', color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-100 dark:border-orange-900/30',
                    emoji: '🌍', label: tl('t_ip_lbl'), badge: tl('badge_free'), badgeColor: 'bg-orange-600 text-white',
                    desc: tl('t_ip_desc'),
                    features: ['IPv4 / IPv6', 'ISP & ASN', 'Location tracking', 'Copy details'],
                },
                {
                    href: '/domain-checker', color: 'from-indigo-500 to-indigo-700', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-900/30',
                    emoji: '🌐', label: tl('t_dom_lbl'), badge: tl('badge_free'), badgeColor: 'bg-indigo-600 text-white',
                    desc: tl('t_dom_desc'),
                    features: ['Live DNS lookup', 'MX record priority', 'Validates delivery', 'Client-side query'],
                },
            ],
        },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 py-20">
            {/* Hero */}
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black tracking-widest uppercase rounded-full border border-blue-100 dark:border-blue-800/50">
                    <span className="flex w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    {t('badge')}
                </div>
                {/* Dynamically rendering HTML safely using dangerouslySetInnerHTML prevents escaping issues */}
                <h1 
                    className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white leading-tight"
                    dangerouslySetInnerHTML={{ __html: t.raw('title') }} 
                />
                <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    {t('subtitle')}
                </p>
            </div>

            {/* Tool Sections */}
            {TOOL_SECTIONS.map(section => (
                <div key={section.section} className="mb-16">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-1.5">{section.section}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{section.desc}</p>
                    </div>
                    <div className={`grid grid-cols-1 ${section.tools.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-5`}>
                        {section.tools.map(tool => (
                            <Link key={tool.href} href={tool.href}
                                className={`group relative flex flex-col rounded-3xl border ${tool.border} ${tool.bg} p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                                {/* Badge */}
                                <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${tool.badgeColor}`}>
                                    {tool.badge}
                                </span>
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {tool.emoji}
                                </div>
                                {/* Content */}
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tool.label}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5 flex-1">{tool.desc}</p>
                                {/* Features */}
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {tool.features.map(f => (
                                        <span key={f} className="text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] px-2 py-0.5 rounded-full">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                                {/* CTA */}
                                <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`}>
                                    {tl('btn_launch')}
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
