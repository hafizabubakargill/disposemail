'use client';

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        honeypot: '', // Anti-spam hidden field
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.honeypot) return; // Silent discard for bots

        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '', honeypot: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
                    Contact Us<span className="text-blue-600">.</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
                    Have questions, suggestions, or need technical support?
                    Drop us a message and our team will get back to you within 24 hours.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                        <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Business Inquiries</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">For partnership opportunities, high-volume API access, or custom domain integrations.</p>
                        <a href="mailto:support@disposemail.xyz" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">support@disposemail.xyz</a>
                    </div>

                    <div className="p-8 rounded-3xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#222]">
                        <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Quick Links</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Frequently Asked Questions</Link>
                            <Link href="/api-docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">API Documentation</Link>
                            <Link href="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Latest Updates</Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] p-8 md:p-10 rounded-[32px] shadow-2xl">
                    {status === 'success' ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Message Sent!</h3>
                            <p className="text-gray-600 dark:text-gray-400">Thank you for reaching out. We've received your inquiry.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-sm font-bold text-blue-600 hover:underline px-6"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* HONEYPOT - DO NOT FILL */}
                            <div className="hidden" aria-hidden="true">
                                <input
                                    type="text"
                                    name="honeypot"
                                    value={formData.honeypot}
                                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#161616] border border-gray-100 dark:border-[#222] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#161616] border border-gray-100 dark:border-[#222] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="How can we help you?"
                                    className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#161616] border border-gray-100 dark:border-[#222] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                disabled={status === 'loading'}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {status === 'loading' ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </>
                                )}
                            </button>

                            {status === 'error' && (
                                <p className="text-center text-xs text-red-500 font-bold">Something went wrong. Please try again or email us directly.</p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
