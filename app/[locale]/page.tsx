'use client';

import { useEffect, useState } from "react";
import Inbox from "@/components/Inbox";
import { getSortedPosts } from "@/lib/blog";
import { Hero } from "@/components/Hero";
import { useEmailSession } from "@/hooks/useEmailSession";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function Home() {
    const tf = useTranslations('Features');
    const tfaq = useTranslations('FAQ');
    const ts = useTranslations('Steps');
    const tuc = useTranslations('UseCases');
    const twhy = useTranslations('Why');
    const tb = useTranslations('Blog');
    const tht = useTranslations('HomeTools');
    const thf = useTranslations('HomeFeaturedTools');
    const locale = useLocale();

    const {
        email,
        timeLeft,
        progress,
        handleRefresh,
        isCustom,
        setIsCustom,
        customPrefix,
        setCustomPrefix,
        isMounted,
        sessionToken,
        error: sessionError
    } = useEmailSession();

    if (!isMounted || (!email && !sessionError)) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center pt-20 px-4">
                {/* Hero Skeleton omitted for brevity, same as before */}
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center mb-12 animate-pulse">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-[#222] rounded-full mb-8"></div>
                    <div className="h-16 w-3/4 bg-gray-200 dark:bg-[#222] rounded-3xl mb-6"></div>
                    <div className="h-6 w-1/2 bg-gray-200 dark:bg-[#222] rounded-xl mb-12"></div>
                    <div className="w-full max-w-2xl h-20 bg-gray-100 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222]"></div>
                </div>
            </div>
        );
    }

    if (sessionError === 'session_failed' && !email) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500 border border-red-500/20">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h1 className="text-3xl font-black mb-4 dark:text-white">System Overloaded</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                    We are currently experiencing high traffic or database limits. 
                    Please try refreshing the page or try again in a few minutes.
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                    REFRESH PAGE
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Hero
                email={email || ""}
                timeLeft={timeLeft}
                progress={progress}
                handleRefresh={handleRefresh}
                isCustom={isCustom}
                setIsCustom={setIsCustom}
                customPrefix={customPrefix}
                setCustomPrefix={setCustomPrefix}
            />

            {/* Inbox Section */}
            <div className="w-full px-4 z-10 pb-12">
                <Inbox emailAddress={email || ""} sessionToken={sessionToken || ""} />
            </div>

            {/* --- AD VALUE: FEATURES GRID --- */}
            <div className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-[#222]">
                <h2 className="text-3xl font-black tracking-tighter text-center mb-12 text-gray-900 dark:text-white">{tf('title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{tf('sockets_title')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tf('sockets_desc')}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-4 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{tf('tls_title')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tf('tls_desc')}</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222]">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-4 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{tf('domain_title')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tf('domain_desc')}</p>
                    </div>
                </div>
            </div>

            {/* --- ADSENSE COMPLIANCE CONTENT --- */}
            <div className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-gray-100 dark:border-[#222]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Why DisposeMail? */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-gray-100">
                            {tf('secure_life')}<span className="text-blue-700 dark:text-blue-400">.</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                            {tf('secure_desc')}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700">
                                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-1">{tf('privacy_first')}</h3>
                                <p className="text-[11px] text-gray-700 dark:text-gray-300 uppercase font-black">{tf('no_logs')}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
                                <h3 className="font-bold text-green-900 dark:text-green-300 mb-1">{tf('zero_cost')}</h3>
                                <p className="text-xs text-center font-bold text-green-800 dark:text-green-200">{tf('free_forever')}</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Quick Links */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest text-[11px]">{tfaq('homepage_faq')}</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{tfaq('q1')}</h4>
                                <p className="text-sm text-gray-500">{tfaq('a1')}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{tfaq('q2')}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{tfaq('a2')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How it Works / Steps */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-xl shadow-blue-600/20">1</div>
                        <h3 className="font-bold text-lg mb-2">{ts('step1_title')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{ts('step1_desc')}</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-xl shadow-blue-600/20">2</div>
                        <h3 className="font-bold text-lg mb-2">{ts('step2_title')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{ts('step2_desc')}</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-xl shadow-blue-600/20">3</div>
                        <h3 className="font-bold text-lg mb-2">{ts('step3_title')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{ts('step3_desc')}</p>
                    </div>
                </div>
            </div>

            {/* --- FREE TOOLS PREVIEW --- */}
            <div className="w-full py-24 px-6 border-t border-gray-100 dark:border-[#1a1a1a]">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-xl text-left">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">{tht('title')}</h2>
                            <p className="text-gray-700 dark:text-gray-400">{tht('subtitle')}</p>
                        </div>
                        <Link href="/free-tools" className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-[#111] text-gray-900 dark:text-gray-100 font-bold hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-[11px]">
                            {tht('view_all')}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 3 Featured Tools */}
                        <Link href="/secure-notes" className="group p-8 rounded-3xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 hover:border-orange-500/50 transition-all hover:shadow-xl">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">🔥</div>
                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2">{thf('tool1_title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{thf('tool1_desc')}</p>
                        </Link>
                        
                        <Link href="/data-breach-checker" className="group p-8 rounded-3xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 hover:border-red-500/50 transition-all hover:shadow-xl">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">🛡️</div>
                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2">{thf('tool2_title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{thf('tool2_desc')}</p>
                        </Link>
                        
                        <Link href="/password-generator" className="group p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-500/50 transition-all hover:shadow-xl">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform">🔐</div>
                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-2">{thf('tool3_title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{thf('tool3_desc')}</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- AD VALUE: USE CASES --- */}
            <div className="w-full py-20 px-6 border-t border-gray-100 dark:border-[#222]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black tracking-tighter mb-8 text-center text-gray-900 dark:text-white uppercase">Common Use Cases</h2>
                    <div className="space-y-4">
                        <details className="group p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] open:bg-blue-50 dark:open:bg-blue-900/10 transition-colors">
                            <summary className="font-bold cursor-pointer list-none flex justify-between items-center bg-transparent text-gray-900 dark:text-gray-100">
                                <span>{tuc('case1_title')}</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                {tuc('case1_desc')}
                            </p>
                        </details>
                        <details className="group p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] open:bg-blue-50 dark:open:bg-blue-900/10 transition-colors">
                            <summary className="font-bold cursor-pointer list-none flex justify-between items-center bg-transparent text-gray-900 dark:text-gray-100">
                                <span>{tuc('case2_title')}</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                {tuc('case2_desc')}
                            </p>
                        </details>
                        <details className="group p-4 bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] open:bg-blue-50 dark:open:bg-blue-900/10 transition-colors">
                            <summary className="font-bold cursor-pointer list-none flex justify-between items-center bg-transparent text-gray-900 dark:text-gray-100">
                                <span>{tuc('case3_title')}</span>
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                                {tuc('case3_desc')}
                            </p>
                        </details>
                    </div>
                </div>
            </div>

            {/* --- EXTRA VALUE SECTION FOR ADSENSE --- */}
            <div className="w-full py-24 px-6 border-y border-gray-100 dark:border-[#111]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">{twhy('title')}</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">{twhy('subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-8 rounded-[32px] bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h3 className="font-black text-lg mb-3">{twhy('item1_title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{twhy('item1_desc')}</p>
                        </div>
                        <div className="p-8 rounded-[32px] bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-purple-600/10 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            </div>
                            <h3 className="font-black text-lg mb-3">{twhy('item2_title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{twhy('item2_desc')}</p>
                        </div>
                        <div className="p-8 rounded-[32px] bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-green-600/10 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="font-black text-lg mb-3">{twhy('item3_title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{twhy('item3_desc')}</p>
                        </div>
                        <div className="p-8 rounded-[32px] bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] hover:scale-[1.02] transition-transform">
                            <div className="w-12 h-12 bg-orange-600/10 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <h3 className="font-black text-lg mb-3">{twhy('item4_title')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{twhy('item4_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- LATEST FROM BLOG --- */}
            <div className="w-full py-24 px-6 border-t border-gray-100 dark:border-[#1a1a1a]">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-xl text-left">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">{tb('title')}</h2>
                            <p className="text-gray-700 dark:text-gray-400">{tb('subtitle')}</p>
                        </div>
                        <Link href="/blog" className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-[#111] text-gray-900 dark:text-gray-100 font-bold hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-[11px]">
                            {tb('view_all')}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {getSortedPosts(locale).slice(0, 6).map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group p-0 rounded-[32px] bg-gray-50/50 dark:bg-[#111] border border-gray-100 dark:border-[#222] hover:border-blue-500/30 transition-all hover:shadow-xl overflow-hidden"
                            >
                                <div className="h-44 w-full overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">{post.category}</span>
                                        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">{post.date}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-4 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest mt-auto">
                                        {tb('read_more')} <svg className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "DisposeMail",
                        "url": "https://disposemail.xyz",
                        "description": "Secure Disposable Email Generator and Free Privacy Tools."
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What is a disposable email address?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "A disposable email address is a temporary, secure email address that expires after a short period, allowing you to receive emails without revealing your true identity."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Are the emails completely anonymous?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes, DisposeMail requires no registration and logs no personal data, ensuring complete anonymity."
                                }
                            }
                        ]
                    })
                }}
            />
        </div>
    );
}
