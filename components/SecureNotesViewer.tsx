"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldX, AlertTriangle, FileText, LockKeyhole, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SecureNotesViewer({ noteId }: { noteId: string }) {
    const t = useTranslations('SecureNotes');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'loading' | 'success' | 'not_found' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await fetch(`/api/notes/${noteId}`);
                const data = await res.json();

                if (res.status === 404 || !data.success) {
                    setStatus('not_found');
                    return;
                }

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to decrypt note');
                }

                setContent(data.content);
                setStatus('success');
            } catch (error: any) {
                setStatus('error');
                setErrorMessage(error.message);
            }
        };

        fetchNote();
    }, [noteId]);

    const copyBody = async () => {
        try {
            await navigator.clipboard.writeText(content);
        } catch (err) {}
    };

    if (status === 'loading') {
        return (
            <div className="w-full max-w-3xl mx-auto backdrop-blur-md bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 transition-colors">
                <div className="w-12 h-12 border-4 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin mb-6"></div>
                <p className="font-mono animate-pulse">{t('decrypting')}...</p>
            </div>
        );
    }

    if (status === 'not_found' || status === 'error') {
        return (
            <div className="w-full max-w-3xl mx-auto backdrop-blur-md bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-8 sm:p-12 text-center animate-in fade-in zoom-in duration-300 transition-colors">
                <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <ShieldX className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('destroyedTitle')}</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8 text-lg">
                    {t('destroyedDesc')}
                </p>
                <Link
                    href="/secure-notes"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-xl transition-all"
                >
                    <FileText className="w-4 h-4" />
                    {t('backToCreator')}
                </Link>
            </div>
        );
    }

    // SUCCESS - Dislaying the note
    return (
        <div className="w-full max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700 fade-in">
            {/* Critical Warning Header */}
            <div className="bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 sm:p-6 rounded-t-2xl flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-1">{t('readingWarningTitle')}</h3>
                    <p className="text-red-600 dark:text-red-300/80 leading-relaxed text-sm sm:text-base">
                        {t('readingWarningDesc')}
                    </p>
                </div>
            </div>

            {/* Note Content */}
            <div className="backdrop-blur-md bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 border-t-0 rounded-b-2xl p-6 sm:p-10 shadow-xl dark:shadow-2xl relative transition-colors">
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 rounded-full text-indigo-600 dark:text-indigo-300 text-xs font-mono">
                    <LockKeyhole className="w-3 h-3" /> E2E Encrypted
                </div>

                <div className="mt-8 mb-8 p-6 bg-gray-50 dark:bg-black/40 rounded-xl border border-gray-200 dark:border-white/5 relative group transition-colors">
                    <pre className="text-gray-900 dark:text-gray-200 font-mono whitespace-pre-wrap break-words custom-scrollbar leading-relaxed">
                        {content}
                    </pre>

                    {/* Copy button appears on hover */}
                    <button 
                        onClick={copyBody}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-md text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy to clipboard"
                    >
                        <FileText className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex justify-center mt-12">
                     <Link
                        href="/secure-notes"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 shadow-sm dark:shadow-none rounded-xl transition-all"
                    >
                        <EyeOff className="w-4 h-4" />
                        {t('closeAndDestroyLocally')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
