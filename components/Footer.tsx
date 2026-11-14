'use client';

import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { tr } from '@/lib/tr';
import { CookieSettingsButton } from '@/components/CookieSettingsButton';

export function Footer() {
    const t = useTranslations('Footer');
    const locale = useLocale();

    return (
        <footer className="relative w-full bg-slate-900/90 text-slate-200 dark:bg-[#07090e]/90 dark:text-slate-300 border-t border-slate-800 dark:border-[#181d29] pt-14 pb-8 px-6 mt-auto overflow-hidden bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px] backdrop-blur-sm">
            <div className="max-w-7xl mx-auto space-y-12">
                

                {/* Main 5-Column Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4">
                    
                    {/* Column 1: Brand & Official Verification Badges */}
                    <div className="lg:col-span-1 space-y-4">
                        <Link href={`${locale === 'en' ? '/' : '/' + locale}`} className="flex items-center space-x-3 group">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">DisposeMail</span>
                        </Link>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {tr(locale, "Ultra-fast, privacy-first temporary email generator & free developer tools suite. Engineered for instant anonymity and automated QA testing.")}
                        </p>
                        
                        {/* Verified Badges Block */}
                        <div className="pt-2 space-y-2.5">
                            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{tr(locale, "Official Verifications")}</div>
                            <div className="flex flex-wrap gap-2 items-center">
                                {/* SaaSHub Badge */}
                                <a 
                                    href="https://www.saashub.com/disposemail-xyz?utm_source=badge&utm_campaign=badge&utm_content=disposemail-xyz&badge_variant=color&badge_kind=approved" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-block hover:opacity-90 transition-opacity"
                                    title="Approved on SaaSHub"
                                >
                                    <img src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" alt="DisposeMail.xyz SaaSHub badge" className="h-7 w-auto rounded" />
                                </a>

                                {/* AlternativeTo Approved Badge */}
                                <a 
                                    href="https://alternativeto.net/software/disposemail/about/" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-950/80 border border-teal-500/40 text-teal-300 text-[11px] font-extrabold hover:bg-teal-900/80 transition-colors"
                                    title="Verified on AlternativeTo"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                    {tr(locale, "AlternativeTo Approved")}
                                </a>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 pt-1">
                                {/* Chrome Store Link */}
                                <a 
                                    href="https://chromewebstore.google.com/detail/disposemail-%E2%80%94-instant-tem/pfeljfajppgglbddgknmpgaioimijfjo" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                                    </svg>
                                    {tr(locale, "Chrome Web Store")}
                                </a>

                                <span className="text-slate-600">•</span>

                                {/* ExtensionLaunch Link */}
                                <a 
                                    href="https://extensionlaunch.com/product/disposemail-instant-temp-email-pfeljf" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-400 hover:text-orange-300 transition-colors"
                                >
                                    🚀 ExtensionLaunch
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Free Privacy Tools */}
                    <div className="space-y-3">
                        <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {tr(locale, "Free Privacy Tools")}
                        </div>
                        <ul className="space-y-2 text-xs font-semibold text-slate-400">
                            <li>
                                <Link href={`${locale === 'en' ? '' : '/' + locale}/data-breach-checker`} className="hover:text-white transition-colors flex items-center justify-between group">
                                    <span>{tr(locale, "Data Breach Checker")}</span>
                                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-red-500/20 text-red-400 border border-red-500/30 group-hover:bg-red-500 group-hover:text-white transition-colors">🔥 Hot</span>
                                </Link>
                            </li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/password-generator`} className="hover:text-white transition-colors">{tr(locale, "Password Generator")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/secure-notes`} className="hover:text-white transition-colors">{tr(locale, "Encrypted Secure Notes")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/identity-generator`} className="hover:text-white transition-colors">{tr(locale, "Fake Identity Generator")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/ip-lookup`} className="hover:text-white transition-colors">{tr(locale, "IP Address Lookup")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/domain-checker`} className="hover:text-white transition-colors">{tr(locale, "Email Domain Checker")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/disposable-email-checker`} className="hover:text-white transition-colors">{tr(locale, "Disposable Email Checker")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/test-card-generator`} className="hover:text-white transition-colors">{tr(locale, "Test Card Generator")}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Developer Tools */}
                    <div className="space-y-3">
                        <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            {tr(locale, "Developer Tools")}
                        </div>
                        <ul className="space-y-2 text-xs font-semibold text-slate-400">
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/jwt-decoder`} className="hover:text-white transition-colors">{tr(locale, "JWT Decoder")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/base64`} className="hover:text-white transition-colors">Base64 Encoder / Decoder</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/uuid-generator`} className="hover:text-white transition-colors">UUID v4 Generator</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/json-formatter`} className="hover:text-white transition-colors">{tr(locale, "JSON Formatter")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/regex-tester`} className="hover:text-white transition-colors">{tr(locale, "Regex Tester")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/diff-checker`} className="hover:text-white transition-colors">{tr(locale, "Diff Checker")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/epoch-converter`} className="hover:text-white transition-colors">{tr(locale, "Epoch Timestamp Converter")}</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Products & Approvals */}
                    <div className="space-y-3">
                        <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Products & Integrations
                        </div>
                        <ul className="space-y-2 text-xs font-semibold text-slate-400">
                            <li>
                                <a href="https://chromewebstore.google.com/detail/disposemail-%E2%80%94-instant-tem/pfeljfajppgglbddgknmpgaioimijfjo" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                    <span>{tr(locale, "Chrome Extension")}</span>
                                    <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://alternativeto.net/software/disposemail/about/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                    <span>{tr(locale, "AlternativeTo Listing")}</span>
                                    <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.saashub.com/disposemail-xyz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                    <span>{tr(locale, "SaaSHub Listing")}</span>
                                    <svg className="w-3 h-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://extensionlaunch.com/product/disposemail-instant-temp-email-pfeljf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                    <span>{tr(locale, "ExtensionLaunch Page")}</span>
                                    <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 5: Company & Legal */}
                    <div className="space-y-3">
                        <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                            Company & Legal
                        </div>
                        <ul className="space-y-2 text-xs font-semibold text-slate-400">
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/about`} className="hover:text-white transition-colors">{tr(locale, "About DisposeMail")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/blog`} className="hover:text-white transition-colors">{tr(locale, "Privacy Blog & Insights")}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/faq`} className="hover:text-white transition-colors">{t('faq')}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/privacy`} className="hover:text-white transition-colors">{t('privacy')}</Link></li>
                            <li><a href="mailto:support@disposemail.xyz" className="hover:text-white transition-colors">support@disposemail.xyz</a></li>
                            <li><CookieSettingsButton label={tr(locale, "Cookie settings")} className="hover:text-white transition-colors font-semibold" /></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/terms`} className="hover:text-white transition-colors">{t('terms')}</Link></li>
                            <li><Link href={`${locale === 'en' ? '' : '/' + locale}/contact`} className="hover:text-white transition-colors">{tr(locale, "Contact Support")}</Link></li>
                            <li><a href="https://disposemail.xyz/sitemap-index.xml" className="hover:text-white transition-colors">{tr(locale, "XML Sitemap")}</a></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar: Copyright, Social Links & System Status */}
                <div className="pt-8 border-t border-slate-800 dark:border-[#181d29] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-3">
                        <span>{t('copyright')}</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            {tr(locale, "All Systems Operational")}
                        </span>
                    </div>

                    {/* Social Media Links - Light Colored Icon Badges */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Facebook */}
                        <a 
                            href="https://www.facebook.com/disposemail" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 text-slate-100 hover:text-white border border-slate-700/80 shadow-sm hover:scale-105 transition-all text-xs font-bold"
                            title="DisposeMail on Facebook"
                        >
                            <svg className="w-4 h-4 fill-blue-400 group-hover:fill-white shrink-0 transition-colors" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span>Facebook</span>
                        </a>

                        {/* Instagram */}
                        <a 
                            href="https://www.instagram.com/dispose_mail" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-pink-600 text-slate-100 hover:text-white border border-slate-700/80 shadow-sm hover:scale-105 transition-all text-xs font-bold"
                            title="DisposeMail on Instagram"
                        >
                            <svg className="w-4 h-4 fill-pink-400 group-hover:fill-white shrink-0 transition-colors" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            <span>Instagram</span>
                        </a>

                        {/* LinkedIn */}
                        <a 
                            href="https://www.linkedin.com/company/disposemail" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-sky-600 text-slate-100 hover:text-white border border-slate-700/80 shadow-sm hover:scale-105 transition-all text-xs font-bold"
                            title="DisposeMail on LinkedIn"
                        >
                            <svg className="w-4 h-4 fill-sky-400 group-hover:fill-white shrink-0 transition-colors" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                            <span>LinkedIn</span>
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
