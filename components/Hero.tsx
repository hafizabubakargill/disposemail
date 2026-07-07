'use client';

import React, { useState } from "react";
import { useTranslations } from 'next-intl';

interface HeroProps {
    email: string;
    timeLeft: number;
    progress: number;
    handleRefresh: (e?: React.FormEvent) => void;
    isCustom: boolean;
    setIsCustom: (val: boolean) => void;
    customPrefix: string;
    setCustomPrefix: (val: string) => void;
}

export const Hero = ({
    email,
    timeLeft,
    progress,
    handleRefresh,
    isCustom,
    setIsCustom,
    customPrefix,
    setCustomPrefix
}: HeroProps) => {
    const t = useTranslations('Hero');
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCopy = () => {
        if (email) {
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(50);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = email;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }
                document.body.removeChild(textArea);
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 mt-8 md:mt-20 z-10 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-500/20 text-xs font-mono mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2 animate-pulse"></span>
                {t('encrypted')}
            </div>

            <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 transform-gpu">
                {t.rich('title', {
                    br: () => <br />,
                    span: (chunks) => <span className="text-gray-900 dark:text-white">{chunks}</span>
                })}
            </h1>

            <p className="text-gray-700 dark:text-gray-300 text-base md:text-xl max-w-2xl mx-auto mb-6">
                {t.rich('subtitle', {
                    br: () => <br />
                })}
            </p>

            {/* SaaSHub Approved Trust Badge */}
            <div className="flex justify-center mb-8">
                <a href='https://www.saashub.com/disposemail-xyz?utm_source=badge&utm_campaign=badge&utm_content=disposemail-xyz&badge_variant=color&badge_kind=approved' target='_blank' rel='noopener noreferrer'>
                    <img src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" alt="DisposeMail.xyz badge" className="max-w-[150px] h-auto hover:opacity-90 transition-opacity shadow-sm rounded" />
                </a>
            </div>

            {/* Desktop Chrome Extension Banner */}
            <div className="hidden md:flex justify-center mb-8">
                <a
                    href="https://chromewebstore.google.com/detail/disposemail-%E2%80%94-instant-tem/pfeljfajppgglbddgknmpgaioimijfjo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 border border-blue-500/30 dark:border-blue-400/30 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/15 hover:scale-[1.02] transition-all duration-300"
                >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:rotate-12 transition-transform">
                        🧩
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Official Chrome Extension</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white animate-pulse">NEW</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Get instant 1-click temporary emails directly from your browser toolbar!</p>
                    </div>
                    <div className="ml-2 px-3 py-1.5 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-sm transition-colors">
                        <span>Add to Chrome</span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                </a>
            </div>

            {/* Custom Prefix & Pill UI */}
            <div className="mb-12 flex justify-center">
                <div className="flex items-center bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] rounded-full p-1 shadow-sm hover:shadow-md transition-all">
                    <button
                        type="button"
                        onClick={() => setIsCustom(!isCustom)}
                        className={`text-[11px] md:text-xs px-6 py-2.5 rounded-full transition-all font-black uppercase tracking-widest ${isCustom ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-[#161616]'}`}
                    >
                        {isCustom ? t('custom_active') : t('personalize')}
                    </button>

                    {isCustom && (
                        <form onSubmit={handleRefresh} className="flex items-center animate-in slide-in-from-left-2 duration-300">
                            <input
                                id="custom-prefix"
                                name="custom-prefix"
                                type="text"
                                placeholder={t('enter_name')}
                                value={customPrefix}
                                onChange={(e) => setCustomPrefix(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-gray-200 w-28 md:w-40 px-4 py-2 font-bold placeholder-gray-400"
                                autoComplete="off"
                                aria-label="Custom username prefix"
                            />
                            <button
                                type="submit"
                                className="mr-1 bg-blue-600 border border-blue-500 text-white px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shadow-lg"
                            >
                                {t('create')}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Email Box & Visual Progress */}
            <div className="max-w-2xl mx-auto mb-4 relative">
                <div className="bg-white dark:bg-[#111] p-2 pr-2 rounded-2xl border border-gray-200 dark:border-[#222] shadow-2xl flex flex-col md:flex-row items-center gap-2 backdrop-blur-sm relative group transition-colors">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative bg-gray-50 dark:bg-[#141414] w-full rounded-[14px] flex items-center p-4 transition-colors">
                        <span className="text-gray-500 mr-2 md:mr-3 select-none">
                            <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </span>

                        <div className="flex-1 overflow-hidden text-left">
                            <input
                                id="generated-email-address"
                                name="generated-email-address"
                                type="text"
                                readOnly
                                value={email}
                                className="bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-mono text-base md:text-[1rem] w-full placeholder-gray-400 dark:placeholder-gray-600 pl-1 md:pl-2 font-medium"
                                aria-label="Generated Email Address"
                            />
                        </div>
                    </div>

                    <div className="relative flex flex-row gap-2 w-full md:w-auto p-1">
                        <button
                            onClick={handleCopy}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 md:px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 flex-1 md:min-w-[100px] shadow-[0_4px_10px_rgba(37,99,235,0.3)]"
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="hidden md:inline">{t('copied')}</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                    <span className="text-sm">{t('copy')}</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-900 dark:text-white py-3 px-4 md:px-5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 flex-1 md:flex-none"
                            title={t('new_tooltip')}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            <span className="text-sm font-semibold">{t('new')}</span>
                        </button>
                        <button
                            onClick={() => setShowQR(!showQR)}
                            className={`group relative py-3 px-4 rounded-xl transition-all active:scale-95 border flex items-center justify-center shadow-sm ${showQR ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-[#111] border-gray-200 dark:border-[#222] text-gray-700 dark:text-gray-300'}`}
                            aria-label="Show QR Code"
                        >
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                            <div className="md:hidden absolute top-full right-0 mt-2 px-2 py-1 bg-gray-900 border border-gray-700 text-white text-[11px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] pointer-events-none max-w-[120px]">{t('scan_qr')}</div>
                        </button>
                    </div>
                </div>

                {/* QR Code Popover (Better Placement) */}
                {showQR && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-20 animate-in slide-in-from-bottom-2 fade-in duration-200">
                        <div className="bg-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col items-center">
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100"></div>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('mailto:' + email)}`}
                                alt="QR Code"
                                className="w-40 h-40"
                            />
                            <span className="text-[11px] text-gray-500 mt-2 font-mono uppercase tracking-widest font-bold">{t('scan_qr')}</span>
                        </div>
                    </div>
                )}

                {/* Progress Bar & Countdown */}
                <div className="mt-4 px-4">
                    <div className="flex justify-between items-center mb-1 text-[11px] md:text-xs font-mono uppercase tracking-widest text-gray-500">
                        <span className="flex items-center gap-1.5 font-bold">
                            {t('expiring')}
                        </span>
                        <span className="text-blue-500 font-black">{formatTime(timeLeft)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-[#222] rounded-full overflow-hidden shadow-inner">
                        <div
                            className={`h-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)] ${progress < 20 ? 'bg-red-500' : 'bg-blue-600'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-8 dark:text-gray-300">
                {t('auto_delete')} <a href="/faq" className="text-blue-700 dark:text-blue-400 cursor-pointer hover:underline font-bold underline underline-offset-4" aria-label="Learn more about email expiration">{t('learn_more')}</a>
            </p>
        </div>
    );
};
