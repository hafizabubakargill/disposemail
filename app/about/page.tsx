import React from 'react';

export default function About() {
    return (
        <main className="min-h-screen bg-[#050505] text-white p-8 md:p-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="max-w-3xl mx-auto z-10 relative">
                <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    About DisposeMail
                </h1>

                <div className="prose prose-invert prose-lg text-gray-400">
                    <p>
                        In an age of constant surveillance and data breaches, <strong>DisposeMail</strong> was built with a single mission:
                        to protect your primary inbox and personal identity.
                    </p>
                    <p>
                        Every time you sign up for a newsletter, trial, or app, you risk exposing your email to spammers and hackers.
                        DisposeMail provides an instant, secure buffer.
                    </p>

                    <h3 className="text-gray-200 mt-8">Our Technology</h3>
                    <p>
                        We utilize modern cloud infrastructure (Cloudflare Edge & Secure VPS) to route emails without permanent storage.
                        Our frontend connects directly via encrypted WebSockets to deliver messages in milliseconds.
                    </p>

                    <h3 className="text-gray-200 mt-8">Open Source</h3>
                    <p>
                        We believe privacy tools should be transparent. That's why portions of our code are open to inspection.
                        Trust is earned, not given.
                    </p>
                </div>

                <div className="mt-12 pt-8 border-t border-[#222]">
                    <a href="/" className="text-blue-500 hover:text-blue-400 transition-colors">← Create Temporary Email</a>
                </div>
            </div>
        </main>
    );
}
