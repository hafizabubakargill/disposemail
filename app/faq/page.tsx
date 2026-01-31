import React from 'react';

export default function FAQ() {
    return (
        <main className="min-h-screen bg-background text-foreground p-8 md:p-24 relative overflow-hidden transition-colors">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="max-w-4xl mx-auto z-10 relative">
                <h1 className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                    Frequently Asked Questions
                </h1>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">How long do emails last?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Every incoming email and the mailbox itself is automatically deleted after **1 hour** of inactivity.
                            We do not offer recovery services for deleted data, ensuring your privacy is absolute.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">What are the benefits of Disposable Email?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Using a temporary email like DisposeMail helps you avoid spam, protect your primary email address from data breaches,
                            and maintain anonymity while signing up for newsletters or testing services.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Is it safe for verification?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Yes. Most websites accept our domains for OTPs and verification links. However, we recommend
                            **not** using disposable emails for critical accounts (like banking) since the address is temporary.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Can I choose my own username?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Yes! Use the **"Personalize Address"** button on the homepage to set a custom name like `myname@disposemail.xyz`.
                            This is perfect for professional-looking temporary communication.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-500">
                    <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">← Back to Home</a>
                </div>
            </div>
        </main>
    );
}
