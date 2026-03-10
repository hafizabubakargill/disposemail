'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./LanguageSwitcher";

const TOOLS = [
    {
        href: '/password-generator',
        label: 'Password Generator',
        desc: 'Secure & memorable passwords',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
        ),
        color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30',
    },
    {
        href: '/identity-generator',
        label: 'Identity Generator',
        desc: 'Random profiles for 8 countries',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
    },
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('Navbar');
    const pathname = usePathname();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setToolsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const isToolActive = TOOLS.some(tool => pathname?.includes(tool.href));

    return (
        <nav className="w-full flex justify-between items-center px-6 md:px-8 py-6 z-50 max-w-7xl mx-auto relative">
            <Link href="/" className="flex items-center space-x-2.5 group" aria-label="Home">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-800/20 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-gray-100">DisposeMail</span>
                </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
                <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest text-[11px] items-center">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('home')}</Link>
                    <Link href="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('about', { fallback: 'About' })}</Link>
                    <Link href="/blog" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('blog')}</Link>

                    {/* Free Tools Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setToolsOpen(v => !v)}
                            className={`flex items-center gap-1.5 transition-colors ${isToolActive ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-white'}`}
                        >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Free Tools
                            <svg className={`w-3 h-3 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Panel */}
                        {toolsOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                                <div className="p-2 space-y-1">
                                    {TOOLS.map(tool => (
                                        <Link
                                            key={tool.href}
                                            href={tool.href}
                                            onClick={() => setToolsOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group"
                                        >
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tool.color}`}>
                                                {tool.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tool.label}</p>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500">{tool.desc}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className="px-3 pb-2.5 pt-1 border-t border-gray-100 dark:border-[#1a1a1a]">
                                    <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center font-bold uppercase tracking-widest">More tools coming soon</p>
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

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-3">
                <LanguageSwitcher />
                <ModeToggle />
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute top-20 left-0 right-0 bg-white dark:bg-[#111] border-y border-gray-200 dark:border-[#222] p-6 flex flex-col gap-4 z-50 md:hidden animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
                    <Link href="/" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
                    <Link href="/about" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('about', { fallback: 'About Us' })}</Link>
                    <Link href="/blog" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('blog')}</Link>

                    {/* Mobile Tools Section */}
                    <div className="border-t border-gray-100 dark:border-[#1a1a1a] pt-3">
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3">Free Tools</p>
                        {TOOLS.map(tool => (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-3 py-2.5"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tool.color}`}>
                                    {tool.icon}
                                </div>
                                <span className="text-base font-bold text-gray-900 dark:text-gray-100">{tool.label}</span>
                            </Link>
                        ))}
                    </div>

                    <Link href="/faq" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('faq')}</Link>
                    <Link href="/contact" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('contact')}</Link>
                </div>
            )}
        </nav>
    );
}
