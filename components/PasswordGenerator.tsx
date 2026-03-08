'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function PasswordGenerator() {
    const t = useTranslations('PasswordGenerator');
    
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    const generatePassword = useCallback(() => {
        let charset = '';
        if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (numbers) charset += '0123456789';
        if (symbols) charset += '!@#$&*-_=+?';

        if (charset.length === 0) {
            setPassword('');
            return;
        }

        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        
        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charset[array[i] % charset.length];
        }
        
        setPassword(newPassword);
        setCopied(false);
    }, [length, uppercase, lowercase, numbers, symbols]);

    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const handleCopy = async () => {
        if (!password) return;
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const calculateStrength = () => {
        if (!password) return { label: 'weak', color: 'bg-red-500', width: '0%' };
        let score = 0;
        if (password.length > 8) score += 1;
        if (password.length > 12) score += 1;
        if (password.length >= 16) score += 1;
        if (uppercase) score += 1;
        if (lowercase) score += 1;
        if (numbers) score += 1;
        if (symbols) score += 1;

        if (score <= 3) return { label: t('weak'), color: 'bg-red-500', width: '25%' };
        if (score <= 5) return { label: t('good'), color: 'bg-amber-500', width: '50%' };
        if (score <= 6) return { label: t('strong'), color: 'bg-green-500', width: '75%' };
        return { label: t('very_strong'), color: 'bg-indigo-500', width: '100%' };
    };

    const strength = calculateStrength();

    return (
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {/* Display Area */}
            <div className="relative mb-8">
                <div className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 break-all">
                    <span className={`text-2xl sm:text-3xl font-mono tracking-tight font-bold ${password ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                        {password || 'Select options...'}
                    </span>
                    <button 
                        onClick={handleCopy}
                        disabled={!password}
                        className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                            copied 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                <span>{t('copied')}</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                <span>{t('copy')}</span>
                            </>
                        )}
                    </button>
                </div>
                
                {/* Strength Meter */}
                <div className="mt-4 flex items-center gap-4 px-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 w-24">{t('strength')}</span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ease-out ${strength.color}`} style={{ width: strength.width }}></div>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${strength.color.replace('bg-', 'text-')} w-24 text-right`}>{strength.label}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
                {/* Length Slider */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('length')}</label>
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">{length}</span>
                    </div>
                    <input 
                        type="range" 
                        min="8" 
                        max="64" 
                        value={length} 
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-100 dark:bg-[#222] rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Toggles */}
                    {[
                        { label: t('uppercase'), state: uppercase, setter: setUppercase },
                        { label: t('lowercase'), state: lowercase, setter: setLowercase },
                        { label: t('numbers'), state: numbers, setter: setNumbers },
                        { label: t('symbols'), state: symbols, setter: setSymbols },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-[#222] bg-gray-50/50 dark:bg-[#111]">
                            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                            <button 
                                onClick={() => item.setter(!item.state)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.state ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.state ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={generatePassword}
                    className="w-full mt-4 py-4 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    <span>{t('generate')}</span>
                </button>
            </div>
        </div>
    );
}
