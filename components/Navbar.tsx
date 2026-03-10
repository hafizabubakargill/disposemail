'use client';

import { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const t = useTranslations('Navbar');
    const tPw = useTranslations('PasswordGenerator');

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
                <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 font-medium font-bold uppercase tracking-widest text-[11px]">
                    <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('home')}</Link>
                    <Link href="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('about', { fallback: 'About' })}</Link>
                    <Link href="/blog" className="hover:text-blue-600 dark:hover:text-white transition-colors">{t('blog')}</Link>
                    <Link href="/password-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                        {tPw('nav_link')}
                    </Link>
                    <Link href="/identity-generator" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Identity
                    </Link>
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

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className="absolute top-20 left-0 right-0 bg-white dark:bg-[#111] border-y border-gray-200 dark:border-[#222] p-6 flex flex-col gap-4 z-50 md:hidden animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
                    <Link href="/" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
                    <Link href="/about" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('about', { fallback: 'About Us' })}</Link>
                    <Link href="/blog" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('blog')}</Link>
                    <Link href="/password-generator" className="text-lg font-bold text-indigo-600 dark:text-indigo-400 py-2 flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                        {tPw('nav_link')}
                    </Link>
                    <Link href="/identity-generator" className="text-lg font-bold text-emerald-600 dark:text-emerald-400 py-2 flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Identity Generator
                    </Link>
                    <Link href="/faq" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('faq')}</Link>
                    <Link href="/contact" className="text-lg font-medium text-gray-900 dark:text-gray-100 py-2" onClick={() => setMenuOpen(false)}>{t('contact')}</Link>
                </div>
            )}
        </nav>
    );
}
