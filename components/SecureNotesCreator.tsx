"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Lock, FileText, Link as LinkIcon, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SecureNotesCreator() {
    const t = useTranslations('SecureNotes');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [shareUrl, setShareUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) return;

        setStatus('loading');
        setErrorMessage('');
        setCopied(false);

        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || t('createError'));
            }

            const url = `${window.location.origin}/secure-notes/${data.id}`;
            setShareUrl(url);
            setStatus('success');
            setContent(''); // Clear the textarea for safety
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || t('createError'));
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const createNew = () => {
        setStatus('idle');
        setShareUrl('');
        setContent('');
    };

    return (
        <div className="w-full max-w-3xl mx-auto backdrop-blur-md bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-6 sm:p-10 relative overflow-hidden transition-colors">
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

            <div className="flex flex-col items-center mb-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4 border border-indigo-500/30">
                    <Lock className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('creatorTitle')}</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">{t('creatorSubtitle')}</p>
            </div>

            {status === 'idle' || status === 'loading' || status === 'error' ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t('textareaPlaceholder')}
                            className="w-full h-48 md:h-64 p-5 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-600 resize-none transition-all font-mono custom-scrollbar"
                            required
                            disabled={status === 'loading'}
                        />
                        <div className="absolute bottom-4 right-4 flex items-center text-xs text-gray-600 dark:text-gray-500 gap-1 bg-white dark:bg-black/80 px-2 py-1 rounded-md border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                            <ShieldAlert className="w-3 h-3 text-yellow-500" />
                            {t('burnWarning')}
                        </div>
                    </div>

                    {status === 'error' && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading' || !content.trim()}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                {t('encrypting')}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                {t('createButton')}
                            </span>
                        )}
                    </button>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border-2 border-green-500/50 relative">
                        <CheckCircle2 className="w-10 h-10 text-green-400 z-10" />
                        <div className="absolute inset-0 bg-green-400/20 animate-ping rounded-full"></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('successTitle')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-sm">
                        {t('successDesc')}
                    </p>

                    <div className="w-full bg-indigo-50 dark:bg-black/50 border border-indigo-200 dark:border-indigo-500/30 rounded-xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-8 transition-colors">
                        <div className="flex-1 flex items-center px-4 py-3 bg-white dark:bg-black/40 border-r border-indigo-100 dark:border-transparent rounded-lg overflow-hidden relative group shadow-inner dark:shadow-none">
                            <LinkIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0" />
                            <span className="text-indigo-700 dark:text-indigo-300 font-mono text-sm truncate select-all">{shareUrl}</span>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                                copied 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-500'
                            }`}
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? t('copied') : t('copy')}
                        </button>
                    </div>

                    <button
                        onClick={createNew}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline underline-offset-4 text-sm"
                    >
                        {t('createNew')}
                    </button>
                </div>
            )}
        </div>
    );
}
