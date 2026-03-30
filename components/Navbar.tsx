'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from "./LanguageSwitcher";

export const TOOL_CATEGORIES = [
    {
        name: 'Security & Identity',
        tools: [
            { href: '/password-generator', label: 'Password Generator', emoji: '🔐', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
            { href: '/identity-generator', label: 'Identity Generator', emoji: '🎭', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
            { href: '/data-breach-checker', label: 'Data Breach Checker', emoji: '🛡️', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30' },
            { href: '/secure-notes', label: 'Secure Notes', emoji: '🔥', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30' },
            { href: '/test-card-generator', label: 'Test Card Generator', emoji: '💳', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/30' },
        ]
    },
    {
        name: 'Encoding & Crypto',
        tools: [
            { href: '/hash-generator', label: 'Hash Generator', emoji: '🔒', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/30' },
            { href: '/jwt-decoder', label: 'JWT Decoder', emoji: '🎫', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-900/30' },
            { href: '/url-encoder', label: 'URL Encoder', emoji: '🔗', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
            { href: '/base64', label: 'Base64 Encoder', emoji: '💠', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/30' },
            { href: '/qr-code-generator', label: 'QR Code Generator', emoji: '🔲', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/30' },
        ]
    },
    {
        name: 'Dev & Formatting',
        tools: [
            { href: '/json-formatter', label: 'JSON Formatter', emoji: '{}', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/30' },
            { href: '/diff-checker', label: 'Diff Checker', emoji: '⚖️', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30' },
            { href: '/uuid-generator', label: 'UUID Generator', emoji: '🔑', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/30' },
            { href: '/regex-tester', label: 'Regex Tester', emoji: '✨', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/30' },
            { href: '/color-converter', label: 'Color Converter', emoji: '🎨', color: 'text-fuchsia-600 dark:text-fuchsia-400', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/30' },
        ]
    },
    {
        name: 'Network & Time',
        tools: [
            { href: '/epoch-converter', label: 'Epoch Converter', emoji: '⏳', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30' },
            { href: '/ip-lookup', label: 'IP Address Lookup', emoji: '🌍', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30' },
            { href: '/domain-checker', label: 'Domain Checker', emoji: '🌐', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
        ]
    }
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const t = useTranslations('Navbar');
    const locale = useLocale();
    const pathname = usePathname();

    const openMenu = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setToolsOpen(true);
    };
    const closeMenu = () => {
        closeTimer.current = setTimeout(() => setToolsOpen(false), 120);
    };

    const isToolActive = TOOL_CATEGORIES.some(cat => cat.tools.some(tool => pathname?.includes(tool.href)));

    return (
        <nav className="w-full flex justify-between items-center px-6 md:px-8 py-6 z-50 max-w-7xl mx-auto relative">
            <Link href={`/${locale}`} className="flex items-center space-x-2.5 group" aria-label="Home">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-800/20 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">DisposeMail</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
                <div className="flex gap-6 text-[11px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest items-center">
                    <Link href={`/${locale}`} className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('home')}</Link>
                    <Link href={`/${locale}/about`} className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('about', { fallback: 'About' })}</Link>
                    <Link href={`/${locale}/blog`} className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('blog')}</Link>

                    {/* Free Tools — Hover Mega Menu */}
                    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
                        <button
                            onClick={() => setToolsOpen(v => !v)}
                            className={`flex items-center gap-1.5 transition-colors ${isToolActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-white'}`}
                        >
                            <span className="uppercase">Free Tools</span>
                            <svg className={`w-3 h-3 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Mega Menu Panel */}
                        {toolsOpen && (
                            <div
                                onMouseEnter={openMenu}
                                onMouseLeave={closeMenu}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                                style={{ width: '920px' }}
                            >
                                <div className="flex justify-center mb-1">
                                    <div className="w-3 h-3 bg-white dark:bg-[#111] border-l border-t border-gray-200 dark:border-[#222] rotate-45" />
                                </div>
                                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden">
                                    
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-[#1a1a1a]">
                                        <div>
                                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Free Privacy Utilities</p>
                                        </div>
                                        <Link href={`/${locale}/free-tools`} onClick={() => setToolsOpen(false)} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline flex items-center gap-1">
                                            View all tools <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                        </Link>
                                    </div>
                                    
                                    {/* Categorized 4-Column Grid */}
                                    <div className="grid grid-cols-4 divide-x divide-gray-100 dark:divide-[#1a1a1a] bg-gray-50/50 dark:bg-[#151515]">
                                        {TOOL_CATEGORIES.map(category => (
                                            <div key={category.name} className="flex flex-col p-4">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 px-2">
                                                    {category.name}
                                                </h4>
                                                <div className="flex flex-col gap-1">
                                                    {category.tools.map(tool => (
                                                        <Link
                                                            key={tool.href}
                                                            href={`/${locale}${tool.href}`}
                                                            onClick={() => setToolsOpen(false)}
                                                            className="flex items-center gap-2.5 p-2 rounded-xl bg-transparent hover:bg-white dark:hover:bg-[#222] transition-colors group"
                                                        >
                                                            <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-sm ${tool.bg} shadow-sm border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform`}>
                                                                <span className={tool.label === 'JSON Formatter' ? 'font-mono block -mt-0.5' : ''}>{tool.emoji}</span>
                                                            </div>
                                                            <span className={`text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-white transition-colors`}>
                                                                {tool.label}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>

                    <Link href={`/${locale}/faq`} className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('faq')}</Link>
                    <Link href={`/${locale}/contact`} className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('contact')}</Link>
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ModeToggle />
                </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden items-center gap-3">
                <LanguageSwitcher />
                <ModeToggle />
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-lg transition-colors" aria-label="Toggle menu">
                    {menuOpen
                        ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute top-20 left-0 right-0 max-h-[80vh] overflow-y-auto bg-white dark:bg-[#111] border-y border-gray-200 dark:border-[#222] p-6 flex flex-col gap-4 z-50 md:hidden animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
                    <Link href={`/${locale}`} className="text-lg font-medium text-gray-900 dark:text-gray-100 py-1" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
                    <Link href={`/${locale}/about`} className="text-lg font-medium text-gray-900 dark:text-gray-100 py-1" onClick={() => setMenuOpen(false)}>{t('about', { fallback: 'About Us' })}</Link>
                    <Link href={`/${locale}/blog`} className="text-lg font-medium text-gray-900 dark:text-gray-100 py-1" onClick={() => setMenuOpen(false)}>{t('blog')}</Link>

                    <div className="border-t border-gray-100 dark:border-[#1a1a1a] pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Free Tools List</p>
                            <Link href={`/${locale}/free-tools`} onClick={() => setMenuOpen(false)} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">View all →</Link>
                        </div>
                        
                        <div className="flex flex-col gap-5">
                            {TOOL_CATEGORIES.map(category => (
                                <div key={category.name}>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase mb-2">{category.name}</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {category.tools.map(tool => (
                                            <Link key={tool.href} href={`/${locale}${tool.href}`} onClick={() => setMenuOpen(false)}
                                                className="flex flex-col gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-[#171717] hover:ring-1 ring-blue-500/50 transition-all">
                                                <span className="text-xl leading-none" style={tool.label === 'JSON Formatter' ? {fontFamily: 'monospace'} : {}}>{tool.emoji}</span>
                                                <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 leading-tight">{tool.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link href={`/${locale}/faq`} className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2 border-t border-gray-100 dark:border-[#1a1a1a] mt-2" onClick={() => setMenuOpen(false)}>{t('faq')}</Link>
                    <Link href={`/${locale}/contact`} className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('contact')}</Link>
                </div>
            )}
        </nav>
    );
}
