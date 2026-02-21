import React from 'react';

export default function FAQ() {
    return (
        <main className="min-h-screen bg-transparent text-foreground p-8 md:p-24 relative overflow-hidden transition-colors">
            <div className="max-w-4xl mx-auto z-10 relative">
                <h1 className="text-4xl md:text-6xl font-black mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tighter">
                    Help Center & FAQ
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
                                <span className="w-8 h-px bg-blue-600"></span> Fundamental Questions
                            </h2>
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] p-6 rounded-3xl shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">What is DisposeMail?</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        DisposeMail is a privacy-first utility that provides instant temporary email addresses. These are used to protect your real identity and primary inbox from junk mail, spam, and data-gathering websites.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] p-6 rounded-3xl shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">How long do emails last?</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Every address and every received email is automatically purged from our system after exactly **60 minutes**. This ensures that no legacy data remains on our servers for prying eyes.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] p-6 rounded-3xl shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Is this service legal?</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Yes. Using a temporary email is a legal and common method to protect your online privacy and reduce the amount of unsolicited marketing (spam) that clogs up the internet.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-purple-600 mb-6 flex items-center gap-2">
                                <span className="w-8 h-px bg-purple-600"></span> Technical & Security
                            </h2>
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] p-6 rounded-3xl shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Can I recover deleted emails?</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        No. Once an email is deleted (either manually or by the 60-minute timer), it is permanently wiped from our RAM-based storage. We do not keep backups or archival data.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] p-6 rounded-3xl shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Why use custom domains?</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Some websites maintain "blacklists" of common temporary email domains. By providing multiple domains, we allow you to bypass these restrictions and sign up for services that might block others.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-[#222] p-6 rounded-3xl shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Does it support attachments?</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Yes, our system parses full MIME content. While we focus on making the text and HTML content readable, we also allow you to see and process message structures completely.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <section className="mt-12 bg-blue-600 text-white p-12 rounded-[40px] shadow-2xl shadow-blue-600/30">
                    <h2 className="text-3xl font-black tracking-tight mb-4">Still have questions?</h2>
                    <p className="text-blue-100 max-w-xl mb-8">
                        Our goal is to provide the most reliable temporary email service on the web. If you're experiencing issues or have suggestions, our community is here to help.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="mailto:support@disposemail.xyz" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                            Email Support
                        </a>
                        <a href="/" className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform border border-blue-500/50">
                            Create Email Now
                        </a>
                    </div>
                </section>

                <div className="mt-20 text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Secure & Anonymous</p>
                    <a href="/" className="text-gray-900 dark:text-white hover:text-blue-600 transition-colors font-black">← Return to Homepage</a>
                </div>
            </div>
        </main>
    );
}
