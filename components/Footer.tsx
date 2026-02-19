'use client';

import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-[#1f1f1f] py-12 px-6 mt-auto">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <Link href="/" className="flex items-center space-x-3 mb-2 hover:opacity-80 transition-opacity">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">DisposeMail</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase">v1.0</span>
                    </Link>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium font-bold">© 2026 DisposeMail. Secure, anonymous, temporary.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">
                    <Link href="/api-docs" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">API</Link>
                    <Link href="/faq" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">FAQ</Link>
                    <Link href="/privacy" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
