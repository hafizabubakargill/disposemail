import React from 'react';

export default function About() {
    return (
        <main className="min-h-screen bg-transparent text-foreground p-8 md:p-24 relative overflow-hidden transition-colors">
            <div className="max-w-4xl mx-auto z-10 relative">
                <h1 className="text-4xl md:text-6xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tighter">
                    About DisposeMail
                </h1>

                <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400 max-w-none space-y-8">
                    <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-[#222] shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                        <p>
                            In an age of constant surveillance and data breaches, <strong>DisposeMail</strong> was built with a single mission:
                            to protect your primary inbox and personal identity. We believe that privacy is a fundamental human right,
                            not a luxury. Our service provides a temporary shield between your real self and the vast, often tracking-heavy world of the internet.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-[#222] shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why we exist</h2>
                            <p>
                                Every time you sign up for a newsletter, trial, or app, you risk exposing your email to spammers, trackers, and potential hackers.
                                Once your email is on a "list," it's there forever. DisposeMail provides an instant, secure buffer that allows you to access the web
                                without the long-term baggage of spam.
                            </p>
                        </section>

                        <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-[#222] shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Technology</h2>
                            <p>
                                We utilize modern cloud infrastructure leveraging Cloudflare Edge networks and secure VPS nodes to route emails instantly.
                                Unlike other providers, we don't store your data in a persistent database. Our high-performance WebSocket architecture
                                ensures that when an email arrives, it's displayed on your screen in real-time.
                            </p>
                        </section>
                    </div>

                    <section className="bg-blue-600/5 dark:bg-blue-600/10 p-8 rounded-3xl border border-blue-600/20 shadow-sm">
                        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Commitment to Privacy</h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li><strong>Zero Logs:</strong> We don't log IP addresses or user agents.</li>
                            <li><strong>Auto-Purge:</strong> Every bit of data is shredded every 60 minutes.</li>
                            <li><strong>No Registration:</strong> We don't ask for your name, phone number, or real email.</li>
                            <li><strong>Encrypted:</strong> All traffic is served over SSL/TLS for maximum security.</li>
                        </ul>
                    </section>

                    <section className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-[#222] shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Transparency</h2>
                        <p>
                            We believe privacy tools should be transparent. While we operate a complex infrastructure to maintain speed and reliability,
                            we are committed to remaining an open and community-focused platform. If you have questions about how our service works,
                            feel free to reach out to our team.
                        </p>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-[#222] flex justify-between items-center">
                    <a href="/" className="text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400 font-bold uppercase tracking-widest text-xs transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Inbox
                    </a>
                </div>
            </div>
        </main>
    );
}
