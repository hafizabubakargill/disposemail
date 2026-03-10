import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Privacy & Developer Tools | DisposeMail',
    description: 'A complete suite of free tools for privacy, anonymity, and development — disposable email, identity generator, QR code generator, UUID generator, Base64 encoder, and test credit card generator.',
    alternates: { canonical: 'https://disposemail.com/free-tools' },
    keywords: ['free privacy tools', 'free developer tools', 'disposable email', 'qr code generator', 'uuid generator', 'base64 encoder', 'identity generator', 'test credit card'],
};

const TOOL_SECTIONS = [
    {
        section: '🔒 Privacy & Anonymity',
        desc: 'Stay anonymous and protect yourself online — no registration required.',
        tools: [
            {
                href: '/',
                color: 'from-blue-500 to-blue-700',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                border: 'border-blue-100 dark:border-blue-900/30',
                emoji: '📧',
                label: 'Disposable Email',
                badge: 'Core Product',
                badgeColor: 'bg-blue-600 text-white',
                desc: 'Instant, secure temp email addresses. Receive real emails anonymously — no sign-up, no tracking, auto-delete after 1 hour.',
                features: ['No registration', 'Custom addresses', 'Auto-expiry', 'Real inbox'],
            },
            {
                href: '/identity-generator',
                color: 'from-emerald-500 to-emerald-700',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                border: 'border-emerald-100 dark:border-emerald-900/30',
                emoji: '🎭',
                label: 'Identity Generator',
                badge: 'Free',
                badgeColor: 'bg-emerald-600 text-white',
                desc: 'Generate a complete fictional identity — name, address, phone number, DOB, and username for 8 countries.',
                features: ['8 countries', 'Real-format addresses', 'Copy all fields', '100% client-side'],
            },
            {
                href: '/password-generator',
                color: 'from-indigo-500 to-indigo-700',
                bg: 'bg-indigo-50 dark:bg-indigo-900/20',
                border: 'border-indigo-100 dark:border-indigo-900/30',
                emoji: '🔐',
                label: 'Password Generator',
                badge: 'Free',
                badgeColor: 'bg-indigo-600 text-white',
                desc: 'Generate strong, secure, and memorable passwords with custom rules — length, symbols, numbers, and easy-to-remember mode.',
                features: ['Custom rules', 'Easy remember', 'Strength meter', 'Copy instantly'],
            },
        ],
    },
    {
        section: '🛠️ Developer Tools',
        desc: 'Essential utilities for developers, testers, and power users.',
        tools: [
            {
                href: '/qr-code-generator',
                color: 'from-violet-500 to-violet-700',
                bg: 'bg-violet-50 dark:bg-violet-900/20',
                border: 'border-violet-100 dark:border-violet-900/30',
                emoji: '🔲',
                label: 'QR Code Generator',
                badge: 'Free',
                badgeColor: 'bg-violet-600 text-white',
                desc: 'Generate QR codes for URLs, text, email, phone, SMS, and Wi-Fi. Custom colors, size, and error correction. Download as PNG.',
                features: ['6 content types', 'Custom colors', 'Download PNG', 'Error correction'],
            },
            {
                href: '/uuid-generator',
                color: 'from-sky-500 to-sky-700',
                bg: 'bg-sky-50 dark:bg-sky-900/20',
                border: 'border-sky-100 dark:border-sky-900/30',
                emoji: '🔑',
                label: 'UUID Generator',
                badge: 'Free',
                badgeColor: 'bg-sky-600 text-white',
                desc: 'Generate UUIDs in every version: v1 (time-based), v4 (random), v7 (time-ordered), v5 (name hash), NIL, and Windows-style GUIDs.',
                features: ['v1 / v4 / v7 / v5', 'NIL & GUID', 'Bulk generate', 'UPPERCASE + braces'],
            },
            {
                href: '/base64',
                color: 'from-teal-500 to-teal-700',
                bg: 'bg-teal-50 dark:bg-teal-900/20',
                border: 'border-teal-100 dark:border-teal-900/30',
                emoji: '💠',
                label: 'Base64 Encoder / Decoder',
                badge: 'Free',
                badgeColor: 'bg-teal-600 text-white',
                desc: 'Encode and decode Base64 text, files, and images instantly in your browser. Supports URL-safe mode and Data URL output.',
                features: ['Text & file encode', 'URL-safe mode', 'Instant decode', '100% offline'],
            },
            {
                href: '/test-card-generator',
                color: 'from-rose-500 to-rose-700',
                bg: 'bg-rose-50 dark:bg-rose-900/20',
                border: 'border-rose-100 dark:border-rose-900/30',
                emoji: '💳',
                label: 'Test Card Generator',
                badge: 'Dev',
                badgeColor: 'bg-rose-600 text-white',
                desc: 'Generate Luhn-valid test credit card numbers for Visa, Mastercard, Amex, Discover, JCB, and Diner\'s Club. For sandbox testing only.',
                features: ['6 networks', 'Luhn-valid', 'Brand SVG logos', 'Sandbox only'],
            },
        ],
    },
];

export default function FreeToolsPage() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-20">
            {/* Hero */}
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-black tracking-widest uppercase rounded-full border border-blue-100 dark:border-blue-800/50">
                    <span className="flex w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    All Tools Free — No Registration
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white leading-tight">
                    Free Privacy &amp;<br />Developer Tools<span className="text-blue-500">.</span>
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    7 free tools for privacy, anonymity, and development. 100% client-side where possible — nothing leaves your browser.
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
                                    Launch Tool
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}

            {/* Coming Soon */}
            <div className="mt-8 rounded-3xl border border-dashed border-gray-200 dark:border-[#2a2a2a] p-10 text-center">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">More Tools Coming Soon</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email Domain Checker, IP Lookup, JSON Formatter, and more. All free, all private.</p>
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                    {['Email Domain Checker', 'IP Lookup', 'JSON Formatter', 'Hash Generator', 'URL Encoder'].map(t => (
                        <span key={t} className="text-xs font-bold text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] px-3 py-1.5 rounded-full">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
