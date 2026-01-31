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
                            and maintain anonymity while signing up for newsletters or testing services. It acts as a shield between your real identity and the internet.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Can I use this for social media accounts?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            While you can use DisposeMail for social media signups, we **strongly discourage** it for accounts you intend to keep.
                            If you lose access or need to verify your identity later, you won't be able to access this temporary email again.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Can I choose my own username?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Yes! Use the **"Personalize Address"** button on the homepage to set a custom name like `myname@disposemail.xyz`.
                            This allows you to create recognizable addresses for specific services.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">What is groundtips.com or other domains?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            These are secondary domains we use to ensure our service remains accessible. Some websites block popular temporary email providers;
                            switching between domains helps you bypass these restrictions.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Does DisposeMail support attachments?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Currently, we focus on the text and HTML content of emails. Support for file attachments is a high-priority feature
                            currently in our development roadmap.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">How many addresses can I have?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            There are no limits! You can generate as many addresses as you need by clicking the refresh button.
                            Each one will have its own independent inbox.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Is DisposeMail free?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Yes, the service is 100% free and requires no registration. We support the site through
                            non-intrusive advertisements and donations.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">What happens to my data?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Once your 60 minutes are up, the inbox and all contained emails are purged from our servers.
                            The data is shredded and cannot be retrieved by us or anyone else.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Is this legal?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Absolutely. Using a temporary email is a perfectly legal way to protect your privacy online and
                            reduce the amount of unwanted marketing emails (spam) in your secondary inbox.
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
