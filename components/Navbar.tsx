'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./LanguageSwitcher";

export const TOOLS = [
    {
        href: '/password-generator',
        label: 'Password Generator',
        desc: 'Secure & memorable passwords',
        emoji: '🔐',
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
    },
    {
        href: '/identity-generator',
        label: 'Identity Generator',
        desc: 'Random profiles — 8 countries',
        emoji: '🎭',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    },
    {
        href: '/qr-code-generator',
        label: 'QR Code Generator',
        desc: 'URL, Wi-Fi, Email, SMS & more',
        emoji: '🔲',
        color: 'text-violet-600 dark:text-violet-400',
        bg: 'bg-violet-50 dark:bg-violet-900/30',
    },
    {
        href: '/uuid-generator',
        label: 'UUID Generator',
        desc: 'v1, v4, v7, v5, NIL & GUID',
        emoji: '🔑',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/30',
    },
    {
        href: '/base64',
        label: 'Base64 Encoder',
        desc: 'Encode & decode text and files',
        emoji: '💠',
        color: 'text-teal-600 dark:text-teal-400',
        bg: 'bg-teal-50 dark:bg-teal-900/30',
    },
    {
        href: '/test-card-generator',
        label: 'Test Card Generator',
        desc: 'Luhn-valid cards for dev testing',
        emoji: '💳',
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-900/30',
    },
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const t = useTranslations('Navbar');
    const pathname = usePathname();

    const openMenu = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setToolsOpen(true);
    };
    const closeMenu = () => {
        closeTimer.current = setTimeout(() => setToolsOpen(false), 120);
    };

    const isToolActive = TOOLS.some(tool => pathname?.includes(tool.href));

    return (
        <nav className="w-full flex justify-between items-center px-6 md:px-8 py-6 z-50 max-w-7xl mx-auto relative">
            <Link href="/" className="flex items-center space-x-2.5 group" aria-label="Home">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-800/20 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">DisposeMail</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
                <div className="flex gap-6 text-[11px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest items-center">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('home')}</Link>
                    <Link href="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('about', { fallback: 'About' })}</Link>
                    <Link href="/blog" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('blog')}</Link>

                    {/* Free Tools — Hover Mega Menu */}
                    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
                        <button
                            onClick={() => setToolsOpen(v => !v)}
                            className={`flex items-center gap-1.5 transition-colors ${isToolActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-white'}`}
                        >
                            Free Tools
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
                                style={{ width: '680px' }}
                            >
                                {/* Arrow */}
                                <div className="flex justify-center mb-1">
                                    <div className="w-3 h-3 bg-white dark:bg-[#111] border-l border-t border-gray-200 dark:border-[#222] rotate-45" />
                                </div>
                                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-[#1a1a1a]">
                                        <div>
                                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Free Privacy Tools</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">All tools are 100% free — no registration required</p>
                                        </div>
                                        <Link href="/free-tools" onClick={() => setToolsOpen(false)} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">
                                            View all →
                                        </Link>
                                    </div>
                                    {/* Grid */}
                                    <div className="grid grid-cols-3 gap-px bg-gray-100 dark:bg-[#1a1a1a] p-px">
                                        {TOOLS.map(tool => (
                                            <Link
                                                key={tool.href}
                                                href={tool.href}
                                                onClick={() => setToolsOpen(false)}
                                                className="flex items-start gap-3 p-4 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors group"
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base ${tool.bg}`}>
                                                    {tool.emoji}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-xs font-black ${tool.color} group-hover:underline underline-offset-2`}>{tool.label}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{tool.desc}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="px-5 py-2.5 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-[#1a1a1a] flex items-center gap-2">
                                        <span className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">More tools coming soon</span>
                                        <span className="flex h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('faq')}</Link>
                    <Link href="/contact" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('contact')}</Link>
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
                <div className="absolute top-20 left-0 right-0 bg-white dark:bg-[#111] border-y border-gray-200 dark:border-[#222] p-6 flex flex-col gap-4 z-50 md:hidden animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
                    <Link href="/" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
                    <Link href="/about" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('about', { fallback: 'About Us' })}</Link>
                    <Link href="/blog" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('blog')}</Link>

                    <div className="border-t border-gray-100 dark:border-[#1a1a1a] pt-3">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">Free Tools</p>
                            <Link href="/free-tools" onClick={() => setMenuOpen(false)} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">View all →</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {TOOLS.map(tool => (
                                <Link key={tool.href} href={tool.href} onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-[#1a1a1a]">
                                    <span className="text-base">{tool.emoji}</span>
                                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight">{tool.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link href="/faq" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('faq')}</Link>
                    <Link href="/contact" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('contact')}</Link>
                </div>
            )}
        </nav>
    );
}
