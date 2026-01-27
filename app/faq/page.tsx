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
                            Emails and the temporary address itself are automatically deleted permanently after 1 hour (60 minutes).
                            Once deleted, they cannot be recovered.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Is it really private?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Yes. We do not require any registration, we do not track your real IP address, and we do not store logs of your activity.
                            Emails are stored in a temporary database that is wiped largely every hour.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Can I send emails?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            No. To prevent abuse and spam, DisposeMail is a receive-only service.
                            You can only receive emails to your generated address.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] p-6 rounded-2xl shadow-sm transition-colors">
                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-200">Why does the address change?</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            If you refresh and clear your browser storage, you get a new address.
                            This is a feature, not a bug, ensuring you always have a fresh identity when needed.
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
