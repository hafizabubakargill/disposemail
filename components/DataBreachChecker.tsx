"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

export default function DataBreachChecker() {
    const t = useTranslations('DataBreach');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'safe' | 'pwned' | 'error'>('idle');
    const [breaches, setBreaches] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const cleanEmail = email.trim();
        if (!cleanEmail || !cleanEmail.includes('@')) {
            setStatus('error');
            setErrorMessage(t('invalidEmail'));
            return;
        }

        setStatus('loading');
        setErrorMessage('');
        setBreaches([]);

        try {
            const res = await fetch(`/api/breach?email=${encodeURIComponent(cleanEmail)}`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || t('fetchError'));
            }

            if (data.safe) {
                setStatus('safe');
            } else {
                setStatus('pwned');
                setBreaches(data.breaches || []);
            }
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || t('fetchError'));
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto backdrop-blur-md bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-6 sm:p-10 transition-colors">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-4 text-center">
                {t('title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8 transition-colors">
                {t('subtitle')}
            </p>

            <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. your.real.email@gmail.com"
                        className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all font-mono"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading' || !email.includes('@')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] shadow-blue-500/20 whitespace-nowrap flex items-center justify-center min-w-[120px]"
                >
                    {status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        t('checkButton')
                    )}
                </button>
            </form>

            <div className="transition-all duration-300">
                {status === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-12 text-blue-400 animate-pulse">
                        <Search className="w-12 h-12 mb-4" />
                        <p className="font-medium">{t('scanningDatabase')}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">{t('errorTitle')}</p>
                            <p className="text-sm opacity-80">{errorMessage}</p>
                        </div>
                    </div>
                )}

                {status === 'safe' && (
                    <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-xl flex flex-col items-center justify-center text-center gap-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-green-400 mb-2">{t('safeTitle')}</h3>
                            <p className="text-green-400/80">{t('safeDesc')}</p>
                        </div>
                    </div>
                )}

                {status === 'pwned' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-t-xl flex flex-col items-center justify-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center relative overflow-hidden">
                                <AlertTriangle className="w-8 h-8 text-red-500 z-10" />
                                <div className="absolute inset-0 bg-red-500/20 animate-ping"></div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-red-500 mb-1">{t('pwnedTitle')}</h3>
                                <p className="text-red-400/90 font-medium">
                                    {t('pwnedDesc').replace('{count}', breaches.length.toString())}
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-black/40 border border-t-0 border-gray-200 dark:border-white/5 rounded-b-xl p-6 transition-colors">
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">
                                {t('breachSources')}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {breaches.map((breach, idx) => (
                                    <div key={idx} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                                        <span className="text-gray-800 dark:text-gray-200 font-mono text-sm truncate" title={breach}>
                                            {breach}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
