import React from 'react';
import { getTranslations } from 'next-intl/server';

export default async function HostingerCTA() {
    const t = await getTranslations('Footer'); // Fallback translations or static string if not localized yet

    return (
        <section className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 border-t border-gray-100 dark:border-[#1a1a1a]">
            <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative shadow-2xl">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-50 z-0"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 z-0"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-10 text-center md:text-left">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Recommended Host</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                            Build Your Next Project with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hostinger</span>
                        </h2>
                        <p className="text-lg text-indigo-100/80 font-medium mb-8 leading-relaxed">
                            Fast, secure, and user-friendly web hosting. Get everything you need to launch a website today, trusted by DisposeMail.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <a
                                href="https://hostinger.com?REFERRALCODE=abubakargill"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-black text-sm uppercase tracking-wider hover:scale-105 transition-all w-full sm:w-auto overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Claim 20% Discount
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </a>
                        </div>
                    </div>

                    {/* Decorative Element / Right side graphic */}
                    <div className="hidden md:flex flex-col gap-4 w-72 shrink-0">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl transform rotate-3 hover:rotate-0 transition-transform cursor-default">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Lightning Fast</div>
                                    <div className="text-purple-200/70 text-xs">LiteSpeed Web Server</div>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-[98%] h-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl transform -rotate-2 hover:rotate-0 transition-transform cursor-default ml-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Free SSL & Security</div>
                                    <div className="text-green-200/70 text-xs">Included in all plans</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
